import { simulate } from "../public/engine.js";
import { SCENARIO } from "../public/scenario.js";
const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export default {
  async fetch(request, env): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (path === "/api/health" && request.method === "GET")
      return json({
        ok: true,
        version: SCENARIO.version,
        experience: "chancellor-walkthrough-v2",
      });
    if (path === "/api/simulate") {
      if (request.method !== "POST")
        return new Response("Method not allowed", {
          status: 405,
          headers: { Allow: "POST" },
        });
      if (!request.headers.get("content-type")?.includes("application/json"))
        return json({ error: "Expected JSON" }, 415);
      // Bound the stream itself; Content-Length is not trusted.
      const reader = request.body?.getReader();
      if (!reader) return json({ error: "Missing body" }, 400);
      let text = "",
        length = 0;
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.byteLength;
          if (length > 4096) {
            await reader.cancel();
            return json({ error: "Body too large" }, 413);
          }
          text += decoder.decode(value, { stream: true });
        }
        text += decoder.decode();
        return json({
          version: SCENARIO.version,
          ...simulate(JSON.parse(text)),
        });
      } catch {
        return json({ error: "Invalid game payload" }, 400);
      }
    }
    if (path.startsWith("/api/")) return json({ error: "Not found" }, 404);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
