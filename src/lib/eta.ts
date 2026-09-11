import { MAPBOX_TOKEN } from "./mapbox";

/** Hayden Island / Jantzen Beach (lon, lat). */
export const JANTZEN_BEACH: [number, number] = [-122.67927, 45.61122];

/** Rose Quarter (lon, lat). */
export const ROSE_QUARTER: [number, number] = [-122.66663, 45.53044];

export type BridgeEtas = {
  outboundMin: number;
  inboundMin: number;
};

type MatrixResponse = {
  durations?: (number | null)[][];
  code?: string;
};

function minutesFromSeconds(sec: number | null | undefined): number | null {
  if (sec == null || !Number.isFinite(sec)) return null;
  return Math.max(1, Math.round(sec / 60));
}

/**
 * One Matrix call (driving-traffic) between Jantzen Beach and Rose Quarter.
 * `outboundMin` is Island → RQ; `inboundMin` is RQ → Island.
 */
export async function fetchBridgeEtas(): Promise<BridgeEtas | null> {
  if (!MAPBOX_TOKEN) return null;

  const coords = `${JANTZEN_BEACH.join(",")};${ROSE_QUARTER.join(",")}`;
  const url =
    `https://api.mapbox.com/directions-matrix/v1/mapbox/driving-traffic/${coords}` +
    `?annotations=duration&access_token=${encodeURIComponent(MAPBOX_TOKEN)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as MatrixResponse;
    if (data.code && data.code !== "Ok") return null;

    const outbound = minutesFromSeconds(data.durations?.[0]?.[1]);
    const inbound = minutesFromSeconds(data.durations?.[1]?.[0]);
    if (outbound == null || inbound == null) return null;

    return { outboundMin: outbound, inboundMin: inbound };
  } catch {
    return null;
  }
}

export function formatBridgeEtaItems(etas: BridgeEtas): string[] {
  return [
    `Jantzen Beach → Rose Quarter · ${etas.outboundMin} min`,
    `Rose Quarter → Jantzen Beach · ${etas.inboundMin} min`,
  ];
}
