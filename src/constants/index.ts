/** Canonical event-type identifiers — never use raw strings outside this file */
export const EventType = {
  TwoPtMade: "2pt made",
  TwoPtMissed: "2pt missed",
  ThreePtMade: "3pt made",
  ThreePtMissed: "3pt missed",
  Assist: "Assist",
  Rebound: "Rebound",
  Turnover: "Turnover",
  Steal: "Steal",
  Block: "Block",
  Foul: "Foul",
  FreeThrowMade: "Free Throw Made",
  FreeThrowMissed: "Free Throw Missed",
  Timeout: "Timeout",
  JumpBall: "Jump Ball",
  ShotclockViolation: "Shotclock Violation",
  EndOfQuarter: "End of Quarter",
  EndOfGame: "End of Game",
} as const;

export type EventTypeValue = (typeof EventType)[keyof typeof EventType];

/** All event types (used for dropdown) */
export const EVENT_TYPES: readonly EventTypeValue[] = Object.values(EventType);

/** Event types that belong to the team rather than a specific player */
export const TEAM_EVENT_TYPES: ReadonlySet<EventTypeValue> = new Set([
  EventType.Timeout,
  EventType.JumpBall,
  EventType.ShotclockViolation,
  EventType.EndOfQuarter,
  EventType.EndOfGame,
]);

/** Points scored per occurrence of each event type */
export const POINTS_MAP: Partial<Record<EventTypeValue, number>> = {
  [EventType.TwoPtMade]: 2,
  [EventType.ThreePtMade]: 3,
  [EventType.FreeThrowMade]: 1,
};

/** Stat category for display grouping */
export const STAT_CATEGORIES: Record<string, EventTypeValue[]> = {
  "FG Made": [EventType.TwoPtMade, EventType.ThreePtMade],
  "FG Missed": [EventType.TwoPtMissed, EventType.ThreePtMissed],
  "2PT Made": [EventType.TwoPtMade],
  "2PT Missed": [EventType.TwoPtMissed],
  "3PT Made": [EventType.ThreePtMade],
  "3PT Missed": [EventType.ThreePtMissed],
  "FT Made": [EventType.FreeThrowMade],
  "FT Missed": [EventType.FreeThrowMissed],
  AST: [EventType.Assist],
  REB: [EventType.Rebound],
  STL: [EventType.Steal],
  BLK: [EventType.Block],
  TOV: [EventType.Turnover],
  FLS: [EventType.Foul],
};

export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
