// A small history router: real URLs, no dependency. Every route also exists
// as a static HTML file after build (scripts/prerender.mjs), and vercel.json
// rewrites anything else to index.html.
import { useEffect, useState } from "react";

const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());

// Scrolls to an anchor now and again shortly after, because previews above
// it mount lazily and can push it down after the first scroll.
export function scrollToHash(hash, offset = 28) {
  const go = (behavior) => {
    const el = document.getElementById(hash);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior });
  };
  requestAnimationFrame(() => go("smooth"));
  [500, 1200].forEach((ms) => setTimeout(() => go("auto"), ms));
}

export function navigate(to, { replace = false } = {}) {
  const current = window.location.pathname + window.location.search + window.location.hash;
  if (to !== current) window.history[replace ? "replaceState" : "pushState"](null, "", to);
  emit();
  const hash = to.includes("#") ? to.split("#")[1] : "";
  if (hash) scrollToHash(hash);
  else window.scrollTo(0, 0);
}

export function useLocation() {
  const [, tick] = useState(0);
  useEffect(() => {
    const fn = () => tick((n) => n + 1);
    listeners.add(fn);
    window.addEventListener("popstate", fn);
    return () => { listeners.delete(fn); window.removeEventListener("popstate", fn); };
  }, []);
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return { path, search: window.location.search, hash: window.location.hash.slice(1) };
}

export function Link({ to, children, onClick, style, ...rest }) {
  const external = /^(https?:|mailto:)/.test(to);
  return (
    <a href={to} style={style}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      onClick={(e) => {
        onClick?.(e);
        if (external || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}>{children}</a>
  );
}

// Old single-page anchors (#pat-plan, #c-buttons, #grp-control) map onto the new routes.
export function redirectLegacyHash() {
  const h = window.location.hash.slice(1);
  if (!h) return;
  // A deep link straight to an anchor on an index page.
  if (window.location.pathname !== "/") { scrollToHash(h); return; }
  if (h.startsWith("pat-")) navigate(`/patterns/${h.slice(4)}`, { replace: true });
  else if (h.startsWith("grp-")) navigate(`/patterns#${h}`, { replace: true });
  else if (h.startsWith("paradigm-")) navigate(`/screens/${h.slice(9)}`, { replace: true });
  else if (h.startsWith("c-") || h.startsWith("cat-")) navigate("/components", { replace: true });
}
