// Send feedback: a short note from someone using the kit, straight to the
// studio. Opened from the sidebar and the footer. The note goes to the
// site's own /api/feedback, which passes it on; nothing is stored here.
import { useCallback, useEffect, useState } from "react";
import { Button, IconButton, Stack, Text, TextArea, TextInput, usePal, tokens, motion, useModalFocus, rad } from "../kit";
import { useSite } from "../state";
import { track } from "../email/gate";
import { REPO_URL } from "./SideNav";

const MAX = 2000;

export function FeedbackModal() {
  const { theme, feedback, setFeedback } = useSite();
  const pal = usePal(theme);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // never shown to people; see api/feedback.js
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const close = useCallback(() => setFeedback(null), [setFeedback]);
  const panelRef = useModalFocus(!!feedback, close);
  useEffect(() => {
    if (!feedback) return;
    setError(""); setSent(false);
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [feedback, close]);
  if (!feedback) return null;

  const submit = async () => {
    const note = text.trim();
    if (note.length < 3) { setError("Write a few words first."); return; }
    setSending(true); setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: note, email: email.trim(), page: window.location.pathname, website }),
      });
      let data = null;
      try { data = await res.json(); } catch (e) { /* not our endpoint answering */ }
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Couldn't send that just now.");
      setSent(true); setText("");
      track("kit_feedback", { placement: feedback.placement || "unknown" });
    } catch (e) { setError(e.message || "Couldn't send that just now."); }
    finally { setSending(false); }
  };

  return (
    <div onClick={close} style={{
      position: "fixed", inset: 0, zIndex: 1200, padding: 16, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
      animation: `halaska-fade-in ${motion.fast} ${motion.easeOut} both`,
    }}>
      <div ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Send feedback" onClick={(e) => e.stopPropagation()} style={{
        width: 460, maxWidth: "100%", maxHeight: "calc(100vh - 32px)", overflowY: "auto",
        background: theme === "dark" ? "rgba(23,23,23,0.97)" : "rgba(255,255,255,0.97)",
        border: `1px solid ${pal.borderSubtle}`, borderRadius: rad.lg, padding: 24,
        boxShadow: `0 16px 48px ${pal.shadowLg}`, fontFamily: tokens.font.sans,
        animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
          <div style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text, flex: 1 }}>{sent ? "Thank you" : "Send feedback"}</div>
          <IconButton icon="✕" size={28} theme={theme} label="Close" onClick={close} style={{ marginTop: -4, marginRight: -8 }} />
        </div>
        {sent ? (
          <Stack gap={16}>
            <Text size="sm" theme={theme} style={{ color: pal.textSecondary, display: "block", lineHeight: 1.6 }}>
              Your note went straight to the studio. It shapes what gets built next.
            </Text>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button theme={theme} variant="ghost" size="sm" onClick={() => setSent(false)}>Send another</Button>
              <Button theme={theme} variant="primary" size="sm" onClick={close}>Done</Button>
            </div>
          </Stack>
        ) : (
          <Stack gap={12}>
            <Text size="sm" theme={theme} style={{ color: pal.textSecondary, display: "block", lineHeight: 1.6 }}>
              What would make Halaska UI more useful to you? A component you are missing, a pattern you need, or something that did not work.
            </Text>
            <TextArea theme={theme} aria-label="Your feedback" placeholder="I would like to see..." rows={5} value={text}
              onChange={(v) => { setText(v.slice(0, MAX)); setError(""); }} />
            <TextInput theme={theme} type="email" label="Email, if you would like a reply" placeholder="you@company.com" value={email}
              onChange={(v) => { setEmail(v); setError(""); }} />
            {/* Left empty by people; filled in by scripts. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)}
              style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
            {error && (
              <Text size="sm" theme={theme} style={{ color: pal.danger, display: "block", lineHeight: 1.5 }} >
                <span role="alert">{error}</span>{" "}
                <a href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer" className="tl" style={{ color: pal.textSecondary }}>Open an issue on GitHub instead</a>
              </Text>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button theme={theme} variant="ghost" size="sm" onClick={close}>Cancel</Button>
              <Button theme={theme} variant="primary" size="sm" loading={sending} onClick={submit}>Send feedback</Button>
            </div>
          </Stack>
        )}
      </div>
    </div>
  );
}
