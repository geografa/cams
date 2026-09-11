/**
 * Set VITE_MAPBOX_TOKEN in `.env.local` (dev) or as a GitHub Actions variable
 * (CI). A public Mapbox token used to live here as a fallback; GitHub push
 * protection blocks shipping it in git, so the env var is required now.
 */
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

export const MAP_STYLE = "mapbox://styles/grafa/cmb5lcz4m00hp01sy4uamgt72";

/** Downtown-ish Portland, carried over from the original index.html. */
export const DEFAULT_VIEW = {
  longitude: -122.67143949070442,
  latitude: 45.54722707150694,
  zoom: 11,
  bearing: 0,
  pitch: 0,
} as const;

/** The oblique close-up the old page flew to when you clicked a camera. */
export const CAMERA_ZOOM = {
  zoom: 17,
  bearing: -41,
  pitch: 59,
} as const;
