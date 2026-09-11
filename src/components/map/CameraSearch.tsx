type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  route: string | null;
  routes: string[];
  onRouteChange: (value: string | null) => void;
  matchCount: number;
  totalCount: number;
  onReset: () => void;
};

/**
 * The floating control panel on the cams map: free-text search, a route
 * dropdown, and a live count of what survived the filter.
 */
export function CameraSearch({
  query,
  onQueryChange,
  route,
  routes,
  onRouteChange,
  matchCount,
  totalCount,
  onReset,
}: Props) {
  return (
    <div className="pointer-events-auto w-[min(22rem,calc(100vw-2rem))] rounded-xl bg-paper/95 p-4 ink-border shadow-sticker backdrop-blur">
      <h2 className="font-display text-xl leading-none">Find a camera</h2>

      <label className="mt-3 block">
        <span className="sr-only">Search cameras by name or route</span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Terwilliger, Hood River, I-84…"
          className="w-full rounded-lg bg-paper px-3 py-2 ink-border font-sans text-sm placeholder:text-drizzle"
        />
      </label>

      <label className="mt-3 block">
        <span className="sr-only">Filter by route</span>
        <select
          value={route ?? ""}
          onChange={(e) => onRouteChange(e.target.value || null)}
          className="w-full rounded-lg bg-paper px-3 py-2 ink-border font-sans text-sm"
        >
          <option value="">Every route</option>
          {routes.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p aria-live="polite" className="font-mono text-xs uppercase tracking-widest">
          <span className="text-rose">{matchCount}</span>
          <span className="text-ink/60"> / {totalCount} cams</span>
        </p>
        {(query || route) && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-full bg-stag px-3 py-1 font-mono text-xs uppercase tracking-widest ink-border shadow-sticker-sm active:translate-x-0.5 active:translate-y-0.5"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
