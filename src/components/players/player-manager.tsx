"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Player } from "@/lib/types";
import { createPlayer, deletePlayer } from "@/actions/players";
import { useUpload } from "@/hooks/use-upload";
import {
  Users,
  UserPlus,
  Image as ImageIcon,
  Trash2,
  ChevronRight,
} from "lucide-react";

export function PlayerManager({
  initialPlayers,
}: {
  initialPlayers: Player[];
}) {
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
          if (!avatarUrl)
            throw new Error(avatarUpload.error ?? "Avatar upload failed");
        }

        const player = await createPlayer(
          name.trim(),
          avatarUrl,
          position || null,
        );
        setPlayers((prev) =>
          [...prev, player].sort((a, b) => a.name.localeCompare(b.name)),
        );
        setName("");
        setPosition("");
        setAvatarFile(null);
        setAvatarPreview(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create player",
        );
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deletePlayer(id);
        setPlayers((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete player (may have events)",
        );
      }
    });
  }

  return (
    <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8">
      {/* Player List */}
      <div className="flex-1 order-2 md:order-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Roster
            <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full font-medium ml-2">
              {players.length}
            </span>
          </h2>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm mb-4 border border-rose-100">
            {error}
          </div>
        )}

        {players.length === 0 ? (
          <div className="bg-white border flex flex-col items-center justify-center p-12 text-center rounded-xl border-dashed border-gray-300">
            <Users className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No players yet
            </h3>
            <p className="text-gray-500 text-sm">
              Add your first player to start tracking stats.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-teal-300 transition-all"
              >
                <Link
                  href={`/players/${player.id}`}
                  className="flex items-center gap-4 p-4 flex-1 focus:outline-none"
                >
                  <div className="relative shrink-0">
                    {player.avatar_url ? (
                      <img
                        src={player.avatar_url}
                        alt={player.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-gray-100 group-hover:border-teal-100 transition-colors"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold border-2 border-transparent group-hover:border-teal-100 transition-colors">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {player.position && (
                      <div className="absolute -bottom-1 -right-1 bg-teal-900 border-2 border-white text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none shadow-sm">
                        {player.position}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-900 truncate group-hover:text-teal-900 transition-colors">
                      {player.name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      View Stats
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors shrink-0" />
                </Link>

                <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(player.id);
                    }}
                    disabled={isPending}
                    className="text-xs font-semibold text-gray-500 hover:text-rose-600 flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Player Form */}
      <div className="w-full md:w-72 shrink-0 order-1 md:order-2">
        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-28 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-600" />
            Add Player
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="e.g. Michael Jordan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Position
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option value="">Any Position</option>
                <option value="PG">Point Guard (PG)</option>
                <option value="SG">Shooting Guard (SG)</option>
                <option value="SF">Small Forward (SF)</option>
                <option value="PF">Power Forward (PF)</option>
                <option value="C">Center (C)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Profile Photo
              </label>
              <div className="flex items-center gap-3">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="h-10 w-10 rounded-full object-cover border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="relative flex-1">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="block w-full text-center px-3 py-2 text-xs font-semibold text-teal-800 bg-[#ccfbf1]/50 border border-[#ccfbf1] hover:bg-[#ccfbf1] rounded-lg cursor-pointer transition-colors"
                  >
                    {avatarFile ? "Change Photo" : "Upload Photo"}
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending || !name.trim()}
                className="w-full rounded-lg bg-teal-900 border border-teal-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800 hover:border-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Saving Player..." : "Save Player"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
