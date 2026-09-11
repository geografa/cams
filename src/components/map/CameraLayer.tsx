import { Source, Layer, type LayerProps } from "react-map-gl/mapbox";
import type { CameraCollection } from "../../lib/cameras";

export const CAMERA_SOURCE_ID = "cameras";
export const CLUSTER_LAYER_ID = "camera-clusters";
export const CLUSTER_COUNT_LAYER_ID = "camera-cluster-count";
export const CAMERA_POINT_LAYER_ID = "camera-points";

/** Layers that should respond to hover/click on the cams map. */
export const INTERACTIVE_LAYER_IDS = [CLUSTER_LAYER_ID, CAMERA_POINT_LAYER_ID];

const clusterLayer: LayerProps = {
  id: CLUSTER_LAYER_ID,
  type: "circle",
  source: CAMERA_SOURCE_ID,
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#FFB627", // stag, small huddles
      25,
      "#2BB3C0", // cascade
      100,
      "#FF4FA3", // rose, the big interchanges
    ],
    "circle-radius": ["step", ["get", "point_count"], 16, 25, 22, 100, 30],
    "circle-stroke-width": 3,
    "circle-stroke-color": "#171412",
  },
};

const clusterCountLayer: LayerProps = {
  id: CLUSTER_COUNT_LAYER_ID,
  type: "symbol",
  source: CAMERA_SOURCE_ID,
  filter: ["has", "point_count"],
  layout: {
    "text-field": ["get", "point_count_abbreviated"],
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 13,
    "text-allow-overlap": true,
  },
  paint: { "text-color": "#171412" },
};

const pointLayer: LayerProps = {
  id: CAMERA_POINT_LAYER_ID,
  type: "circle",
  source: CAMERA_SOURCE_ID,
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#FF4FA3",
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 5, 17, 11],
    "circle-stroke-width": 2.5,
    "circle-stroke-color": "#FDF6E3",
  },
};

/**
 * 1,062 cameras is far too many for DOM markers, so they ride in a clustered
 * GeoJSON source and get picked out with queryRenderedFeatures on click.
 */
export function CameraLayer({ data }: { data: CameraCollection }) {
  return (
    <Source
      id={CAMERA_SOURCE_ID}
      type="geojson"
      data={data}
      cluster
      clusterRadius={45}
      clusterMaxZoom={13}
    >
      <Layer {...clusterLayer} />
      <Layer {...clusterCountLayer} />
      <Layer {...pointLayer} />
    </Source>
  );
}
