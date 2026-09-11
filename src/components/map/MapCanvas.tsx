import type { ComponentProps, ReactNode, Ref } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  type MapRef,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map-theme.css";
import { MAPBOX_TOKEN, MAP_STYLE, DEFAULT_VIEW } from "../../lib/mapbox";

type MapProps = ComponentProps<typeof Map>;

type Props = Omit<MapProps, "mapboxAccessToken"> & {
  children?: ReactNode;
  ref?: Ref<MapRef>;
  /** Set false on small decorative maps where the controls would crowd. */
  controls?: boolean;
};

/**
 * Wraps react-map-gl with this site's token, style, and control layout so
 * every map on the site starts from the same place. Anything not specified
 * here is passed straight through, and `useMap()` still gives callers the
 * underlying mapbox-gl instance when they need to be imperative.
 */
export function MapCanvas({
  children,
  controls = true,
  style,
  ...props
}: Props) {
  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle={MAP_STYLE}
      initialViewState={DEFAULT_VIEW}
      style={{ width: "100%", height: "100%", ...style }}
      reuseMaps
      {...props}
    >
      {controls && (
        <>
          <GeolocateControl position="top-right" trackUserLocation />
          <NavigationControl position="top-right" visualizePitch />
          <ScaleControl position="bottom-right" unit="imperial" />
        </>
      )}
      {children}
    </Map>
  );
}
