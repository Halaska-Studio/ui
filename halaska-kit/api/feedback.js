// Receives feedback sent from the site and passes it on to the studio.
// Where it goes is an environment variable (FEEDBACK_WEBHOOK_URL), so no
// endpoint lives in the repository. Until that is set it answers 503 and
// the site points people to GitHub issues instead.
const MAX_TEXT = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map(); // per instance: sender address → send times

function allowedOrigin(origin = "") {
  try {
    const host = new URL(origin).hostname;
    return host === "ui.halaska.com" || host.endsWith(".vercel.app") || host === "localhost" || host === "127.0.0.1";
  } catch (e) { return false; }
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  let raw = "";
  for await (const chunk of req) { raw += chunk; if (raw.length > 20000) throw new Error("Too large"); }
  return JSON.parse(raw || "{}");
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return send(res, 405, { ok: false, error: "POST only." }); }
  if (!allowedOrigin(req.headers.origin)) return send(res, 403, { ok: false, error: "Not allowed from here." });

  let body;
  try { body = await readJson(req); } catch (e) { return send(res, 400, { ok: false, error: "Couldn't read that." }); }
  // A field people never see. Anything in it came from a script, so it is dropped quietly.
  if (body.website) return send(res, 200, { ok: true });

  const text = String(body.text || "").trim();
  const email = String(body.email || "").trim();
  if (text.length < 3) return send(res, 400, { ok: false, error: "Write a few words first." });
  if (text.length > MAX_TEXT) return send(res, 400, { ok: false, error: `Keep it under ${MAX_TEXT} characters.` });
  if (email && !EMAIL_RE.test(email)) return send(res, 400, { ok: false, error: "That email doesn't look right." });

  const now = Date.now();
  const who = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim() || "unknown";
  const times = (recent.get(who) || []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= MAX_PER_WINDOW) return send(res, 429, { ok: false, error: "That's a lot at once. Try again in a few minutes." });
  recent.set(who, [...times, now]);

  const hook = process.env.FEEDBACK_WEBHOOK_URL;
  if (!hook) return send(res, 503, { ok: false, error: "Feedback isn't set up yet." });

  const payload = {
    type: "comment",
    kind: "feedback",
    project: "halaska-ui",
    page: String(body.page || "").slice(0, 300),
    ts: now,
    userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
    comment: { id: `f_${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`, author: email || "Site visitor", text, time: now },
  };
  try {
    const out = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!out.ok) return send(res, 502, { ok: false, error: "Couldn't send that just now." });
  } catch (e) { return send(res, 502, { ok: false, error: "Couldn't send that just now." }); }
  return send(res, 200, { ok: true });
}
