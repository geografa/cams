#!/usr/bin/env node
/**
 * Fetches ODOT TripCheck Incidents with TRIPCHECK_API_KEY, then writes:
 *   public/data/incidents.json  — homepage feed
 *   public/data/traffic.geojson — cams map overlay (incident points)
 *
 * Never expose the subscription key to the browser (no VITE_ prefix).
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public/data");
const INCIDENTS_OUT = join(OUT_DIR, "incidents.json");
const TRAFFIC_OUT = join(OUT_DIR, "traffic.geojson");

const INCIDENTS_URL = "https://api.odot.state.or.us/tripcheck/Incidents";

/** Portland metro bbox: west,south,east,north (TripCheck rejects statewide boxes). */
const PORTLAND_BOUNDS = "-122.875228,45.414915,-122.631469,45.559331";

const FEED_LIMIT = 25;

function loadEnvFiles() {
  for (const name of [".env.local", ".env"]) {
    const path = join(ROOT, name);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function severityFromImpact(impact) {
  const t = (impact || "").toLowerCase();
  if (!t) return 3;
  if (t.includes("closed") || t.includes("closure") || t.includes("blocked")) {
    return 10;
  }
  if (t.includes("major") || t.includes("significant")) return 8;
  if (t.includes("moderate") || t.includes("delay")) return 6;
  if (t.includes("minimum") || t.includes("minor") || t.includes("no to")) {
    return 4;
  }
  if (t.includes("informational") || t.includes("future")) return 1;
  return 5;
}

function isConstructionish(incident) {
  const blob = [
    incident["event-type-id"],
    incident["impact-desc"],
    incident.headline,
    incident.comments,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return (
    blob.includes("construction") ||
    blob.includes("work zone") ||
    blob.includes("maintenance") ||
    blob.includes("road work")
  );
}

async function tripcheckGet(url, key) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Ocp-Apim-Subscription-Key": key,
      "Cache-Control": "no-cache",
    },
  });
  if (res.status === 401) {
    throw new Error("TripCheck returned 401 — check TRIPCHECK_API_KEY");
  }
  if (res.status === 429) {
    throw new Error("TripCheck rate limit (429) — try again shortly");
  }
  if (!res.ok) {
    throw new Error(`TripCheck ${url} returned ${res.status}`);
  }
  return res.json();
}

function incidentToFeedItem(incident) {
  const start = incident?.location?.["start-location"] ?? {};
  const end = incident?.location?.["end-location"] ?? {};
  const route = incident?.location?.["route-id"] || "";
  const locDesc =
    start["location-desc"] || incident?.location?.["location-name"] || "";
  const mpStart = start["start-milepost"];
  const mpEnd = end["end-milepost"];
  let mile = "";
  if (mpStart != null && mpEnd != null && mpStart !== mpEnd) {
    mile = ` MP ${mpStart}–${mpEnd}`;
  } else if (mpStart != null) {
    mile = ` MP ${mpStart}`;
  }

  const location =
    incident.headline ||
    [route, mile, locDesc].filter(Boolean).join(" · ") ||
    "Oregon highway";

  const impact = incident["impact-desc"] || "";
  const type =
    incident["event-type-id"] ||
    (isConstructionish(incident) ? "Construction" : "Incident");

  return {
    id: String(incident["incident-id"] ?? incident["event-id"] ?? location),
    location,
    type: String(type),
    impact: String(impact),
    severity: severityFromImpact(impact),
    body: String(incident.comments || incident.headline || "").slice(0, 420),
  };
}

function incidentToFeatures(incident) {
  const start = incident?.location?.["start-location"] ?? {};
  const lat = num(start["start-lat"]);
  const lon = num(start["start-long"]);
  if (lat == null || lon == null) return [];

  const feed = incidentToFeedItem(incident);
  return [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [lon, lat] },
      properties: {
        kind: "incident",
        id: feed.id,
        title: feed.location,
        type: feed.type,
        impact: feed.impact,
        body: feed.body,
        source: "incidents",
      },
    },
  ];
}

loadEnvFiles();

const key = process.env.TRIPCHECK_API_KEY?.trim();
if (!key) {
  console.error(
    "TRIPCHECK_API_KEY is missing. Add it to .env.local (or the environment) — never use a VITE_ prefix.",
  );
  process.exit(1);
}

const incidentsUrl = `${INCIDENTS_URL}?${new URLSearchParams({
  IsActive: "true",
  Bounds: PORTLAND_BOUNDS,
})}`;

const incidentsRaw = await tripcheckGet(incidentsUrl, key);

const rawIncidents = Array.isArray(incidentsRaw?.incidents)
  ? incidentsRaw.incidents
  : [];

const feedItems = rawIncidents
  .map(incidentToFeedItem)
  .sort(
    (a, b) => b.severity - a.severity || a.location.localeCompare(b.location),
  )
  .slice(0, FEED_LIMIT)
  .map((item, index) => ({
    ...item,
    id: `${index}-${item.id}`.slice(0, 180),
  }));

const geoFeatures = rawIncidents.flatMap(incidentToFeatures);

const feedPayload = {
  source: INCIDENTS_URL,
  region: "Portland",
  fetchedAt: new Date().toISOString(),
  count: feedItems.length,
  incidents: feedItems,
};

const trafficPayload = {
  type: "FeatureCollection",
  features: geoFeatures,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(INCIDENTS_OUT, `${JSON.stringify(feedPayload, null, 2)}\n`);
writeFileSync(TRAFFIC_OUT, `${JSON.stringify(trafficPayload)}\n`);

console.log(
  `Wrote ${feedItems.length} feed incidents → ${INCIDENTS_OUT}\n` +
    `Wrote ${geoFeatures.length} map features → ${TRAFFIC_OUT} ` +
    `(${rawIncidents.length} API incidents)`,
);
