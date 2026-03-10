"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Player, PlayerStats, PlayerGameRow } from "@/lib/types";
import { updatePlayer } from "@/actions/players";
import { useUpload } from "@/hooks/use-upload";

interface Props {
  player: Player;
  stats: PlayerStats;
  games: PlayerGameRow[];
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function PlayerHeader({ player }: { player: Player }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(player.name);
  const [position, setPosition] = useState(player.position ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(player);
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

  function handleCancel() {
    setEditing(false);
    setName(currentPlayer.name);
    setPosition(currentPlayer.position ?? "");
    setAvatarFile(null);
    setAvatarPreview(null);
    setError("");
  }

  function handleSave() {
    if (!name.trim()) return;
    setError("");

    startTransition(async () => {
      try {
        let avatarUrl: string | null | undefined;
        if (avatarFile) {
          avatarUrl = await avatarUpload.upload(avatarFile);
          if (!avatarUrl) throw new Error(avatarUpload.error ?? "Avatar upload failed");
        }

        const fields: { name?: string; position?: string | null; avatar_url?: string | null } = {};
        if (name.trim() !== currentPlayer.name) fields.name = name.trim();
        if ((position || null) !== currentPlayer.position) fields.position = position || null;
        if (avatarUrl) fields.avatar_url = avatarUrl;

        if (Object.keys(fields).length > 0) {
          const updated = await updatePlayer(currentPlayer.id, fields);
          setCurrentPlayer(updated);
        }

        setEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update player");
      }
    });
  }

  const displayAvatar = avatarPreview ?? currentPlayer.avatar_url;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        {displayAvatar ? (
          <img
            src={displayAvatar}
            alt={currentPlayer.name}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
            {currentPlayer.name.charAt(0).toUpperCase()}
          </div>
        )}
        {editing && (
          <label className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-xs">
            <span>+</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {editing ? (
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border px-3 py-1.5 text-lg font-bold w-full max-w-xs"
          />
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="rounded border px-3 py-1.5 text-sm w-28 block"
          >
            <option value="">No position</option>
            <option value="PG">PG</option>
            <option value="SG">SG</option>
            <option value="SF">SF</option>
            <option value="PF">PF</option>
            <option value="C">C</option>
          </select>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isPending || !name.trim()}
              className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="rounded border px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">{currentPlayer.name}</h1>
            {currentPlayer.position && (
              <p className="text-gray-500">{currentPlayer.position}</p>
            )}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="rounded border px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

export function PlayerDetail({ player, stats, games }: Props) {
  return (
    <div className="space-y-8">
      <PlayerHeader player={player} />

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
        <StatCard label="Games" value={String(stats.totalGames)} />
        <StatCard label="Total PTS" value={String(stats.totalPoints)} />
        <StatCard label="PPG" value={String(stats.ppg)} />
        <StatCard label="APG" value={String(stats.apg)} />
        <StatCard label="RPG" value={String(stats.rpg)} />
        <StatCard
          label="FG%"
          value={stats.fgPct !== null ? `${stats.fgPct}%` : "-"}
        />
        <StatCard
          label="2PT%"
          value={stats.twoPtPct !== null ? `${stats.twoPtPct}%` : "-"}
        />
        <StatCard
          label="3PT%"
          value={stats.threePtPct !== null ? `${stats.threePtPct}%` : "-"}
        />
        <StatCard
          label="FT%"
          value={stats.ftPct !== null ? `${stats.ftPct}%` : "-"}
        />
      </div>

      {/* Game history */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Game History</h2>
        {games.length === 0 ? (
          <p className="text-gray-500 text-sm">No games recorded yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Video</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">PTS</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">AST</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">REB</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">STL</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">BLK</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">TOV</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">FLS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {games.map((game) => (
                  <tr key={game.video_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(game.video_created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/videos/${game.video_id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {game.video_title}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-right font-mono">{game.pts}</td>
                    <td className="px-4 py-2 text-right font-mono">{game.ast}</td>
                    <td className="px-4 py-2 text-right font-mono">{game.reb}</td>
                    <td className="px-4 py-2 text-right font-mono">{game.stl}</td>
                    <td className="px-4 py-2 text-right font-mono">{game.blk}</td>
                    <td className="px-4 py-2 text-right font-mono">{game.tov}</td>
                    <td className="px-4 py-2 text-right font-mono">{game.fls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
