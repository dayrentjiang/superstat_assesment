"use server";

import { Player, PlayerStats } from "@/lib/types";
import { revalidatePath } from "next/cache";
import {
  findAllPlayers,
  findPlayerById,
  insertPlayer,
  removePlayer,
} from "@/services/player-service";
import { getAggregatedStats } from "@/services/player-stats-service";

export async function getPlayers(): Promise<Player[]> {
  return findAllPlayers();
}

export async function createPlayer(
  name: string,
  avatarUrl?: string | null,
  position?: string | null,
): Promise<Player> {
  const player = await insertPlayer(name, avatarUrl, position);
  revalidatePath("/players");
  return player;
}

export async function deletePlayer(id: string): Promise<void> {
  await removePlayer(id);
  revalidatePath("/players");
}

export async function getPlayerById(id: string): Promise<Player | null> {
  return findPlayerById(id);
}

export async function getPlayerStats(playerId: string): Promise<PlayerStats> {
  return getAggregatedStats(playerId);
}
