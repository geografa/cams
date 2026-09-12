import { useEffect, useState } from "react";

export type Incident = {
  id: string;
  location: string;
  type: string;
  impact: string;
  severity: number;
  body: string;
};

type FeedPayload = {
  source: string;
  region: string;
  fetchedAt: string;
  count: number;
  incidents: Incident[];
};

function formatFetchedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/**
 * TripCheck incident feed from the official Data API (build-time fetch),
 * same alerts travelers see on TripCheck / @TripCheckPDX.
 */
export function TrafficFeed() {
  const [feed, setFeed] = useState<FeedPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/data/incidents.json", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Feed returned ${res.status}`);
        return res.json() as Promise<FeedPayload>;
      })
      .then(setFeed)
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Could not load feed");
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl bg-ink ink-border shadow-sticker-lg text-paper">
      <div className="flex items-center justify-between gap-3 border-b border-paper/15 px-4 py-3">
        <div>
          <p className="font-display text-lg leading-none">TripCheck alerts</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-drizzle">
            Portland · TripCheck Data API
          </p>
        </div>
        <a
          href="https://x.com/TripCheckPDX"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-full bg-stag px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink ink-border shadow-sticker-sm"
        >
          @TripCheckPDX
        </a>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {!feed && !error && (
          <p className="px-4 py-8 font-mono text-xs uppercase tracking-widest text-drizzle">
            Checking the freeways…
          </p>
        )}

        {error && (
          <p className="px-4 py-8 font-mono text-xs uppercase tracking-widest text-rose">
            Feed unavailable · {error}
          </p>
        )}

        {feed && feed.incidents.length === 0 && (
          <p className="px-4 py-8 font-mono text-xs uppercase tracking-widest text-drizzle">
            No active alerts right now. Weirdly peaceful.
          </p>
        )}

        {feed && (
          <ul>
            {feed.incidents.map((item, index) => (
              <li
                key={`${index}-${item.id}`}
                className="border-b border-paper/10 px-4 py-4 last:border-b-0"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-rose/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-rose">
                    {item.type || "Alert"}
                  </span>
                  {item.impact && (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-stag">
                      {item.impact}
                    </span>
                  )}
                </div>
                <p className="mt-2 font-display text-base leading-snug">
                  {item.location}
                </p>
                {item.body && (
                  <p className="mt-2 text-sm leading-relaxed text-paper/80">
                    {item.body}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-paper/15 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-drizzle">
        <span>
          {feed
            ? `Updated ${formatFetchedAt(feed.fetchedAt)}`
            : "Waiting on TripCheck"}
        </span>
        <a
          href="https://www.tripcheck.com/"
          target="_blank"
          rel="noreferrer"
          className="text-stag underline decoration-dotted underline-offset-4"
        >
          TripCheck →
        </a>
      </div>
    </div>
  );
}
