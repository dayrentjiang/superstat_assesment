"use client";

import { useState, useTransition } from "react";
import { Player, Event } from "@/lib/types";
import { EVENT_TYPES } from "@/lib/constants";
import { createEvent } from "@/actions/events";
import { createPlayer } from "@/actions/players";

interface EventFormProps {
  videoId: string;
  players: Player[];
  getCurrentTime: () => number;
  onEventCreated: (event: Event) => void;
  onPlayerAdded?: (player: Player) => void;
}

export function EventForm({ videoId, players, getCurrentTime, onEventCreated, onPlayerAdded }: EventFormProps) {
  const [eventType, setEventType] = useState<string>(EVENT_TYPES[0]);
  const [playerId, setPlayerId] = useState<string>(players[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isAddingPlayer, startAddingPlayer] = useTransition();

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

  function handleQuickAddPlayer(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    startAddingPlayer(async () => {
      try {
        const player = await createPlayer(newPlayerName.trim());
        onPlayerAdded?.(player);
        setPlayerId(player.id);
        setNewPlayerName("");
        setShowQuickAdd(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add player");
      }
    });
  }

  if (players.length === 0 && !showQuickAdd) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          No players yet.{" "}
          <a href="/players" className="text-blue-600 underline">
            Manage players
          </a>{" "}
          or add one quickly:
        </p>
        <button
          onClick={() => setShowQuickAdd(true)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          + Add Player
        </button>
      </div>
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
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-600">Player</label>
          <button
            type="button"
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showQuickAdd ? "Cancel" : "+ Add"}
          </button>
        </div>

        {showQuickAdd ? (
          <form onSubmit={handleQuickAddPlayer} className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="flex-1 rounded border px-3 py-2 text-sm"
              placeholder="Player name"
              autoFocus
            />
            <button
              type="submit"
              disabled={isAddingPlayer || !newPlayerName.trim()}
              className="rounded bg-blue-600 px-3 py-2 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isAddingPlayer ? "..." : "Add"}
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            {(() => {
              const selected = players.find((p) => p.id === playerId);
              return selected?.avatar_url ? (
                <img
                  src={selected.avatar_url}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover shrink-0"
                />
              ) : selected ? (
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium shrink-0">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
              ) : null;
            })()}
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
        )}
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <button
        onClick={handleTag}
        disabled={isPending || !playerId || showQuickAdd}
        className="w-full rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
      >
        {isPending ? "Tagging..." : "Tag Event"}
      </button>
    </div>
  );
}
