import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/cams", label: "Live Cams" },
];

function Wordmark() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-3"
      aria-label="PDX Traffic, home"
    >
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-rose ink-border shadow-sticker-sm transition-transform group-hover:-rotate-12">
        <span className="text-xl" aria-hidden="true">
          🚦
        </span>
      </span>
      <span className="font-display text-2xl leading-none">
        PDX<span className="text-rose">Traffic</span>
      </span>
    </Link>
  );
}

function navClasses({ isActive }: { isActive: boolean }) {
  return cn(
    "rounded-full px-4 py-2 font-display text-lg transition-all",
    isActive
      ? "bg-ink text-paper -rotate-2"
      : "hover:bg-stag hover:-rotate-2 hover:shadow-sticker-sm hover:ink-border",
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b-3 border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Wordmark />

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClasses}>
              {item.label}
            </NavLink>
          ))}
          <a
            href="https://github.com/geografa/cams"
            className="ml-2 rounded-full px-4 py-2 font-display text-lg transition-all hover:-rotate-2 hover:bg-cascade hover:ink-border hover:shadow-sticker-sm"
          >
            Source
          </a>
        </nav>

        <button
          type="button"
          className="rounded-lg px-3 py-2 ink-border shadow-sticker-sm sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="font-mono text-lg">
            {open ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t-3 border-ink bg-paper px-5 py-4 sm:hidden"
        >
          <ul className="flex flex-col gap-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={navClasses}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/geografa/cams"
                className="rounded-full px-4 py-2 font-display text-lg"
              >
                Source
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
