export interface Video {
  id: string;
  title: string;
  video_url: string;
  created_at: string;
  deleted_at: string | null;
}

export interface Player {
  id: string;
  name: string;
  avatar_url: string | null;
  position: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface Event {
  id: string;
  video_id: string;
  player_id: string;
  event_type: string;
  timestamp: number;
  created_at: string;
  player?: Player;
}

export interface Summary {
  id: string;
  video_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerStatsRow {
  id: string;
  player_id: string;
  video_id: string;
  event_type: string;
  count: number;
}

export interface PlayerStats {
  totalGames: number;
  totalPoints: number;
  ppg: number;
  fgPct: number | null;
  twoPtPct: number | null;
  threePtPct: number | null;
  ftPct: number | null;
  apg: number;
  rpg: number;
}

/** Per-game aggregated stats for the game history table */
export interface PlayerGameRow {
  video_id: string;
  video_title: string;
  video_created_at: string;
  pts: number;
  ast: number;
  reb: number;
  stl: number;
  blk: number;
  tov: number;
  fls: number;
}
