import Link from "next/link";
import { getVideos } from "@/actions/videos";
import { VideoCard } from "@/components/videos/video-card";

export default async function LibraryPage() {
  const videos = await getVideos();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Video Library</h1>
        <Link
          href="/upload"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Upload Video
        </Link>
      </div>
      {videos.length === 0 ? (
        <p className="text-gray-500">
          No videos yet. Upload one to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
