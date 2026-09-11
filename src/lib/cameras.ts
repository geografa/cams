import { useEffect, useMemo, useState } from "react";
import type { FeatureCollection, Point } from "geojson";

/** One row of the Esri FeatureSet that ODOT publishes. */
type OdotAttributes = {
  cameraId: number;
  publishedImageId: number;
  filename: string;
  iconType: number;
  latitude: number;
  longitude: number;
  route: string;
  title: string;
  videoId: number;
};

type OdotPayload = {
  features: Array<{ attributes: OdotAttributes }>;
};

export type CameraProps = {
  cameraId: number;
  title: string;
  route: string;
  filename: string;
};

export type CameraCollection = FeatureCollection<Point, CameraProps>;

export function cameraImageUrl(filename: string, bustCache?: number): string {
  const base = `https://tripcheck.com/RoadCams/cams/${filename}`;
  return bustCache ? `${base}?t=${bustCache}` : base;
}

const EMPTY: CameraCollection = { type: "FeatureCollection", features: [] };

function toGeoJSON(payload: OdotPayload): CameraCollection {
  return {
    type: "FeatureCollection",
    features: payload.features
      // A handful of rows carry null coordinates; they would poison the source.
      .filter(
        ({ attributes: a }) =>
          Number.isFinite(a.longitude) && Number.isFinite(a.latitude),
      )
      .map(({ attributes: a }) => ({
        type: "Feature" as const,
        id: a.cameraId,
        geometry: {
          type: "Point" as const,
          coordinates: [a.longitude, a.latitude],
        },
        properties: {
          cameraId: a.cameraId,
          title: a.title.trim(),
          // ODOT space-pads route to a fixed width ("US101 ", "I-5   ") and is
          // inconsistent about case, so "i-5" and "I-5" arrive as two routes.
          route: a.route.trim().toUpperCase(),
          filename: a.filename,
        },
      })),
  };
}

type State = {
  cameras: CameraCollection;
  routes: string[];
  loading: boolean;
  error: string | null;
};

/**
 * Loads and normalizes the 1,062-camera ODOT payload once per mount.
 */
export function useCameras(): State {
  const [payload, setPayload] = useState<OdotPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/data/odot-cams.json", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Camera list returned ${res.status}`);
        return res.json() as Promise<OdotPayload>;
      })
      .then(setPayload)
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Could not load cameras");
      });

    return () => controller.abort();
  }, []);

  const cameras = useMemo(
    () => (payload ? toGeoJSON(payload) : EMPTY),
    [payload],
  );

  const routes = useMemo(() => {
    const seen = new Set<string>();
    for (const f of cameras.features) {
      if (f.properties.route) seen.add(f.properties.route);
    }
    return [...seen].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  }, [cameras]);

  return {
    cameras,
    routes,
    loading: payload === null && error === null,
    error,
  };
}

/** Narrows a camera collection by free-text query and route. */
export function filterCameras(
  cameras: CameraCollection,
  query: string,
  route: string | null,
): CameraCollection {
  const q = query.trim().toLowerCase();
  if (!q && !route) return cameras;

  return {
    type: "FeatureCollection",
    features: cameras.features.filter((f) => {
      if (route && f.properties.route !== route) return false;
      if (!q) return true;
      const { title, route: r } = f.properties;
      return (
        title.toLowerCase().includes(q) || r.toLowerCase().includes(q)
      );
    }),
  };
}
