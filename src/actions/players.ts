"use server";

import { createServerClient } from "@/lib/supabase";
import { Player, PlayerStats, PlayerStatsRow } from "@/lib/types";
import { POINTS_MAP } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getPlayers(): Promise<Player[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as Player[];
}

export async function createPlayer(
  name: string,
  avatarUrl?: string | null,
  position?: string | null
): Promise<Player> {
  const supabase = createServerClient();
  const insert: Record<string, unknown> = { name: name.trim() };
  if (avatarUrl) insert.avatar_url = avatarUrl;
  if (position) insert.position = position;

  const { data, error } = await supabase
    .from("players")
    .insert(insert)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/players");
  return data as Player;
}

export async function deletePlayer(id: string): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase.from("players").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/players");
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw error;
  }
  return data as Player;
}

export async function getPlayerStats(playerId: string): Promise<PlayerStats> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("player_stats")
    .select("*")
    .eq("player_id", playerId);

  if (error) throw error;

  const rows = data as PlayerStatsRow[];

  // Count unique video_ids = total games
  const videoIds = new Set(rows.map((r) => r.video_id));
  const totalGames = videoIds.size;

  if (totalGames === 0) {
    return {
      totalGames: 0, totalPoints: 0, ppg: 0,
      fgPct: null, twoPtPct: null, threePtPct: null, ftPct: null,
      apg: 0, rpg: 0,
    };
  }

  // Sum counts by event_type
  const counts: Record<string, number> = {};
  for (const r of rows) {
    counts[r.event_type] = (counts[r.event_type] || 0) + r.count;
  }

  const get = (type: string) => counts[type] || 0;

  const twoPtMade = get("2pt made");
  const twoPtMissed = get("2pt missed");
  const threePtMade = get("3pt made");
  const threePtMissed = get("3pt missed");
  const ftMade = get("Free Throw Made");
  const ftMissed = get("Free Throw Missed");
  const assists = get("Assist");
  const rebounds = get("Rebound");

  let totalPoints = 0;
  for (const r of rows) {
    const pts = (POINTS_MAP as Record<string, number>)[r.event_type] ?? 0;
    totalPoints += r.count * pts;
  }

  const fgMade = twoPtMade + threePtMade;
  const fgAttempts = fgMade + twoPtMissed + threePtMissed;
  const twoPtAttempts = twoPtMade + twoPtMissed;
  const threePtAttempts = threePtMade + threePtMissed;
  const ftAttempts = ftMade + ftMissed;

  const pct = (made: number, attempts: number) =>
    attempts > 0 ? Math.round((made / attempts) * 1000) / 10 : null;

  return {
    totalGames,
    totalPoints,
    ppg: Math.round((totalPoints / totalGames) * 10) / 10,
    fgPct: pct(fgMade, fgAttempts),
    twoPtPct: pct(twoPtMade, twoPtAttempts),
    threePtPct: pct(threePtMade, threePtAttempts),
    ftPct: pct(ftMade, ftAttempts),
    apg: Math.round((assists / totalGames) * 10) / 10,
    rpg: Math.round((rebounds / totalGames) * 10) / 10,
  };
}
