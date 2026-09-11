import { WobblyButton } from "../ui/WobblyButton";
import { RainOverlay } from "../ui/RainOverlay";
import { TapeBadge } from "../ui/TapeBadge";
import { TrafficFeed } from "./TrafficFeed";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-fir text-paper">
      <RainOverlay />

      <div className="relative mx-auto grid max-w-6xl items-start gap-12 px-5 py-20 sm:py-28 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <TapeBadge tone="rose">Unofficial · Perpetually damp</TapeBadge>

          <h1 className="mt-6 font-display text-5xl leading-[0.95] text-shadow-sticker sm:text-7xl lg:text-8xl">
            <span className="block text-stag">Keep Portland</span>
            <span className="block text-paper">
              <span className="line-through decoration-rose decoration-[0.12em]">
                Weird
              </span>{" "}
              <span className="text-rose">Moving</span>
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/90 sm:text-xl">
            Every ODOT traffic camera in Oregon on one map — all{" "}
            <strong className="font-mono text-stag">1,062</strong> of them.
            Made in the rain in Portland.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <WobblyButton to="/cams" variant="rose">
              Open the cam map 📷
            </WobblyButton>
          </div>

          <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-drizzle">
            45.5472° N, 122.6714° W — probably raining
          </p>
        </div>

        <aside aria-label="Portland TripCheck traffic alerts">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-stag">
            Live from TripCheck
          </p>
          <TrafficFeed />
        </aside>
      </div>
    </section>
  );
}
