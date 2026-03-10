import { createServerClient } from "@/lib/supabase";
import { Summary } from "@/lib/types";

export async function findSummaryByVideoId(videoId: string): Promise<Summary | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("summaries")
    .select("*")
    .eq("video_id", videoId)
    .maybeSingle();

  if (error) throw error;
  return data as Summary | null;
}

export async function upsertSummary(videoId: string, content: string): Promise<void> {
  const supabase = createServerClient();
  await supabase
    .from("summaries")
    .upsert(
      { video_id: videoId, content, updated_at: new Date().toISOString() },
      { onConflict: "video_id" },
    );
}
