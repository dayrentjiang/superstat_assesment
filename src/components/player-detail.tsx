"use client";

import Link from "next/link";
import { Player, PlayerStats, PlayerGameRow } from "@/lib/types";

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

export function PlayerDetail({ player, stats, games }: Props) {
  return (
    <div className="space-y-8">
      {/* Player header */}
      <div className="flex items-center gap-4">
        {player.avatar_url ? (
          <img
            src={player.avatar_url}
            alt={player.name}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
            {player.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{player.name}</h1>
          {player.position && (
            <p className="text-gray-500">{player.position}</p>
          )}
        </div>
      </div>

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
