import { lazy, Suspense } from "react";

// mapbox-gl is ~1.8 MB. Keeping it out of the entry chunk means the landing
// page paints without waiting on it.
const CameraMap = lazy(() =>
  import("./CameraMap").then((m) => ({ default: m.CameraMap })),
);

function MapSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center bg-drizzle/20">
      <p className="rounded-full bg-paper px-5 py-2 font-mono text-xs uppercase tracking-widest ink-border shadow-sticker-sm">
        Warming up the map…
      </p>
    </div>
  );
}

export function LazyCameraMap() {
  return (
    <Suspense fallback={<MapSkeleton />}>
      <CameraMap />
    </Suspense>
  );
}
