import { useEffect, useState } from "react";
import { Popup } from "react-map-gl/mapbox";
import { cameraImageUrl, type CameraProps } from "../../lib/cameras";

const REFRESH_MS = 30_000;

export type SelectedCamera = CameraProps & {
  longitude: number;
  latitude: number;
};

/**
 * TripCheck overwrites each JPEG in place, so the popup re-requests it with a
 * changing query string to slip past the browser cache while it is open.
 */
export function CameraPopup({
  camera,
  onClose,
}: {
  camera: SelectedCamera;
  onClose: () => void;
}) {
  const [stamp, setStamp] = useState(() => Date.now());

  useEffect(() => {
    setStamp(Date.now());
    const id = setInterval(() => setStamp(Date.now()), REFRESH_MS);
    return () => clearInterval(id);
  }, [camera.cameraId]);

  return (
    <Popup
      longitude={camera.longitude}
      latitude={camera.latitude}
      // No fixed anchor: mapbox-gl flips the popup below the point when the
      // camera sits near the top edge, which keeps it out from under the header.
      offset={16}
      maxWidth="340px"
      closeOnClick={false}
      onClose={onClose}
    >
      <figure className="w-[320px]">
        <img
          key={camera.cameraId}
          src={cameraImageUrl(camera.filename, stamp)}
          alt={`Live traffic camera at ${camera.title}`}
          width={320}
          height={240}
          className="block w-full bg-drizzle/20 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <figcaption className="px-3 py-3">
          <p className="font-display text-base leading-snug text-paper">
            {camera.title}
          </p>
          <p className="mt-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-drizzle">
            {camera.route && (
              <>
                <span className="text-stag">{camera.route}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>refreshes every 30s</span>
          </p>
        </figcaption>
      </figure>
    </Popup>
  );
}
