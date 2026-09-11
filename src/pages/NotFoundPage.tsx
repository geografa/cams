import { useEffect } from "react";
import { RainOverlay } from "../components/ui/RainOverlay";
import { WobblyButton } from "../components/ui/WobblyButton";

export function NotFoundPage() {
  useEffect(() => {
    document.title = "Lost — PDX Traffic";
  }, []);

  return (
    <section className="relative overflow-hidden bg-fir text-paper">
      <RainOverlay />
      <div className="relative mx-auto max-w-3xl px-5 py-28 text-center">
        <p className="animate-bob font-display text-8xl text-stag sm:text-9xl">
          404
        </p>
        <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
          You took the exit for a street that isn't there.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-paper/90">
          Happens constantly. Portland has a Southwest 4th, a Southeast 4th, and
          a bridge that opens whenever you're late.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <WobblyButton to="/" variant="rose">
            Back to the start
          </WobblyButton>
          <WobblyButton to="/cams" variant="stag">
            Look at cameras instead
          </WobblyButton>
        </div>
      </div>
    </section>
  );
}
