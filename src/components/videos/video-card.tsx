import Link from "next/link";
import { Video } from "@/lib/types";

export function VideoCard({ video }: { video: Video }) {
  return (
    <Link href={`/videos/${video.id}`}>
      <div className="rounded-lg border bg-white p-4 hover:shadow-md transition-shadow">
        <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
          <video
            src={video.video_url}
            className="w-full h-full object-cover"
            preload="metadata"
          />
        </div>
        <h3 className="font-medium truncate">{video.title}</h3>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(video.created_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
