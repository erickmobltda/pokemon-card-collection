import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Proxy for TCGdex API — kept for edge caching and as a fallback.
 * The frontend now calls TCGdex directly, but this endpoint still works.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const name = req.query.name as string | undefined;
  const pageSize = req.query.pageSize as string | undefined;

  if (!name) {
    return res.status(400).json({ error: "Missing query parameter: name" });
  }

  const url = new URL("https://api.tcgdex.net/v2/en/cards");
  url.searchParams.set("name", name);
  if (pageSize) {
    url.searchParams.set("pagination:itemsPerPage", pageSize);
  }

  try {
    const upstream = await fetch(url.toString(), {
      signal: AbortSignal.timeout(15000),
    });

    const data = await upstream.json();

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(upstream.status).json(data);
  } catch (err) {
    console.error("[pokemon-search] error:", err);
    return res.status(504).json({ error: "TCGdex request failed" });
  }
}
