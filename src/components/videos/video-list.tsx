"use client";

import { useState } from "react";
import { Video as VideoType } from "@/types";
import { VideoCard } from "@/components/videos/video-card";
import { Video } from "lucide-react";

export function VideoList({ initialVideos }: { initialVideos: VideoType[] }) {
  const [videos, setVideos] = useState(initialVideos);

  function handleDeleted(id: string) {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }

  if (videos.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 shadow-sm">
        <Video className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p>No matches yet. Upload a game to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onDeleted={handleDeleted} />
      ))}
    </div>
  );
}
