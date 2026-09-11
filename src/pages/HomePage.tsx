import { Hero } from "../components/landing/Hero";
import { LiveCamsTeaser } from "../components/landing/LiveCamsTeaser";
import { AboutStrip } from "../components/landing/AboutStrip";
import { Marquee } from "../components/ui/Marquee";
import { useBridgeEtas } from "../hooks/useBridgeEtas";
import { formatBridgeEtaItems } from "../lib/eta";

const MARQUEE = [
  "KEEP PORTLAND MOVING",
  "1,062 LIVE CAMERAS",
  "EXPECT DRIZZLE",
  "GO BY BIKE",
  "THERE'S A TRAIN Y'KNOW",
];

export function HomePage() {
  const etas = useBridgeEtas();
  const items = etas ? [...formatBridgeEtaItems(etas), ...MARQUEE] : MARQUEE;

  return (
    <>
      <Hero />
      <Marquee items={items} />
      <LiveCamsTeaser />
      <AboutStrip />
    </>
  );
}
