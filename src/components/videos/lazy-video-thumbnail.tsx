"use client";

import { useRef, useState, useEffect } from "react";

interface LazyVideoThumbnailProps {
  src: string;
  className?: string;
}

/**
 * A lazy-loading video thumbnail that only loads the video source
 * when the element scrolls into view, reducing initial page load
 * and bandwidth for pages with many video cards.
 */
export function LazyVideoThumbnail({ src, className }: LazyVideoThumbnailProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }, // start loading slightly before visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={isVisible ? src : undefined}
      className={className}
      preload="metadata"
      muted
      playsInline
    />
  );
}
