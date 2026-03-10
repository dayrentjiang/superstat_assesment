import { getVideos } from "@/actions/videos";
import { VideoCard } from "@/components/videos/video-card";
import { ArrowUpRight, Video } from "lucide-react";
import Link from "next/link";

export default async function LibraryPage() {
  const videos = await getVideos();

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-[#115e3b] text-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Upload a game</h1>
          <p className="text-[#a7f3d0] text-sm md:text-base">
            Add a new game and fill out the details to get your stats.
          </p>
        </div>
        <Link
          href="/upload"
          className="bg-white text-black px-6 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors shrink-0"
        >
          Upload
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Matches</h2>
        {videos.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 shadow-sm">
            <Video className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p>No matches yet. Upload a game to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
