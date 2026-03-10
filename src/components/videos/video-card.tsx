"use client";

import { useState, useTransition } from "react";
import { Video } from "@/types";
import { deleteVideo } from "@/actions/videos";
import { format } from "date-fns";
import { ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";

export function VideoCard({
  video,
  onDeleted,
}: {
  video: Video;
  onDeleted?: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dateFormatted = video.created_at
    ? format(new Date(video.created_at), "MMM d, yyyy").toUpperCase()
    : "DATE UNKNOWN";

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(async () => {
      await deleteVideo(video.id);
      onDeleted?.(video.id);
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-teal-400 hover:shadow-md transition-all flex flex-col sm:flex-row items-center p-3 sm:p-4 gap-4 sm:gap-6 w-full group">
      <Link
        href={`/videos/${video.id}`}
        className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 flex-1 min-w-0 w-full outline-none"
      >
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

        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-gray-100 group-hover:bg-[#ccfbf1] group-hover:text-teal-800 text-gray-700 text-sm font-semibold rounded-full transition-colors shrink-0">
          VIDEO TIMELINE
          <ChevronRight className="w-4 h-4 opacity-70" />
        </div>
      </Link>

      <button
        onClick={handleDelete}
        onBlur={() => setConfirmDelete(false)}
        disabled={isPending}
        className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
          confirmDelete
            ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
            : "text-gray-400 hover:text-rose-600 hover:bg-rose-50"
        }`}
      >
        <Trash2 className="w-3.5 h-3.5" />
        {isPending ? "Removing..." : confirmDelete ? "Confirm?" : "Remove"}
      </button>
    </div>
  );
}
