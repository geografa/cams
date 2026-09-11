import { cn } from "../../lib/cn";

/**
 * Portland's default weather, as two drifting layers of repeating-linear-gradient
 * streaks. Pure CSS so it costs nothing; the reduced-motion rule in theme.css
 * stops the drift for anyone who asked for that.
 */
export function RainOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute -inset-y-full inset-x-0 animate-drift opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(102deg, transparent 0 9px, rgba(253,246,227,0.55) 9px 10px, transparent 10px 22px)",
          backgroundSize: "auto 800px",
        }}
      />
      <div
        className="absolute -inset-y-full inset-x-0 animate-drift opacity-15"
        style={{
          backgroundImage:
            "repeating-linear-gradient(97deg, transparent 0 16px, rgba(143,163,173,0.7) 16px 18px, transparent 18px 40px)",
          backgroundSize: "auto 800px",
          animationDuration: "18s",
        }}
      />
    </div>
  );
}
