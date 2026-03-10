import { z } from "zod";

export const CARD_CONDITIONS = [
  "Near Mint",
  "Lightly Played",
  "Moderately Played",
  "Heavily Played",
  "Damaged",
] as const;

export const CARD_SUPERTYPES = ["Pokémon", "Trainer", "Energy"] as const;

export const POKEMON_TYPES = [
  "Colorless",
  "Darkness",
  "Dragon",
  "Fairy",
  "Fighting",
  "Fire",
  "Grass",
  "Lightning",
  "Metal",
  "Psychic",
  "Water",
] as const;

export const cardConditionSchema = z.enum(CARD_CONDITIONS);

export const createCardSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200, "Nome muito longo"),
  external_id: z.string().optional().nullable(),
  supertype: z.string().optional().nullable(),
  subtypes: z.array(z.string()).optional().nullable(),
  hp: z.string().optional().nullable(),
  types: z.array(z.string()).optional().nullable(),
  rarity: z.string().optional().nullable(),
  set_name: z.string().optional().nullable(),
  set_id: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  image_url: z.string().url("URL inválida").optional().nullable().or(z.literal("")).transform((v) => v === "" ? null : v),
  artist: z.string().optional().nullable(),
  condition: cardConditionSchema.default("Near Mint"),
  quantity: z.coerce.number().int().min(1, "Mínimo 1").max(9999).default(1),
  notes: z.string().max(1000, "Nota muito longa").optional().nullable(),
});

export const updateCardSchema = createCardSchema.partial();

export const addToCollectionSchema = z.object({
  condition: cardConditionSchema.default("Near Mint"),
  quantity: z.coerce.number().int().min(1, "Mínimo 1").max(9999).default(1),
  notes: z.string().max(1000).optional().nullable(),
});

export type CreateCardData = z.infer<typeof createCardSchema>;
export type UpdateCardData = z.infer<typeof updateCardSchema>;
export type AddToCollectionData = z.infer<typeof addToCollectionSchema>;
