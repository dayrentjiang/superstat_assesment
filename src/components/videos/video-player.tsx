"use client";

import { forwardRef } from "react";

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  function VideoPlayer({ src }, ref) {
    return (
      <video
        ref={ref}
        src={src}
        controls
        className="w-full rounded-lg bg-black"
        preload="metadata"
      />
    );
  },
);
