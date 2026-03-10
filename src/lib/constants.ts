export const EVENT_TYPES = [
  "Shot Made",
  "Shot Missed",
  "Assist",
  "Rebound",
  "Turnover",
  "Steal",
  "Block",
  "Foul",
  "Free Throw Made",
  "Free Throw Missed",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
