import { getPlayers } from "@/actions/players";
import { PlayerManager } from "@/components/players/player-manager";

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Players</h1>
      <PlayerManager initialPlayers={players} />
    </div>
  );
}
