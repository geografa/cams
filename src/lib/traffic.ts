import { useEffect, useState } from "react";
import type { FeatureCollection, Geometry } from "geojson";

export type TrafficProps = {
  kind: "incident";
  id: string;
  title: string;
  type: string;
  impact: string;
  body: string;
  source: string;
};

export type TrafficCollection = FeatureCollection<Geometry, TrafficProps>;

const EMPTY: TrafficCollection = { type: "FeatureCollection", features: [] };

/** Loads build-time TripCheck incident GeoJSON for the cams map. */
export function useTraffic() {
  const [data, setData] = useState<TrafficCollection>(EMPTY);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/traffic.geojson", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`traffic.geojson ${res.status}`);
        return res.json() as Promise<TrafficCollection>;
      })
      .then((fc) => {
        if (fc?.type === "FeatureCollection" && Array.isArray(fc.features)) {
          setData(fc);
        }
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        console.warn("Traffic overlay unavailable", err);
      });
    return () => controller.abort();
  }, []);

  return data;
}
