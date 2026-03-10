"use server";

import { createServerClient } from "@/lib/supabase";
import { Player } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getPlayers(): Promise<Player[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as Player[];
}

export async function createPlayer(
  name: string,
  jerseyNumber?: number | null,
  avatarUrl?: string | null
): Promise<Player> {
  const supabase = createServerClient();
  const insert: Record<string, unknown> = { name: name.trim() };
  if (jerseyNumber != null) insert.jersey_number = jerseyNumber;
  if (avatarUrl) insert.avatar_url = avatarUrl;

  const { data, error } = await supabase
    .from("players")
    .insert(insert)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/players");
  return data as Player;
}

export async function deletePlayer(id: string): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase.from("players").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/players");
}
