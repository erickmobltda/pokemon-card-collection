import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SUPABASE_URL: z.string().url(),
    VITE_SUPABASE_ANON_KEY: z.string().min(1),
    VITE_APP_TITLE: z.string().default("Pokémon Card Collection"),
    VITE_SENTRY_DSN: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
});
