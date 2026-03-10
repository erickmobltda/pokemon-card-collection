import { supabase } from "@/lib/db/client";
import type { CardInsert, CardUpdate } from "@/lib/db/types";

export interface CardFilters {
  name?: string;
  supertype?: string;
  types?: string;
  rarity?: string;
  condition?: string;
}

export async function listCards(userId: string, filters?: CardFilters) {
  let query = supabase
    .from("cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (filters?.name) {
    query = query.ilike("name", `%${filters.name}%`);
  }
  if (filters?.supertype && filters.supertype !== "all") {
    query = query.eq("supertype", filters.supertype);
  }
  if (filters?.rarity && filters.rarity !== "all") {
    query = query.eq("rarity", filters.rarity);
  }
  if (filters?.condition && filters.condition !== "all") {
    query = query.eq("condition", filters.condition);
  }
  if (filters?.types && filters.types !== "all") {
    query = query.contains("types", [filters.types]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getCard(id: string) {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createCard(userId: string, input: Omit<CardInsert, "user_id">) {
  const { data, error } = await supabase
    .from("cards")
    .insert({ ...input, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCard(id: string, input: CardUpdate) {
  const { data, error } = await supabase
    .from("cards")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCard(id: string) {
  const { error } = await supabase.from("cards").delete().eq("id", id);
  if (error) throw error;
}

export async function listPublicCards(userId: string) {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
