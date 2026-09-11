import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Tone = "rose" | "moss" | "stag" | "cascade" | "drizzle";

const TONES: Record<Tone, string> = {
  rose: "bg-rose text-paper",
  moss: "bg-moss text-paper",
  stag: "bg-stag text-ink",
  cascade: "bg-cascade text-ink",
  drizzle: "bg-drizzle text-ink",
};

type Props = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

export function TapeBadge({ children, tone = "stag", className }: Props) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 font-mono text-xs uppercase tracking-widest",
        "ink-border shadow-sticker-sm",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
