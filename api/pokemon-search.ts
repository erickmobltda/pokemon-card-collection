import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q, pageSize = "24" } = req.query as Record<string, string>;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ error: "Missing query parameter: q" });
  }

  const url = new URL("https://api.pokemontcg.io/v2/cards");
  url.searchParams.set("q", q);
  url.searchParams.set("pageSize", pageSize);

  const headers: Record<string, string> = {};
  if (process.env.POKEMONTCG_API_KEY) {
    headers["X-Api-Key"] = process.env.POKEMONTCG_API_KEY;
  }

  try {
    const upstream = await fetch(url.toString(), { headers });

    if (!upstream.ok) {
      const text = await upstream.text();
      return res.status(upstream.status).json({ error: text });
    }

    const data = await upstream.json();
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.json(data);
  } catch (err) {
    console.error("[pokemon-search] fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch from pokemontcg.io" });
  }
}
