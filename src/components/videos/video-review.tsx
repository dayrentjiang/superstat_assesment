"use client";

import { useRef, useState } from "react";
import { Video, Player, Event } from "@/lib/types";
import { VideoPlayer } from "./video-player";
import { EventForm } from "@/components/events/event-form";
import { EventList } from "@/components/events/event-list";
import { MatchSummary } from "@/components/events/match-summary";

interface VideoReviewProps {
  video: Video;
  initialEvents: Event[];
  players: Player[];
  initialSummary: string | null;
}

export function VideoReview({
  video,
  initialEvents,
  players: initialPlayers,
  initialSummary,
}: VideoReviewProps) {
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
      [...prev, event].sort((a, b) => a.timestamp - b.timestamp),
    );
  }

  function handleEventDeleted(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function handlePlayerAdded(player: Player) {
    setPlayers((prev) =>
      [...prev, player].sort((a, b) => a.name.localeCompare(b.name)),
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
      </div>

      {/* AI Match Summary */}
      <MatchSummary
        events={events}
        videoId={video.id}
        videoTitle={video.title}
        initialSummary={initialSummary}
      />

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Timeline Column */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="rounded-xl overflow-hidden bg-black shadow-lg border border-gray-800">
            <VideoPlayer ref={videoRef} src={video.video_url} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tag Event</h2>
            <EventForm
              videoId={video.id}
              players={players}
              getCurrentTime={getCurrentTime}
              onEventCreated={handleEventCreated}
              onPlayerAdded={handlePlayerAdded}
            />
          </div>
        </div>

        {/* Sidebar Event List */}
        <div className="xl:w-96 shrink-0 flex flex-col gap-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-fit xl:sticky xl:top-28 xl:max-h-[calc(100vh-120px)] overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Timeline</h2>
            <span className="bg-teal-50 text-teal-700 font-bold text-xs px-2.5 py-1 rounded-full">
              {events.length} Events
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            <EventList
              events={events}
              videoId={video.id}
              onSeek={handleSeek}
              onEventDeleted={handleEventDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
