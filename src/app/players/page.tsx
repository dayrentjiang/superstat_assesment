import { getPlayers } from "@/actions/players";
import { PlayerManager } from "@/components/players/player-manager";

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-[#115e3b] text-white rounded-xl p-6 md:p-8 flex flex-col items-start justify-between gap-2 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Team Roster</h1>
        <p className="text-[#a7f3d0] text-sm md:text-base">
          Manage your team players and track their stats across all matches.
        </p>
      </div>
      <div>
        <PlayerManager initialPlayers={players} />
      </div>
    </div>
  );
}
