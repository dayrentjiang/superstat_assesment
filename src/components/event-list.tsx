"use client";

import { useTransition } from "react";
import { Event } from "@/lib/types";
import { formatTimestamp } from "@/lib/constants";
import { deleteEvent } from "@/actions/events";

interface EventListProps {
  events: Event[];
  videoId: string;
  onSeek: (time: number) => void;
  onEventDeleted: (id: string) => void;
}

export function EventList({ events, videoId, onSeek, onEventDeleted }: EventListProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteEvent(id, videoId);
      onEventDeleted(id);
    });
  }

  if (events.length === 0) {
    return <p className="text-sm text-gray-500">No events tagged yet.</p>;
  }

  return (
    <div className="overflow-auto max-h-96">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-gray-500">
            <th className="pb-2 pr-2">Time</th>
            <th className="pb-2 pr-2">Type</th>
            <th className="pb-2 pr-2">Player</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b last:border-0">
              <td className="py-2 pr-2">
                <button
                  onClick={() => onSeek(event.timestamp)}
                  className="text-blue-600 hover:underline font-mono"
                >
                  {formatTimestamp(event.timestamp)}
                </button>
              </td>
              <td className="py-2 pr-2">
                <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs">
                  {event.event_type}
                </span>
              </td>
              <td className="py-2 pr-2">{event.player?.name ?? "Unknown"}</td>
              <td className="py-2">
                <button
                  onClick={() => handleDelete(event.id)}
                  disabled={isPending}
                  className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
