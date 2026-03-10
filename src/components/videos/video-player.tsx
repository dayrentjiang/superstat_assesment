"use client";

import { forwardRef } from "react";

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  function VideoPlayer({ src }, ref) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <video
          ref={ref}
          src={src}
          controls
          className="w-full h-full object-contain"
          preload="metadata"
        />
      </div>
    );
  },
);
