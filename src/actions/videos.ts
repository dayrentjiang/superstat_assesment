"use server";

import { createServerClient } from "@/lib/supabase";
import { Video } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getVideos(): Promise<Video[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Video[];
}

export async function getVideoById(id: string): Promise<Video | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Video;
}

export async function createVideo(title: string, videoUrl: string): Promise<Video> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("videos")
    .insert({ title, video_url: videoUrl })
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/");
  return data as Video;
}
