import { SkylineDivider } from "../ui/SkylineDivider";
import { WobblyButton } from "../ui/WobblyButton";

export function AboutStrip() {
  return (
    <>
      <SkylineDivider fill="#1F6F4A" />
      <section className="bg-moss text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              What even is this?
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-paper/90">
              <p>
                A hobby site for Oregon traffic cameras, pulled from ODOT
                TripCheck and dropped on a Mapbox map. Nothing here is official,
                supported, or especially tidy.
              </p>
              <p>
                Built in Portland, where the bridge is up whenever you&apos;re
                late and the drizzle never quite stops.
              </p>
            </div>
            <div className="mt-8">
              <WobblyButton href="https://www.tripcheck.com/" variant="stag">
                Read the source
              </WobblyButton>
            </div>
          </div>

          <ul className="space-y-4 font-mono text-sm">
            {[
              ["Cameras", "ODOT TripCheck"],
              ["Maps", "Mapbox"],
              ["Built with", "React, Vite, Tailwind"],
              ["Hosted on", "GitHub Pages"],
              ["Weather", "Drizzle, 54°F, always"],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-baseline justify-between gap-4 border-b border-dashed border-paper/30 pb-3"
              >
                <span className="uppercase tracking-widest text-paper/60">
                  {k}
                </span>
                <span className="text-right text-stag">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
