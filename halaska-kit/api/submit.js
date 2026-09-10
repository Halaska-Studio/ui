// Form endpoint for the showcase site (Vercel serverless function).
// Receives the studio review request and the updates signup, and delivers
// them by email. Delivery is configured with environment variables:
//   RESEND_API_KEY      send through Resend (https://resend.com), or
//   SUBMIT_WEBHOOK_URL  forward the JSON payload to any webhook instead
//   SUBMIT_TO           recipient (default chris@halaska.com)
//   SUBMIT_FROM         sender for Resend (default "UI by Halaska <kit@halaska.com>")
// No tracking, no third-party marketing platform. Plain text emails only.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO = process.env.SUBMIT_TO || "chris@halaska.com";
const FROM = process.env.SUBMIT_FROM || "UI by Halaska <kit@halaska.com>";

function compose(body) {
  const email = String(body.email || "").trim();
  if (!EMAIL_RE.test(email) || email.length > 200) return { error: "Enter a valid email." };
  if (body.kind === "review") {
    const url = String(body.url || "").trim();
    if (!/^https?:\/\/\S+\.\S+$/i.test(url) || url.length > 500) return { error: "Enter the link to your prototype." };
    return {
      type: "kit-review", email, url,
      subject: `Kit review request: ${url}`,
      text: [`Prototype: ${url}`, `From: ${email}`, "", "Reply with the three things you'd change first.", "", `Sent from ${body.page || "ui.halaska.com"}`].join("\n"),
    };
  }
  if (body.kind === "updates") {
    return {
      type: "kit-updates", email, list: "kit-updates",
      subject: `Kit updates signup: ${email}`,
      text: [`Add to the kit-updates list: ${email}`, "", `Sent from ${body.page || "ui.halaska.com"}`].join("\n"),
    };
  }
  return { error: "Unknown request." };
}

async function deliver(msg) {
  if (process.env.RESEND_API_KEY) {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: msg.email, subject: msg.subject, text: msg.text }),
    });
    if (!r.ok) throw new Error(`resend ${r.status}`);
    return;
  }
  if (process.env.SUBMIT_WEBHOOK_URL) {
    const r = await fetch(process.env.SUBMIT_WEBHOOK_URL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...msg, to: TO, ts: Date.now() }),
    });
    if (!r.ok) throw new Error(`webhook ${r.status}`);
    return;
  }
  const err = new Error("No delivery configured"); err.code = 503; throw err;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const msg = compose(body || {});
  if (msg.error) return res.status(400).json({ ok: false, error: msg.error });
  try {
    await deliver(msg);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(e.code === 503 ? 503 : 502).json({ ok: false, error: "Delivery failed" });
  }
};
