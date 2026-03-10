import { z } from "zod";

export const CARD_RARITIES = [
  "Common",
  "Uncommon",
  "Rare",
  "Holo Rare",
  "Ultra Rare",
  "Secret Rare",
] as const;

export const cardRaritySchema = z.enum(CARD_RARITIES);

export const createPokemonCardSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome muito longo"),
  rarity: cardRaritySchema,
  hp: z.coerce
    .number()
    .int("HP deve ser um número inteiro")
    .min(1, "HP mínimo é 1")
    .max(9999, "HP máximo é 9999"),
  photo_url: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v))
    .nullable(),
});

export const updatePokemonCardSchema = createPokemonCardSchema.partial();

export type CreatePokemonCardData = z.infer<typeof createPokemonCardSchema>;
export type UpdatePokemonCardData = z.infer<typeof updatePokemonCardSchema>;
