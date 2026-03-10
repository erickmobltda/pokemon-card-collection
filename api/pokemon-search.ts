import { get as httpsGet } from "node:https";
import type { IncomingMessage, ServerResponse } from "node:http";

export default function handler(
  req: IncomingMessage & { url?: string },
  res: ServerResponse,
) {
  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const { searchParams } = new URL(req.url ?? "/", "http://localhost");
  const q = searchParams.get("q");
  const pageSize = searchParams.get("pageSize") ?? "24";

  if (!q) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing query parameter: q" }));
    return;
  }

  const upstreamUrl = new URL("https://api.pokemontcg.io/v2/cards");
  upstreamUrl.searchParams.set("q", q);
  upstreamUrl.searchParams.set("pageSize", pageSize);

  const headers: Record<string, string> = {};
  if (process.env.POKEMONTCG_API_KEY) {
    headers["X-Api-Key"] = process.env.POKEMONTCG_API_KEY;
  }

  const upstreamReq = httpsGet(upstreamUrl.toString(), { headers, timeout: 20000 }, (upstream) => {
    let body = "";
    upstream.on("data", (chunk: string) => {
      body += chunk;
    });
    upstream.on("end", () => {
      res.writeHead(upstream.statusCode ?? 500, {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      });
      res.end(body);
    });
  });

  upstreamReq.on("timeout", () => {
    upstreamReq.destroy();
    res.writeHead(504, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "pokemontcg.io timed out" }));
  });

  upstreamReq.on("error", (err: Error) => {
    console.error("[pokemon-search] error:", err.message);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch from pokemontcg.io" }));
    }
  });
}
