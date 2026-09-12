import { useCallback, useMemo, useRef, useState } from "react";
import type { MapMouseEvent, MapRef } from "react-map-gl/mapbox";
import type { GeoJSONSource } from "mapbox-gl";
import type { Geometry, Point, Position } from "geojson";
import { MapCanvas } from "./MapCanvas";
import {
  CameraLayer,
  CAMERA_SOURCE_ID,
  CLUSTER_LAYER_ID,
  CAMERA_POINT_LAYER_ID,
  INTERACTIVE_LAYER_IDS,
} from "./CameraLayer";
import {
  TrafficLayer,
  TRAFFIC_INTERACTIVE_LAYER_IDS,
} from "./TrafficLayer";
import { CameraPopup, type SelectedCamera } from "./CameraPopup";
import { TrafficPopup, type SelectedTraffic } from "./TrafficPopup";
import { CameraSearch } from "./CameraSearch";
import { filterCameras, useCameras, type CameraProps } from "../../lib/cameras";
import { useTraffic, type TrafficProps } from "../../lib/traffic";
import { CAMERA_ZOOM, DEFAULT_VIEW } from "../../lib/mapbox";

function popupAnchor(geometry: Geometry | null | undefined): Position | null {
  if (!geometry) return null;
  if (geometry.type === "Point") return geometry.coordinates;
  if (geometry.type === "LineString") {
    const mid = Math.floor(geometry.coordinates.length / 2);
    return geometry.coordinates[mid] ?? geometry.coordinates[0] ?? null;
  }
  if (geometry.type === "Polygon") {
    return geometry.coordinates[0]?.[0] ?? null;
  }
  if (geometry.type === "MultiLineString") {
    return geometry.coordinates[0]?.[0] ?? null;
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates[0]?.[0]?.[0] ?? null;
  }
  return null;
}

export function CameraMap() {
  const mapRef = useRef<MapRef>(null);
  const { cameras, routes, loading, error } = useCameras();
  const traffic = useTraffic();

  const [query, setQuery] = useState("");
  const [route, setRoute] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<SelectedCamera | null>(
    null,
  );
  const [selectedTraffic, setSelectedTraffic] =
    useState<SelectedTraffic | null>(null);

  const visible = useMemo(
    () => filterCameras(cameras, query, route),
    [cameras, query, route],
  );

  const interactiveLayerIds = useMemo(
    () => [...INTERACTIVE_LAYER_IDS, ...TRAFFIC_INTERACTIVE_LAYER_IDS],
    [],
  );

  const flyHome = useCallback(() => {
    mapRef.current?.flyTo({
      center: [DEFAULT_VIEW.longitude, DEFAULT_VIEW.latitude],
      zoom: DEFAULT_VIEW.zoom,
      bearing: 0,
      pitch: 0,
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      speed: 2,
      curve: 1.2,
    });
  }, []);

  const handleClick = useCallback(
    (event: MapMouseEvent) => {
      const feature = event.features?.[0];

      if (!feature) {
        setSelectedCamera(null);
        setSelectedTraffic(null);
        flyHome();
        return;
      }

      const layerId = feature.layer?.id;

      if (layerId === CLUSTER_LAYER_ID) {
        const source = mapRef.current?.getSource(
          CAMERA_SOURCE_ID,
        ) as GeoJSONSource | undefined;
        const clusterId = feature.properties?.cluster_id as number | undefined;
        if (!source || clusterId === undefined) return;

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return;
          const [lng, lat] = (feature.geometry as Point).coordinates;
          mapRef.current?.easeTo({ center: [lng, lat], zoom, duration: 600 });
        });
        return;
      }

      if (layerId === CAMERA_POINT_LAYER_ID) {
        const props = feature.properties as unknown as CameraProps;
        const [longitude, latitude] = (feature.geometry as Point).coordinates;
        setSelectedTraffic(null);
        setSelectedCamera({ ...props, longitude, latitude });
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          ...CAMERA_ZOOM,
          padding: { top: 140, bottom: 0, left: 0, right: 0 },
          speed: 2,
          curve: 1.2,
        });
        return;
      }

      if (TRAFFIC_INTERACTIVE_LAYER_IDS.includes(layerId ?? "")) {
        const props = feature.properties as unknown as TrafficProps;
        const anchor = popupAnchor(feature.geometry as Geometry);
        if (!anchor) return;
        const [longitude, latitude] = anchor;
        setSelectedCamera(null);
        setSelectedTraffic({ ...props, longitude, latitude });
        mapRef.current?.easeTo({
          center: [longitude, latitude],
          duration: 500,
          padding: { top: 120, bottom: 0, left: 0, right: 0 },
        });
      }
    },
    [flyHome],
  );

  const setCursor = useCallback((value: string) => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) canvas.style.cursor = value;
  }, []);

  return (
    <div className="relative h-full w-full">
      <MapCanvas
        ref={mapRef}
        minZoom={5}
        interactiveLayerIds={interactiveLayerIds}
        onClick={handleClick}
        onMouseEnter={() => setCursor("pointer")}
        onMouseLeave={() => setCursor("")}
      >
        <TrafficLayer data={traffic} />
        <CameraLayer data={visible} />
        {selectedCamera && (
          <CameraPopup
            camera={selectedCamera}
            onClose={() => setSelectedCamera(null)}
          />
        )}
        {selectedTraffic && (
          <TrafficPopup
            item={selectedTraffic}
            onClose={() => setSelectedTraffic(null)}
          />
        )}
      </MapCanvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col gap-3 p-4">
        <CameraSearch
          query={query}
          onQueryChange={setQuery}
          route={route}
          routes={routes}
          onRouteChange={setRoute}
          matchCount={visible.features.length}
          totalCount={cameras.features.length}
          onReset={() => {
            setQuery("");
            setRoute(null);
          }}
        />
      </div>

      {(loading || error) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center px-4">
          <p className="rounded-full bg-paper px-5 py-2 font-mono text-xs uppercase tracking-widest ink-border shadow-sticker-sm">
            {error ? `Cameras unavailable: ${error}` : "Rounding up 1,062 cameras…"}
          </p>
        </div>
      )}
    </div>
  );
}
