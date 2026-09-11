const SWATCHES = [
  { color: "#FF4FA3", label: "One camera" },
  { color: "#FFB627", label: "Under 25" },
  { color: "#2BB3C0", label: "25 to 100" },
  { color: "#FF4FA3", label: "100 plus" },
];

export function MapLegend() {
  return (
    <div className="pointer-events-auto rounded-xl bg-paper/95 px-4 py-3 ink-border shadow-sticker-sm backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-moss">
        Clusters
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {SWATCHES.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full border-2 border-ink"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
