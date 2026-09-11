import { cn } from "../../lib/cn";

type Props = {
  items: string[];
  className?: string;
};

/**
 * Scrolls `items` forever. The list is rendered twice and translated by -50%,
 * which makes the loop seamless without measuring anything.
 */
export function Marquee({ items, className }: Props) {
  const strip = (
    <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-8 whitespace-nowrap">
          <span className="font-display text-xl">{item}</span>
          <span className="text-rose">✺</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        "overflow-hidden border-y-3 border-ink bg-stag py-3 text-ink",
        className,
      )}
    >
      <div className="flex w-max animate-marquee">
        {strip}
        {strip}
      </div>
      <span className="sr-only">{items.join(". ")}</span>
    </div>
  );
}
