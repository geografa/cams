import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

type Variant = "rose" | "moss" | "stag" | "paper";

const VARIANTS: Record<Variant, string> = {
  rose: "bg-rose text-paper",
  moss: "bg-moss text-paper",
  stag: "bg-stag text-ink",
  paper: "bg-paper text-ink",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 " +
  "font-display text-lg tracking-wide ink-border shadow-sticker " +
  "transition-all duration-150 active:translate-x-1 active:translate-y-1 " +
  "active:shadow-sticker-sm hover:-rotate-2";

type BaseProps = { children: ReactNode; variant?: Variant; className?: string };

type ButtonProps = BaseProps &
  ComponentPropsWithoutRef<"button"> & { to?: never; href?: never };

type InternalLinkProps = BaseProps & { to: string; href?: never };

type ExternalLinkProps = BaseProps &
  ComponentPropsWithoutRef<"a"> & { href: string; to?: never };

export function WobblyButton(
  props: ButtonProps | InternalLinkProps | ExternalLinkProps,
) {
  const { children, variant = "rose", className, ...rest } = props;
  const classes = cn(BASE, VARIANTS[variant], className);

  if ("to" in rest && rest.to) {
    const { to, ...linkRest } = rest as InternalLinkProps;
    return (
      <Link to={to} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  if ("href" in rest && rest.href) {
    return (
      <a className={classes} {...(rest as ComponentPropsWithoutRef<"a">)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}
