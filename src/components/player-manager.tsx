"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Player } from "@/lib/types";
import { createPlayer, deletePlayer } from "@/actions/players";
import { useUpload } from "@/hooks/use-upload";

export function PlayerManager({ initialPlayers }: { initialPlayers: Player[] }) {
  const [players, setPlayers] = useState(initialPlayers);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const avatarUpload = useUpload("avatars");

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setError("");
    startTransition(async () => {
      try {
        let avatarUrl: string | null = null;
        if (avatarFile) {
          avatarUrl = await avatarUpload.upload(avatarFile);
          if (!avatarUrl) throw new Error(avatarUpload.error ?? "Avatar upload failed");
        }

        const player = await createPlayer(name.trim(), avatarUrl, position || null);
        setPlayers((prev) => [...prev, player].sort((a, b) => a.name.localeCompare(b.name)));
        setName("");
        setPosition("");
        setAvatarFile(null);
        setAvatarPreview(null);
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
    <div className="max-w-lg">
      <form onSubmit={handleCreate} className="space-y-3 mb-6 rounded-lg border bg-white p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded border px-3 py-2 text-sm"
            placeholder="Player name"
          />
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-28 rounded border px-3 py-2 text-sm"
          >
            <option value="">Position</option>
            <option value="PG">PG</option>
            <option value="SG">SG</option>
            <option value="SF">SF</option>
            <option value="PF">PF</option>
            <option value="C">C</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Preview"
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-xs flex-1"
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !name.trim()}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Adding..." : "Add Player"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {players.length === 0 ? (
        <p className="text-gray-500 text-sm">No players yet. Add one above.</p>
      ) : (
        <div className="grid gap-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-3 rounded-lg border bg-white px-4 py-3 hover:border-blue-300 transition-colors"
            >
              <Link
                href={`/players/${player.id}`}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                {player.avatar_url ? (
                  <img
                    src={player.avatar_url}
                    alt={player.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{player.name}</p>
                  {player.position && (
                    <p className="text-xs text-gray-500">{player.position}</p>
                  )}
                </div>
              </Link>
              <button
                onClick={() => handleDelete(player.id)}
                disabled={isPending}
                className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
