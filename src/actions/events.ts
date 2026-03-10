"use server";

import { createServerClient } from "@/lib/supabase";
import { Event, PlayerGameRow, PlayerStatsRow } from "@/lib/types";
import { POINTS_MAP } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getEventsByVideoId(videoId: string): Promise<Event[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, player:players(*)")
    .eq("video_id", videoId)
    .order("timestamp");

  if (error) throw error;
  return data as Event[];
}

export async function getPlayerGames(playerId: string): Promise<PlayerGameRow[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("player_stats")
    .select("*, video:videos(title, created_at)")
    .eq("player_id", playerId);

  if (error) throw error;

  const rows = data as (PlayerStatsRow & { video: { title: string; created_at: string } })[];

  // Group by video_id
  const byVideo = new Map<string, PlayerGameRow>();
  for (const row of rows) {
    let game = byVideo.get(row.video_id);
    if (!game) {
      game = {
        video_id: row.video_id,
        video_title: row.video.title,
        video_created_at: row.video.created_at,
        pts: 0, ast: 0, reb: 0, stl: 0, blk: 0, tov: 0, fls: 0,
      };
      byVideo.set(row.video_id, game);
    }
    const points = (POINTS_MAP as Record<string, number>)[row.event_type] ?? 0;
    game.pts += row.count * points;
    if (row.event_type === "Assist") game.ast += row.count;
    if (row.event_type === "Rebound") game.reb += row.count;
    if (row.event_type === "Steal") game.stl += row.count;
    if (row.event_type === "Block") game.blk += row.count;
    if (row.event_type === "Turnover") game.tov += row.count;
    if (row.event_type === "Foul") game.fls += row.count;
  }

  return Array.from(byVideo.values()).sort(
    (a, b) => new Date(b.video_created_at).getTime() - new Date(a.video_created_at).getTime()
  );
}

async function incrementPlayerStat(playerId: string, videoId: string, eventType: string) {
  const supabase = createServerClient();
  const { data: existing } = await supabase
    .from("player_stats")
    .select("id, count")
    .eq("player_id", playerId)
    .eq("video_id", videoId)
    .eq("event_type", eventType)
    .single();

  if (existing) {
    await supabase
      .from("player_stats")
      .update({ count: existing.count + 1 })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("player_stats")
      .insert({ player_id: playerId, video_id: videoId, event_type: eventType, count: 1 });
  }
}

async function decrementPlayerStat(playerId: string, videoId: string, eventType: string) {
  const supabase = createServerClient();
  const { data: stats } = await supabase
    .from("player_stats")
    .select("id, count")
    .eq("player_id", playerId)
    .eq("video_id", videoId)
    .eq("event_type", eventType)
    .single();

  if (stats) {
    if (stats.count <= 1) {
      await supabase.from("player_stats").delete().eq("id", stats.id);
    } else {
      await supabase
        .from("player_stats")
        .update({ count: stats.count - 1 })
        .eq("id", stats.id);
    }
  }
}

export async function createEvent(
  videoId: string,
  playerId: string,
  eventType: string,
  timestamp: number
): Promise<Event> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("events")
    .insert({
      video_id: videoId,
      player_id: playerId,
      event_type: eventType,
      timestamp,
    })
    .select("*, player:players(*)")
    .single();

  if (error) throw error;

  await incrementPlayerStat(playerId, videoId, eventType);

  revalidatePath(`/videos/${videoId}`);
  revalidatePath(`/players/${playerId}`);
  return data as Event;
}

export async function deleteEvent(id: string, videoId: string): Promise<void> {
  const supabase = createServerClient();

  const { data: event, error: fetchError } = await supabase
    .from("events")
    .select("player_id, event_type")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;

  await decrementPlayerStat(event.player_id, videoId, event.event_type);

  revalidatePath(`/videos/${videoId}`);
  revalidatePath(`/players/${event.player_id}`);
}
