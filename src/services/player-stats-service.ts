import { createServerClient } from "@/lib/supabase";
import { PlayerGameRow, PlayerStats, PlayerStatsRow } from "@/lib/types";
import { POINTS_MAP } from "@/lib/constants";

export async function incrementPlayerStat(
  playerId: string,
  videoId: string,
  eventType: string
) {
  const supabase = createServerClient();
  const { data: existing } = await supabase
    .from("player_stats")
    .select("id, count")
    .eq("player_id", playerId)
    .eq("video_id", videoId)
    .eq("event_type", eventType)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("player_stats")
      .update({ count: existing.count + 1 })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("player_stats")
      .insert({ player_id: playerId, video_id: videoId, event_type: eventType, count: 1 });
    if (error) throw error;
  }
}

export async function decrementPlayerStat(
  playerId: string,
  videoId: string,
  eventType: string
) {
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
      const { error } = await supabase.from("player_stats").delete().eq("id", stats.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("player_stats")
        .update({ count: stats.count - 1 })
        .eq("id", stats.id);
      if (error) throw error;
    }
  }
}

export async function getAggregatedStats(playerId: string): Promise<PlayerStats> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("player_stats")
    .select("*")
    .eq("player_id", playerId);

  if (error) throw error;

  const rows = data as PlayerStatsRow[];
  const videoIds = new Set(rows.map((r) => r.video_id));
  const totalGames = videoIds.size;

  if (totalGames === 0) {
    return {
      totalGames: 0, totalPoints: 0, ppg: 0,
      fgPct: null, twoPtPct: null, threePtPct: null, ftPct: null,
      apg: 0, rpg: 0,
    };
  }

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

export async function getPlayerGames(playerId: string): Promise<PlayerGameRow[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("player_stats")
    .select("*, video:videos(title, created_at)")
    .eq("player_id", playerId);

  if (error) throw error;

  const rows = data as (PlayerStatsRow & { video: { title: string; created_at: string } })[];

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
