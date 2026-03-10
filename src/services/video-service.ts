import { createServerClient } from "@/lib/supabase";
import { Video } from "@/lib/types";

export async function findAllVideos(): Promise<Video[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Video[];
}

export async function findVideoById(id: string): Promise<Video | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data as Video;
}

export async function removeVideo(id: string): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("videos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function insertVideo(title: string, videoUrl: string): Promise<Video> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("videos")
    .insert({ title, video_url: videoUrl })
    .select()
    .single();

  if (error) throw error;
  return data as Video;
}
