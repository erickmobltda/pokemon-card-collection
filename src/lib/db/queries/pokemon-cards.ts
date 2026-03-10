import { supabase } from "@/lib/db/client";
import type { PokemonCardInsert, PokemonCardUpdate } from "@/lib/db/types";

export async function listPokemonCards(userId: string) {
  const { data, error } = await supabase
    .from("pokemon_cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPokemonCard(id: string) {
  const { data, error } = await supabase
    .from("pokemon_cards")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createPokemonCard(
  userId: string,
  input: Omit<PokemonCardInsert, "user_id">,
) {
  const { data, error } = await supabase
    .from("pokemon_cards")
    .insert({ ...input, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePokemonCard(id: string, input: PokemonCardUpdate) {
  const { data, error } = await supabase
    .from("pokemon_cards")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePokemonCard(id: string) {
  const { error } = await supabase
    .from("pokemon_cards")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
