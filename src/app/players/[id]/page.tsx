import { notFound } from "next/navigation";
import { getPlayerById, getPlayerStats } from "@/actions/players";
import { getPlayerGames } from "@/actions/events";
import { PlayerDetail } from "@/components/player-detail";
import Link from "next/link";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [player, stats, games] = await Promise.all([
    getPlayerById(id),
    getPlayerStats(id),
    getPlayerGames(id),
  ]);

  if (!player) notFound();

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
