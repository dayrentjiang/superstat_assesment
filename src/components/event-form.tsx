"use client";

import { useState, useTransition } from "react";
import { Player, Event } from "@/lib/types";
import { EVENT_TYPES } from "@/lib/constants";
import { createEvent } from "@/actions/events";

interface EventFormProps {
  videoId: string;
  players: Player[];
  getCurrentTime: () => number;
  onEventCreated: (event: Event) => void;
}

export function EventForm({ videoId, players, getCurrentTime, onEventCreated }: EventFormProps) {
  const [eventType, setEventType] = useState<string>(EVENT_TYPES[0]);
  const [playerId, setPlayerId] = useState<string>(players[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleTag() {
    if (!playerId || !eventType) return;

    const timestamp = getCurrentTime();
    setError("");

    startTransition(async () => {
      try {
        const event = await createEvent(videoId, playerId, eventType, timestamp);
        onEventCreated(event);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create event");
      }
    });
  }

  if (players.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Add players on the{" "}
        <a href="/players" className="text-blue-600 underline">
          Players page
        </a>{" "}
        before tagging events.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Event Type</label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        >
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Player</label>
        <select
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        >
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <button
        onClick={handleTag}
        disabled={isPending}
        className="w-full rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
      >
        {isPending ? "Tagging..." : "Tag Event"}
      </button>
    </div>
  );
}
