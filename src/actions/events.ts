"use server";

import { createServerClient } from "@/lib/supabase";
import { Event } from "@/lib/types";
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
  revalidatePath(`/videos/${videoId}`);
  return data as Event;
}

export async function deleteEvent(id: string, videoId: string): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) throw error;
  revalidatePath(`/videos/${videoId}`);
}
