import { createServerClient } from "@/lib/supabase";
import { Event } from "@/types";

export async function findEventsByVideoId(videoId: string): Promise<Event[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, player:players(*)")
    .eq("video_id", videoId)
    .order("timestamp");

  if (error) throw error;
  return data as Event[];
}

export async function findEventById(id: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("player_id, event_type")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function insertEvent(
  videoId: string,
  playerId: string | null,
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
  return data as Event;
}

export async function removeEvent(id: string): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}
