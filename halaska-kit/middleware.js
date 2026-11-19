// Counts pulls of the kit. The install prompt tells a coding agent to fetch
// /halaska-kit.jsx and /install.md; those fetches never run page scripts, so
// this middleware reports each one to the site's GA4 property server-side
// (Measurement Protocol) and lets the request through untouched. It does
// nothing until GA_API_SECRET is set in the project's environment.

export const config = { matcher: ["/halaska-kit.jsx", "/install.md"] };

const MEASUREMENT_ID = "G-CS1TRYYYC2";

const CRAWLERS = /gptbot|oai-searchbot|chatgpt-user|claudebot|claude-searchbot|claude-user|perplexitybot|perplexity-user|googlebot|bingbot|applebot|ccbot|bytespider|amazonbot|duckassistbot|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|ahrefs|semrush|mj12bot|petalbot|yandex|baiduspider/i;

// Who fetched the file: a coding agent's shell, a runtime, a browser, a crawler.
export function agentKind(ua = "") {
  if (!ua) return "none";
  if (CRAWLERS.test(ua)) return "crawler";
  if (/^curl\//i.test(ua)) return "curl";
  if (/^wget/i.test(ua)) return "wget";
  if (/^(node|undici|bun|deno)/i.test(ua)) return "node";
  if (/python|aiohttp|httpx/i.test(ua)) return "python";
  if (/go-http-client/i.test(ua)) return "go";
  if (/mozilla\//i.test(ua)) return "browser";
  return "other";
}

async function sha(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function buildEvent(request, env = {}) {
  const url = new URL(request.url);
  const ua = request.headers.get("user-agent") || "";
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "0";
  const client_id = await sha(`${ip}|${ua}|${env.salt || ""}`);
  return {
    client_id,
    events: [{
      name: "kit_pull",
      params: {
        file: url.pathname.slice(1),
        agent: agentKind(ua),
        country: request.headers.get("x-vercel-ip-country") || "",
        referrer: request.headers.get("referer") || "",
        engagement_time_msec: 1,
      },
    }],
  };
}

export default function middleware(request, context) {
  const secret = process.env.GA_API_SECRET;
  if (secret && request.method === "GET") {
    const send = buildEvent(request, { salt: process.env.GA_CLIENT_SALT })
      .then((body) => fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${secret}`, {
        method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" },
      }))
      .catch(() => {});
    if (context?.waitUntil) context.waitUntil(send);
  }
  // Continue to the static file.
  return new Response(null, { headers: { "x-middleware-next": "1" } });
}
