import { Link } from "react-router-dom";
import { LazyCameraMap } from "../map/LazyCameraMap";
import { SectionHeading } from "../ui/SectionHeading";
import { StickerCard } from "../ui/StickerCard";

const FACTS = [
  { value: "1,062", label: "cameras statewide" },
  { value: "81", label: "routes covered" },
  { value: "30s", label: "image refresh" },
];

export function LiveCamsTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading
        eyebrow="Live from the roadside"
        title="No Flocking Cameras."
        blurb={
          <>
            Pulled straight from ODOT TripCheck and clustered so your browser
            survives it. Click a dot and watch the mayhem. Read the{" "}
            <Link
              to="/about"
              className="font-display text-l text-moss underline decoration-wavy decoration-rose underline-offset-8 hover:text-rose"
            >
              About
            </Link>{" "}
            page for more info on how TripCheck cameras work.
          </>
        }
      />

      <div className="mt-8 flex flex-wrap gap-4">
        {FACTS.map((f, i) => (
          <StickerCard key={f.label} tilt={i} className="px-6 py-4">
            <p className="font-display text-3xl text-rose">{f.value}</p>
            <p className="font-mono text-[11px] uppercase tracking-widest">
              {f.label}
            </p>
          </StickerCard>
        ))}
      </div>

      <div className="mt-10 h-[32rem] overflow-hidden rounded-2xl ink-border shadow-sticker-lg">
        <LazyCameraMap />
      </div>

      <p className="mt-6 text-center">
        <Link
          to="/cams"
          className="font-display text-xl text-moss underline decoration-wavy decoration-rose underline-offset-8 hover:text-rose"
        >
          Give it the whole screen →
        </Link>
      </p>
    </section>
  );
}
