import { notFound } from "next/navigation";
import { getPlayerById, getPlayerStats, checkPlayerDeleted } from "@/actions/players";
import { getPlayerGames } from "@/actions/events";
import { PlayerDetail } from "@/components/players/player-detail";
import Link from "next/link";
import { UserX } from "lucide-react";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = await getPlayerById(id);

  if (!player) {
    const wasDeleted = await checkPlayerDeleted(id);

    if (wasDeleted) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="bg-rose-50 rounded-full p-4 mb-4">
            <UserX className="w-10 h-10 text-rose-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Player Has Been Removed
          </h1>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            This player was deleted from the roster. Their events may still
            appear in video timelines, but their profile is no longer available.
          </p>
          <Link
            href="/players"
            className="rounded-lg bg-teal-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800 transition-colors"
          >
            Back to Roster
          </Link>
        </div>
      );
    }

    notFound();
  }

  const [stats, games] = await Promise.all([
    getPlayerStats(id),
    getPlayerGames(id),
  ]);

  return (
    <div>
      <Link
        href="/players"
        className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        &larr; Back to Players
      </Link>
      <PlayerDetail player={player} stats={stats} games={games} />
    </div>
  );
}
