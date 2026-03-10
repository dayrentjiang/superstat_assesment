import { Video } from "@/lib/types";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function VideoCard({ video }: { video: Video }) {
  // Try to create a stable, deterministic date for the UI
  const dateFormatted = video.created_at
    ? format(new Date(video.created_at), "MMM d, yyyy").toUpperCase()
    : "DATE UNKNOWN";

  return (
    <Link
      href={`/videos/${video.id}`}
      className="block group w-full outline-none"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden group-hover:border-teal-400 group-hover:shadow-md transition-all flex flex-col sm:flex-row items-center p-3 sm:p-4 gap-4 sm:gap-6 w-full cursor-pointer">
        <div className="shrink-0 relative w-full sm:w-56 h-48 sm:h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          {video.video_url ? (
            <video
              src={`${video.video_url}#t=0.5`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              preload="metadata"
              muted
              playsInline
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50/50 font-medium">
              No Video
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center min-w-0 py-2 w-full">
          <p className="text-sm font-semibold tracking-wider text-gray-400 mb-1">
            {dateFormatted}
          </p>
          <h3 className="font-bold text-lg text-gray-900 truncate mb-1 group-hover:text-teal-900 transition-colors">
            {video.title}
          </h3>
        </div>

        <div className="flex items-center gap-4 shrink-0 px-2 lg:px-6 w-full sm:w-auto mt-2 sm:mt-0 pb-1 sm:pb-0">
          <div className="flex w-full justify-center sm:justify-start items-center gap-2 px-4 py-2 sm:py-1.5 bg-gray-100 group-hover:bg-[#ccfbf1] group-hover:text-teal-800 text-gray-700 text-sm font-semibold rounded-full transition-colors">
            VIDEO TIMELINE
            <ChevronRight className="w-4 h-4 opacity-70" />
          </div>
        </div>
      </div>
    </Link>
  );
}
