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

export function EventForm({
  videoId,
  players,
  getCurrentTime,
  onEventCreated,
  onPlayerAdded,
}: EventFormProps) {
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
        const event = await createEvent(
          videoId,
          playerId,
          eventType,
          timestamp,
        );
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
      <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-6 text-center space-y-3">
        <p className="text-sm font-medium text-gray-600">
          No players exist in your roster yet.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <a
            href="/players"
            className="text-teal-600 hover:text-teal-800 font-semibold underline underline-offset-2"
          >
            Manage Roster
          </a>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setShowQuickAdd(true)}
            className="text-teal-600 hover:text-teal-800 font-semibold"
          >
            + Quick Add Player
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="w-full sm:flex-1">
        <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5">
          Action
        </label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-medium text-gray-900"
        >
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:flex-1 relative">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-gray-700 tracking-wide uppercase">
            Player
          </label>
          <button
            type="button"
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="text-[10px] font-bold text-teal-600 hover:text-teal-800 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded transition-colors"
          >
            {showQuickAdd ? "Cancel" : "+ New"}
          </button>
        </div>

        {showQuickAdd ? (
          <form onSubmit={handleQuickAddPlayer} className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Player name"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-medium"
              autoFocus
            />
            <button
              type="submit"
              disabled={isAddingPlayer || !newPlayerName.trim()}
              className="rounded-lg bg-gray-900 text-white px-3 py-2.5 text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              Add
            </button>
          </form>
        ) : (
          <select
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-medium text-gray-900"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.position ? `(${p.position})` : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="w-full sm:w-auto shrink-0">
        <button
          onClick={handleTag}
          disabled={isPending || !playerId || showQuickAdd}
          className="w-full sm:w-32 rounded-lg bg-[#ccfbf1] text-teal-900 border border-[#bbf7d0] px-4 py-2.5 text-sm font-bold hover:bg-teal-100 hover:border-teal-200 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
        >
          {isPending ? "Tagging..." : "Tag Event"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-rose-600 font-medium absolute -bottom-6 left-0">
          {error}
        </p>
      )}
    </div>
  );
}
