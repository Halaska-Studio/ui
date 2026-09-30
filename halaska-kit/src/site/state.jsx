import { createContext, useContext, useEffect } from "react";

// Site-wide state: theme, accent, the email gate and search. Provided by App.
export const SiteContext = createContext(null);
export const useSite = () => useContext(SiteContext);

// Per-page title and description (the static HTML already carries them for
// crawlers; this keeps them right while navigating client-side).
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · Halaska UI` : "Halaska UI: a UI kit for AI products";
    const el = document.querySelector('meta[name="description"]');
    if (el && description) el.setAttribute("content", description);
  }, [title, description]);
}
