"use server";

import { Event, PlayerGameRow } from "@/lib/types";
import { revalidatePath } from "next/cache";
import {
  findEventsByVideoId,
  findEventById,
  insertEvent,
  removeEvent,
} from "@/services/event-service";
import {
  incrementPlayerStat,
  decrementPlayerStat,
  getPlayerGames as getPlayerGamesFromService,
} from "@/services/player-stats-service";

export async function getEventsByVideoId(videoId: string): Promise<Event[]> {
  return findEventsByVideoId(videoId);
}

export async function getPlayerGames(
  playerId: string,
): Promise<PlayerGameRow[]> {
  return getPlayerGamesFromService(playerId);
}

export async function createEvent(
  videoId: string,
  playerId: string,
  eventType: string,
  timestamp: number,
): Promise<Event> {
  const event = await insertEvent(videoId, playerId, eventType, timestamp);
  await incrementPlayerStat(playerId, videoId, eventType);

  revalidatePath(`/videos/${videoId}`);
  revalidatePath(`/players/${playerId}`);
  return event;
}

export async function deleteEvent(id: string, videoId: string): Promise<void> {
  const event = await findEventById(id);
  if (!event) {
    throw new Error(`Event not found: ${id}`);
  }
  await removeEvent(id);
  await decrementPlayerStat(event.player_id, videoId, event.event_type);

  revalidatePath(`/videos/${videoId}`);
  revalidatePath(`/players/${event.player_id}`);
}
