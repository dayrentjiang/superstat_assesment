"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Player } from "@/types";
import { deletePlayer } from "@/actions/players";
import { AddPlayerDialog } from "@/components/players/add-player-dialog";
import {
  Users,
  UserPlus,
  Trash2,
  ChevronRight,
} from "lucide-react";

export function PlayerManager({
  initialPlayers,
}: {
  initialPlayers: Player[];
}) {
  const [players, setPlayers] = useState(initialPlayers);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handlePlayerCreated(player: Player) {
    setPlayers((prev) =>
      [...prev, player].sort((a, b) => a.name.localeCompare(b.name)),
    );
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
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-teal-600" />
          Roster
          <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full font-medium ml-2">
            {players.length}
          </span>
        </h2>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-teal-900 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Player
        </button>
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
          <p className="text-gray-500 text-sm mb-4">
            Add your first player to start tracking stats.
          </p>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-900 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Player
          </button>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                    <Image
                      src={player.avatar_url}
                      alt={player.name}
                      width={56}
                      height={56}
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

      <AddPlayerDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onPlayerCreated={handlePlayerCreated}
      />
    </div>
  );
}
