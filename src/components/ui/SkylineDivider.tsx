import { cn } from "../../lib/cn";

type Props = {
  className?: string;
  /** Fill for the silhouette. Defaults to the deep fir green. */
  fill?: string;
  flip?: boolean;
};

/**
 * Mt. Hood behind a stand of Douglas firs, as a section divider.
 */
export function SkylineDivider({ className, fill = "#0e3b28", flip }: Props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={cn("block h-16 w-full sm:h-24", flip && "rotate-180", className)}
    >
      {/* Mt. Hood */}
      <path
        d="M0 120 L0 96 L210 96 L330 34 L372 58 L396 40 L432 62 L470 44 L560 96 L1200 96 L1200 120 Z"
        fill={fill}
        opacity="0.45"
      />
      {/* fir line */}
      <path
        d="M0 120 L0 104
           L40 104 L56 72 L72 104
           L108 104 L126 60 L144 104
           L186 104 L202 78 L218 104
           L262 104 L282 54 L302 104
           L346 104 L362 80 L378 104
           L430 104 L450 62 L470 104
           L520 104 L536 84 L552 104
           L604 104 L624 56 L644 104
           L694 104 L710 82 L726 104
           L776 104 L796 60 L816 104
           L864 104 L880 86 L896 104
           L946 104 L966 58 L986 104
           L1036 104 L1052 80 L1068 104
           L1120 104 L1140 64 L1160 104
           L1200 104 L1200 120 Z"
        fill={fill}
      />
    </svg>
  );
}
