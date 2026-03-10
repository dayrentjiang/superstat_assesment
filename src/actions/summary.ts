"use server";

import { Event, Summary } from "@/lib/types";
import { formatTimestamp } from "@/lib/constants";
import { chat } from "@/lib/openai";
import { revalidatePath } from "next/cache";
import {
  findSummaryByVideoId,
  upsertSummary,
} from "@/services/summary-service";

export async function getSummary(videoId: string): Promise<Summary | null> {
  return findSummaryByVideoId(videoId);
}

const SYSTEM_PROMPT = `You are a basketball analyst. Summarize this game based on the tagged events. Use markdown but NEVER use headings (#, ##, ###). Use **bold text** for section labels instead.

Format:

**Match Summary**
One concise paragraph on how the game played out, key momentum shifts, and standout performances.

**Top Performer**
- Name (Position): Key stat line (e.g. 6 PTS, 2/3 FG, 1 AST)

**Honorable Mentions**
- Bullet per player who contributed notably, with a brief stat or play highlight. Only include if there are multiple players with events.

Scoring rules — calculate points strictly:
- Each "2pt made" = 2 points
- Each "3pt made" = 3 points
- Each "Free Throw Made" = 1 point
- Missed shots = 0 points
Total points = (count of 2pt made × 2) + (count of 3pt made × 3) + (count of Free Throw Made × 1). Double-check your arithmetic.

Keep it concise and insightful. No filler. Only reference data present in the event log.`;

export async function generateSummary(
  events: Event[],
  videoId: string,
  videoTitle: string,
): Promise<string> {
  if (events.length === 0) {
    return "No events have been tagged yet. Tag some events on the video to generate a match summary.";
  }

  const eventLines = events.map((e) => {
    const player = e.player?.name ?? "Unknown";
    const position = e.player?.position ? ` (${e.player.position})` : "";
    return `${formatTimestamp(e.timestamp)} | ${player}${position} | ${e.event_type}`;
  });

  const prompt = `Game: ${videoTitle}
Total tagged events: ${events.length}

Event log:
${eventLines.join("\n")}`;

  const content = await chat(SYSTEM_PROMPT, prompt);

  if (!content) {
    return "Failed to generate summary. Please try again.";
  }

  await upsertSummary(videoId, content);

  revalidatePath(`/videos/${videoId}`);
  return content;
}
