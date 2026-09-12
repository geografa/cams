import { Popup } from "react-map-gl/mapbox";
import type { TrafficProps } from "../../lib/traffic";

export type SelectedTraffic = TrafficProps & {
  longitude: number;
  latitude: number;
};

export function TrafficPopup({
  item,
  onClose,
}: {
  item: SelectedTraffic;
  onClose: () => void;
}) {
  return (
    <Popup
      longitude={item.longitude}
      latitude={item.latitude}
      offset={16}
      maxWidth="320px"
      closeOnClick={false}
      onClose={onClose}
    >
      <div className="w-[280px] px-3 py-3 text-paper">
        <p className="font-mono text-[10px] uppercase tracking-widest text-stag">
          Incident
          {item.type ? ` · ${item.type}` : ""}
        </p>
        <p className="mt-1 font-display text-base leading-snug">{item.title}</p>
        {item.impact && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-drizzle">
            {item.impact}
          </p>
        )}
        {item.body && (
          <p className="mt-2 text-sm leading-relaxed text-paper/85">{item.body}</p>
        )}
      </div>
    </Popup>
  );
}
