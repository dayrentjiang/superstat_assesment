"use server";

import { Event, PlayerGameRow } from "@/types";
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
  playerId: string | null,
  eventType: string,
  timestamp: number,
): Promise<Event> {
  const event = await insertEvent(videoId, playerId, eventType, timestamp);
  if (playerId) {
    await incrementPlayerStat(playerId, videoId, eventType);
    revalidatePath(`/players/${playerId}`);
  }

  revalidatePath(`/videos/${videoId}`);
  return event;
}

export async function deleteEvent(id: string, videoId: string): Promise<void> {
  const event = await findEventById(id);
  if (!event) {
    throw new Error(`Event not found: ${id}`);
  }
  await removeEvent(id);
  if (event.player_id) {
    await decrementPlayerStat(event.player_id, videoId, event.event_type);
    revalidatePath(`/players/${event.player_id}`);
  }

  revalidatePath(`/videos/${videoId}`);
}
