export const EVENT_TYPES = [
  "2pt made",
  "2pt missed",
  "3pt made",
  "3pt missed",
  "Assist",
  "Rebound",
  "Turnover",
  "Steal",
  "Block",
  "Foul",
  "Free Throw Made",
  "Free Throw Missed",
  "Timeout",
  "Jump Ball",
  "Shotclock Violation",
  "End of Quarter",
  "End of Game",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

/** Event types that belong to the team rather than a specific player */
export const TEAM_EVENT_TYPES: ReadonlySet<string> = new Set([
  "Timeout",
  "Jump Ball",
  "Shotclock Violation",
  "End of Quarter",
  "End of Game",
]);

/** Points scored per occurrence of each event type */
export const POINTS_MAP: Partial<Record<EventType, number>> = {
  "2pt made": 2,
  "3pt made": 3,
  "Free Throw Made": 1,
};

/** Stat category for display grouping */
export const STAT_CATEGORIES: Record<string, EventType[]> = {
  "FG Made": ["2pt made", "3pt made"],
  "FG Missed": ["2pt missed", "3pt missed"],
  "2PT Made": ["2pt made"],
  "2PT Missed": ["2pt missed"],
  "3PT Made": ["3pt made"],
  "3PT Missed": ["3pt missed"],
  "FT Made": ["Free Throw Made"],
  "FT Missed": ["Free Throw Missed"],
  AST: ["Assist"],
  REB: ["Rebound"],
  STL: ["Steal"],
  BLK: ["Block"],
  TOV: ["Turnover"],
  FLS: ["Foul"],
};

export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
