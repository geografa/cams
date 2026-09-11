import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  blurb?: ReactNode;
  className?: string;
};

export function SectionHeading({ eyebrow, title, blurb, className }: Props) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-moss">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
        {title}
      </h2>
      {blurb && <p className="mt-4 text-lg leading-relaxed">{blurb}</p>}
    </div>
  );
}
