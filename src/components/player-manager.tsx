"use client";

import { useState, useTransition } from "react";
import { Player } from "@/lib/types";
import { createPlayer, deletePlayer } from "@/actions/players";

export function PlayerManager({ initialPlayers }: { initialPlayers: Player[] }) {
  const [players, setPlayers] = useState(initialPlayers);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setError("");
    startTransition(async () => {
      try {
        const player = await createPlayer(name.trim());
        setPlayers((prev) => [...prev, player].sort((a, b) => a.name.localeCompare(b.name)));
        setName("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create player");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deletePlayer(id);
        setPlayers((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete player (may have events)");
      }
    });
  }

  return (
    <div className="max-w-md">
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded border px-3 py-2 text-sm"
          placeholder="Player name"
        />
        <button
          type="submit"
          disabled={isPending || !name.trim()}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {players.length === 0 ? (
        <p className="text-gray-500 text-sm">No players yet. Add one above.</p>
      ) : (
        <ul className="space-y-2">
          {players.map((player) => (
            <li
              key={player.id}
              className="flex items-center justify-between rounded border bg-white px-4 py-2"
            >
              <span className="text-sm">{player.name}</span>
              <button
                onClick={() => handleDelete(player.id)}
                disabled={isPending}
                className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
