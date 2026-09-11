import { useCallback, useMemo, useRef, useState } from "react";
import type { MapMouseEvent, MapRef } from "react-map-gl/mapbox";
import type { GeoJSONSource } from "mapbox-gl";
import type { Point } from "geojson";
import { MapCanvas } from "./MapCanvas";
import {
  CameraLayer,
  CAMERA_SOURCE_ID,
  CLUSTER_LAYER_ID,
  INTERACTIVE_LAYER_IDS,
} from "./CameraLayer";
import { CameraPopup, type SelectedCamera } from "./CameraPopup";
import { CameraSearch } from "./CameraSearch";
import { MapLegend } from "./MapLegend";
import { filterCameras, useCameras, type CameraProps } from "../../lib/cameras";
import { CAMERA_ZOOM, DEFAULT_VIEW } from "../../lib/mapbox";

export function CameraMap() {
  const mapRef = useRef<MapRef>(null);
  const { cameras, routes, loading, error } = useCameras();

  const [query, setQuery] = useState("");
  const [route, setRoute] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedCamera | null>(null);

  const visible = useMemo(
    () => filterCameras(cameras, query, route),
    [cameras, query, route],
  );

  const flyHome = useCallback(() => {
    mapRef.current?.flyTo({
      center: [DEFAULT_VIEW.longitude, DEFAULT_VIEW.latitude],
      zoom: DEFAULT_VIEW.zoom,
      bearing: 0,
      pitch: 0,
      // Clears the padding a camera flyTo leaves behind on the map.
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      speed: 2,
      curve: 1.2,
    });
  }, []);

  const handleClick = useCallback(
    (event: MapMouseEvent) => {
      const feature = event.features?.[0];

      // Empty map: back to the default Portland view, same as the old page.
      if (!feature) {
        setSelected(null);
        flyHome();
        return;
      }

      if (feature.layer?.id === CLUSTER_LAYER_ID) {
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

      const props = feature.properties as unknown as CameraProps;
      const [longitude, latitude] = (feature.geometry as Point).coordinates;

      setSelected({ ...props, longitude, latitude });
      mapRef.current?.flyTo({
        center: [longitude, latitude],
        ...CAMERA_ZOOM,
        // Bias the camera downward so the popup lands clear of the search panel.
        padding: { top: 140, bottom: 0, left: 0, right: 0 },
        speed: 2,
        curve: 1.2,
      });
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
        interactiveLayerIds={INTERACTIVE_LAYER_IDS}
        onClick={handleClick}
        onMouseEnter={() => setCursor("pointer")}
        onMouseLeave={() => setCursor("")}
      >
        <CameraLayer data={visible} />
        {selected && (
          <CameraPopup camera={selected} onClose={() => setSelected(null)} />
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

      {/* Sits above the Mapbox wordmark, which has to stay visible. */}
      <div className="pointer-events-none absolute bottom-16 left-4">
        <MapLegend />
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
