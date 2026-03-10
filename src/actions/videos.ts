"use server";

import { Video } from "@/types";
import { revalidatePath } from "next/cache";
import {
  findAllVideos,
  findVideoById,
  insertVideo,
  removeVideo,
} from "@/services/video-service";

export async function getVideos(): Promise<Video[]> {
  return findAllVideos();
}

export async function getVideoById(id: string): Promise<Video | null> {
  return findVideoById(id);
}

export async function createVideo(
  title: string,
  videoUrl: string,
): Promise<Video> {
  const video = await insertVideo(title, videoUrl);
  revalidatePath("/");
  return video;
}

export async function deleteVideo(id: string): Promise<void> {
  await removeVideo(id);
  revalidatePath("/");
}
