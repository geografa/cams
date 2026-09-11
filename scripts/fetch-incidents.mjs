#!/usr/bin/env node
/**
 * Scrapes ODOT TripCheck Portland road conditions into public/data/incidents.json.
 * Same source that powers @TripCheckPDX / #pdxtraffic — without depending on X embeds.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REGION = 16; // Portland Oregon Road Conditions
const URL = `https://www.tripcheck.com/DynamicReports/Report/RoadConditions/${REGION}`;
const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/data/incidents.json",
);

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, " · ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(block, re) {
  const m = block.match(re);
  return m ? stripTags(m[1]) : "";
}

function parse(html) {
  const blocks = html.split(/(?=<h4 class="roadCondition-location">)/).slice(1);
  const items = [];

  for (const block of blocks) {
    const location = pick(block, /<h4 class="roadCondition-location">([\s\S]*?)<\/h4>/);
    const type = pick(block, /<h5 class="roadCondition-type[^"]*">([\s\S]*?)<\/h5>/);
    const impact = pick(
      block,
      /<h5 class="roadCondition-impact[^"]*">([\s\S]*?)<\/h5>/,
    );
    const severityMatch = block.match(/severityId_(\d+)/);
    const severity = severityMatch ? Number(severityMatch[1]) : 0;
    const comments = pick(
      block,
      /<dt class="roadCondition-comments">[\s\S]*?<\/dt>\s*<dd>([\s\S]*?)<\/dd>/,
    );
    const details = pick(
      block,
      /<dt class="roadCondition-details">[\s\S]*?<\/dt>\s*<dd>([\s\S]*?)<\/dd>/,
    );
    const body = comments || details;
    if (!location) continue;

    items.push({
      location,
      type,
      impact,
      severity,
      body: body.slice(0, 420),
    });
  }

  // Prefer real delays/construction over future CV notices.
  items.sort((a, b) => b.severity - a.severity || a.location.localeCompare(b.location));
  return items.slice(0, 25).map((item, index) => ({
    ...item,
    id: `${index}-${item.location}|${item.type}|${item.impact}`.slice(0, 180),
  }));
}

const res = await fetch(URL, {
  headers: {
    "User-Agent": "pdxtraffic.com incident fetcher (github.com/geografa/cams)",
    Accept: "text/html",
  },
});

if (!res.ok) {
  console.error(`TripCheck returned ${res.status}`);
  process.exit(1);
}

const html = await res.text();
const incidents = parse(html);
const payload = {
  source: URL,
  region: "Portland",
  fetchedAt: new Date().toISOString(),
  count: incidents.length,
  incidents,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${incidents.length} incidents → ${OUT}`);
