import { init, track } from "@plausible-analytics/tracker";

const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim();

let ready = false;

/** Call once at app startup (browser only). No-ops if domain env is unset. */
export function initAnalytics() {
  if (ready || !domain) return;
  init({
    domain,
    outboundLinks: true,
  });
  ready = true;
}

/** Custom event; safe to call before/without init (no-ops). */
export function trackEvent(
  name: string,
  props?: Record<string, string>,
) {
  if (!ready) return;
  track(name, props ? { props } : {});
}
