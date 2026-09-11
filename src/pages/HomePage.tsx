import { Hero } from "../components/landing/Hero";
import { LiveCamsTeaser } from "../components/landing/LiveCamsTeaser";
import { AboutStrip } from "../components/landing/AboutStrip";
import { Marquee } from "../components/ui/Marquee";

const MARQUEE = [
  "KEEP PORTLAND WEIRD",
  "1,062 LIVE CAMERAS",
  "EXPECT DRIZZLE",
  "THE BRIDGE IS UP",
  "GO BY BIKE",
];

export function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={MARQUEE} />
      <LiveCamsTeaser />
      <AboutStrip />
    </>
  );
}
