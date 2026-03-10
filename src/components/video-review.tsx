"use client";

import { useRef, useState } from "react";
import { Video, Player, Event } from "@/lib/types";
import { VideoPlayer } from "./video-player";
import { EventForm } from "./event-form";
import { EventList } from "./event-list";

interface VideoReviewProps {
  video: Video;
  initialEvents: Event[];
  players: Player[];
}

export function VideoReview({ video, initialEvents, players: initialPlayers }: VideoReviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [events, setEvents] = useState(initialEvents);
  const [players, setPlayers] = useState(initialPlayers);

  function getCurrentTime() {
    return videoRef.current?.currentTime ?? 0;
  }

  function handleSeek(time: number) {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }

  function handleEventCreated(event: Event) {
    setEvents((prev) =>
      [...prev, event].sort((a, b) => a.timestamp - b.timestamp)
    );
  }

  function handleEventDeleted(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function handlePlayerAdded(player: Player) {
    setPlayers((prev) => [...prev, player].sort((a, b) => a.name.localeCompare(b.name)));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Video + Event Form */}
        <div className="lg:col-span-2 space-y-4">
          <VideoPlayer ref={videoRef} src={video.video_url} />
          <div className="rounded-lg border bg-white p-4">
            <h2 className="font-medium mb-3">Tag Event</h2>
            <EventForm
              videoId={video.id}
              players={players}
              getCurrentTime={getCurrentTime}
              onEventCreated={handleEventCreated}
              onPlayerAdded={handlePlayerAdded}
            />
          </div>
        </div>

        {/* Event List */}
        <div className="rounded-lg border bg-white p-4">
          <h2 className="font-medium mb-3">
            Events ({events.length})
          </h2>
          <EventList
            events={events}
            videoId={video.id}
            onSeek={handleSeek}
            onEventDeleted={handleEventDeleted}
          />
        </div>
      </div>
    </div>
  );
}
