import type { ElementType, ReactNode } from "react";
import { cn } from "../../lib/cn";

const TILTS = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2"] as const;

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Index into a small set of tilts so a grid of cards looks hand-placed. */
  tilt?: number;
  tape?: boolean;
};

export function StickerCard({
  children,
  className,
  as: Tag = "div",
  tilt,
  tape = false,
}: Props) {
  const tiltClass = tilt === undefined ? "" : TILTS[tilt % TILTS.length];

  return (
    <Tag
      className={cn(
        "relative bg-paper ink-border shadow-sticker rounded-xl",
        tiltClass,
        "transition-transform duration-200 hover:rotate-0 hover:-translate-y-1",
        className,
      )}
    >
      {tape && (
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 bg-stag/80 ink-border border-b-0 border-x-0 border-t-0 shadow-sticker-sm"
        />
      )}
      {children}
    </Tag>
  );
}
