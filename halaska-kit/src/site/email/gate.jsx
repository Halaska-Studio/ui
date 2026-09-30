// Email capture. The install prompt is the one gated thing, on first use
// only; everything else on the site is open. Sign-ups go straight to the
// studio's Kit form, tagged with where they came from.
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, IconButton, Stack, Text, TextInput, INSTALL_PROMPT, usePal, tokens, motion, interactiveBase, useModalFocus } from "../kit";
import { useSite } from "../state";
import { Link } from "../router";

const KIT_FORM_URL = "https://app.kit.com/forms/9960761/subscriptions";
const SUBSCRIBED_KEY = "halaska:subscribed";
const EMAIL_KEY = "halaska:email";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const BOOK_URL = "https://halaska.com/book";

const store = {
  get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
};
export const hasSubscribed = () => store.get(SUBSCRIBED_KEY) === "1";

const track = (event, params) => { try { window.gtag?.("event", event, params); } catch (e) { /* no analytics */ } };

// Sign-up. Only the email address is sent to Kit.
export async function subscribe(email) {
  const body = new FormData();
  body.append("email_address", email);
  const r = await fetch(KIT_FORM_URL, { method: "POST", headers: { Accept: "application/json" }, body });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.status === "failed") throw new Error(data.errors?.messages?.[0] || "Couldn't sign you up just now.");
  store.set(SUBSCRIBED_KEY, "1");
  store.set(EMAIL_KEY, email);
  return data;
}

export function copyText(text) {
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) { /* nothing more to try */ }
    document.body.removeChild(ta);
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).catch(fallback); else fallback();
}

// The prompt for a target. No target is the full install prompt; a pattern
// or screen adds one instruction that scopes the agent to that piece.
export function promptFor(target) {
  if (!target) return INSTALL_PROMPT;
  if (target.type === "pattern") {
    return `${INSTALL_PROMPT}\n\nFor now, apply one pattern only: ${target.title} (${target.component}). Read its notes at https://ui.halaska.com/patterns/${target.slug}, find the place in this product that matches "${target.useWhen || target.desc}", and build it there. Leave the rest of the UI as it is.`;
  }
  if (target.type === "screen") {
    return `${INSTALL_PROMPT}\n\nFor now, rebuild one screen only, modelled on the ${target.name} example (${target.component}) at https://ui.halaska.com/screens/${target.slug}. Keep this product's own data and routing.`;
  }
  return INSTALL_PROMPT;
}
export const promptLabel = (target) => target?.type === "pattern" ? "Copy prompt for this pattern" : target?.type === "screen" ? "Copy prompt for this screen" : "Copy install prompt";

// ── Gate controller (lives in App) ───────────────────────────────
export function useGateController() {
  const [modal, setModal] = useState(null);   // { placement, target, stage: "email" | "delivered" }
  const [toast, setToast] = useState(null);
  const [subscribed, setSubscribed] = useState(() => (typeof window !== "undefined" ? hasSubscribed() : false));
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const say = useCallback((text) => {
    setToast(text); clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);
  const page = () => window.location.pathname;
  // Every copy button calls this. Subscribed: copies at once. Otherwise the modal asks for an email first.
  const requestPrompt = useCallback(({ placement, target } = {}) => {
    if (hasSubscribed()) {
      copyText(promptFor(target));
      track("kit_prompt_copy", { placement, page: page(), target: target?.slug || "install" });
      say("Prompt copied. Paste it into Claude Code or Cursor.");
      return;
    }
    setModal({ placement, target, stage: "email" });
  }, [say]);
  // Inline fields (hero, detail pages) sign up themselves, then land on the delivered stage.
  const signUp = useCallback(async (email, { placement, target } = {}) => {
    await subscribe(email);
    setSubscribed(true);
    track("kit_signup", { placement, page: page() });
    copyText(promptFor(target));
    setModal({ placement, target, stage: "delivered" });
  }, []);
  const joinUpdates = useCallback(async (email, { placement } = {}) => {
    await subscribe(email);
    setSubscribed(true);
    track("kit_signup", { placement, page: page(), intent: "updates" });
  }, []);
  return { modal, setModal, toast, say, subscribed, setSubscribed, requestPrompt, signUp, joinUpdates };
}

// ── Modal ────────────────────────────────────────────────────────
export function GateModal() {
  const { theme, gate } = useSite();
  const pal = usePal(theme);
  const { modal, setModal } = gate;
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const close = useCallback(() => setModal(null), [setModal]);
  const panelRef = useModalFocus(!!modal, close);
  useEffect(() => {
    if (!modal) return;
    setError(""); setCopied(modal.stage === "delivered");
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [modal, close]);
  if (!modal) return null;
  const prompt = promptFor(modal.target);
  const submit = async () => {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) { setError("Enter a valid email."); return; }
    setSending(true); setError("");
    try { await gate.signUp(value, modal); }
    catch (e) { setError(e.message || "Couldn't sign you up just now."); }
    finally { setSending(false); }
  };
  const delivered = modal.stage === "delivered";
  return (
    <div onClick={close} style={{
      position: "fixed", inset: 0, zIndex: 1200, padding: 16, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
      animation: `halaska-fade-in ${motion.fast} ${motion.easeOut} both`,
    }}>
      <div ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Install prompt" onClick={(e) => e.stopPropagation()} style={{
        width: delivered ? 620 : 440, maxWidth: "100%", maxHeight: "calc(100vh - 32px)", overflowY: "auto",
        background: theme === "dark" ? "rgba(30,30,30,0.97)" : "rgba(255,255,255,0.97)",
        border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.lg, padding: 24,
        boxShadow: `0 16px 48px ${pal.shadowLg}`, fontFamily: tokens.font.sans,
        animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
          <div style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text, flex: 1 }}>
            {delivered ? "Your prompt is copied" : "Get the install prompt"}
          </div>
          <IconButton icon="✕" size={28} theme={theme} label="Close" onClick={close} style={{ marginTop: -4, marginRight: -8 }} />
        </div>
        {!delivered ? (
          <Stack gap={12}>
            <Text size="sm" theme={theme} style={{ color: pal.textSecondary, display: "block", lineHeight: 1.6 }}>
              You get the prompt now. We will also email you when new components and patterns ship, along with other offers and services from Halaska Studio.
            </Text>
            <div className="stack-sm" style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <TextInput theme={theme} type="email" aria-label="Email address" placeholder="you@company.com" value={email}
                onChange={(v) => { setEmail(v); setError(""); }} error={error || undefined} style={{ flex: 1 }} />
              <Button theme={theme} variant="primary" loading={sending} onClick={submit} style={{ flexShrink: 0 }}>Copy install prompt</Button>
            </div>
          </Stack>
        ) : (
          <Stack gap={14}>
            <Text size="sm" theme={theme} style={{ color: pal.textSecondary, display: "block", lineHeight: 1.6 }}>
              Next: paste it as the first message in Claude Code or Cursor, in the project you want to improve.
            </Text>
            <pre style={{
              margin: 0, maxHeight: 260, overflow: "auto", padding: 16, userSelect: "all",
              borderRadius: tokens.radius.md, background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`,
              ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textSecondary, whiteSpace: "pre-wrap", lineHeight: 1.6,
            }}>{prompt}</pre>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <a href={BOOK_URL} target="_blank" rel="noreferrer" style={{ ...tokens.type.sm, color: pal.textSecondary, textDecoration: "underline", textUnderlineOffset: 3 }}>Rather have a designer do it? Book a call</a>
              <span style={{ flex: 1 }} />
              <Button theme={theme} variant="ghost" size="sm" onClick={close}>Done</Button>
              <Button theme={theme} variant="primary" size="sm" icon={copied ? "✓" : "⧉"} onClick={() => { copyText(prompt); setCopied(true); }}>{copied ? "Copied" : "Copy again"}</Button>
            </div>
          </Stack>
        )}
      </div>
    </div>
  );
}

// ── Inline entry points ──────────────────────────────────────────
// The main one: an email field with the copy button. Once signed up it
// collapses to just the button, which copies instantly.
export function InlineGate({ placement, target, label, size = "md", align = "flex-start", width = 420 }) {
  const { theme, gate } = useSite();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const text = label || promptLabel(target);
  if (gate.subscribed) {
    return <Button theme={theme} variant="primary" size={size} icon="⧉" onClick={() => gate.requestPrompt({ placement, target })}>{text}</Button>;
  }
  const submit = async () => {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) { setError("Enter a valid email."); return; }
    setSending(true); setError("");
    try { await gate.signUp(value, { placement, target }); }
    catch (e) { setError(e.message || "Couldn't sign you up just now."); }
    finally { setSending(false); }
  };
  return (
    <div className="stack-sm" style={{ display: "flex", gap: 8, alignItems: "flex-start", justifyContent: align, width, maxWidth: "100%" }}>
      <TextInput theme={theme} type="email" aria-label="Email address" placeholder="you@company.com" value={email} size={size === "lg" ? "lg" : "md"}
        onChange={(v) => { setEmail(v); setError(""); }} error={error || undefined} style={{ flex: 1, minWidth: 0 }} />
      <Button theme={theme} variant="primary" size={size} loading={sending} onClick={submit} style={{ flexShrink: 0 }}>{text}</Button>
    </div>
  );
}

// The lighter offer for the footer and changelog: updates only.
export function UpdatesInline({ placement, width = 360 }) {
  const { theme, gate } = useSite();
  const pal = usePal(theme);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState("idle");
  if (gate.subscribed || state === "done") {
    return <Text size="sm" theme={theme} style={{ color: pal.textSecondary }}>{state === "done" ? "Done. You're on the list." : "You're on the list for new patterns."}</Text>;
  }
  const submit = async () => {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) { setError("Enter a valid email."); return; }
    setState("sending"); setError("");
    try { await gate.joinUpdates(value, { placement }); setState("done"); }
    catch (e) { setState("idle"); setError(e.message || "Couldn't sign you up just now."); }
  };
  return (
    <div className="stack-sm" style={{ display: "flex", gap: 8, alignItems: "flex-start", width, maxWidth: "100%" }}>
      <TextInput theme={theme} type="email" size="sm" aria-label="Email address" placeholder="you@company.com" value={email}
        onChange={(v) => { setEmail(v); setError(""); }} error={error || undefined} style={{ flex: 1, minWidth: 0 }} />
      <Button theme={theme} variant="secondary" size="sm" loading={state === "sending"} onClick={submit} style={{ flexShrink: 0 }}>Notify me</Button>
    </div>
  );
}

// "Add this to your project": the block at the foot of every detail page.
export function AddToProject({ target, placement = "detail-foot" }) {
  const { theme } = useSite();
  const pal = usePal(theme);
  return (
    <div style={{
      marginTop: 56, padding: 24, borderRadius: tokens.radius.lg, border: `1px solid ${pal.borderSubtle}`, background: pal.bgSubtle,
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <Text size="md" weight="semibold" theme={theme}>Add this to your project</Text>
      <Text size="sm" theme={theme} style={{ color: pal.textSecondary, lineHeight: 1.6, maxWidth: 520 }}>
        {target ? "One prompt sets up the kit and tells your coding agent to build this piece where it belongs." : "One prompt sets up the whole kit in Claude Code or Cursor. Then ask for any component by name."}
      </Text>
      <InlineGate placement={placement} target={target} />
      <Text size="xs" theme={theme} style={{ color: pal.textTertiary }}>
        Or read the <Link to="/docs/install" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>install guide</Link>.
      </Text>
    </div>
  );
}

// Confirmation for instant copies.
export function GateToast() {
  const { theme, gate } = useSite();
  const pal = usePal(theme === "dark" ? "light" : "dark");
  if (!gate.toast) return null;
  return (
    <div role="status" style={{
      position: "fixed", left: "50%", bottom: 84, transform: "translateX(-50%)", zIndex: 1100,
      padding: "10px 16px", borderRadius: tokens.radius.pill, background: pal.bg, color: pal.text,
      ...tokens.type.sm, fontFamily: tokens.font.sans, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", whiteSpace: "nowrap", maxWidth: "calc(100vw - 32px)",
      animation: `halaska-step-in ${motion.normal} ${motion.emphasized} both`,
    }}>✓ {gate.toast}</div>
  );
}
