import { Source, Layer, type LayerProps } from "react-map-gl/mapbox";
import type { TrafficCollection } from "../../lib/traffic";

export const TRAFFIC_SOURCE_ID = "traffic";
export const INCIDENT_POINT_LAYER_ID = "traffic-incident-points";

export const TRAFFIC_INTERACTIVE_LAYER_IDS = [INCIDENT_POINT_LAYER_ID];

const incidentPoints: LayerProps = {
  id: INCIDENT_POINT_LAYER_ID,
  type: "circle",
  source: TRAFFIC_SOURCE_ID,
  filter: ["==", ["geometry-type"], "Point"],
  paint: {
    "circle-color": "#e53060",
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 4, 14, 8],
    "circle-stroke-width": 2,
    "circle-stroke-color": "#fff",
  },
};

export function TrafficLayer({ data }: { data: TrafficCollection }) {
  return (
    <Source id={TRAFFIC_SOURCE_ID} type="geojson" data={data}>
      <Layer {...incidentPoints} />
    </Source>
  );
}
