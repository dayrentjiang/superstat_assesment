import { createServerClient } from "@/lib/supabase";
import { Player } from "@/lib/types";

export async function findAllPlayers(): Promise<Player[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .is("deleted_at", null)
    .order("name");

  if (error) throw error;
  return data as Player[];
}

export async function findPlayerById(id: string): Promise<Player | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Player;
}

export async function insertPlayer(
  name: string,
  avatarUrl?: string | null,
  position?: string | null
): Promise<Player> {
  const supabase = createServerClient();
  const insert: Record<string, unknown> = { name: name.trim() };
  if (avatarUrl) insert.avatar_url = avatarUrl;
  if (position) insert.position = position;

  const { data, error } = await supabase
    .from("players")
    .insert(insert)
    .select()
    .single();

  if (error) throw error;
  return data as Player;
}

export async function updatePlayer(
  id: string,
  fields: { name?: string; position?: string | null; avatar_url?: string | null }
): Promise<Player> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("players")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Player;
}

export async function removePlayer(id: string): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("players")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
