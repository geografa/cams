import { Link } from "react-router-dom";

function RoseStamp() {
  return (
    <div
      aria-hidden="true"
      className="grid h-24 w-24 shrink-0 -rotate-12 place-items-center rounded-full border-4 border-dashed border-rose text-center"
    >
      <span className="font-display text-xs leading-tight text-rose">
        CITY
        <br />
        OF
        <br />
        ROSES
      </span>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t-3 border-ink bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-[auto_1fr_auto] sm:items-start">
        <RoseStamp />

        <div>
          <p className="font-display text-2xl">Made in the rain.</p>
          <p className="mt-2 max-w-md leading-relaxed text-drizzle">
            Camera imagery comes from{" "}
            <a
              className="text-stag underline decoration-dotted underline-offset-4"
              href="https://tripcheck.com/"
            >
              ODOT TripCheck
            </a>
            . Maps and routing come from{" "}
            <a
              className="text-stag underline decoration-dotted underline-offset-4"
              href="https://www.mapbox.com/"
            >
              Mapbox
            </a>
            . This site is unofficial and affiliated with neither.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-2 font-mono text-sm uppercase tracking-widest">
            <li>
              <Link className="hover:text-rose" to="/cams">
                Live Cams
              </Link>
            </li>
            <li>
              <a className="hover:text-rose" href="https://github.com/geografa/pdxtraffic">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <p className="border-t border-drizzle/30 px-5 py-5 text-center font-mono text-xs tracking-widest text-drizzle">
        PDXTRAFFIC.COM — KEEP PORTLAND WEIRD, DRIVE SLOW
      </p>
    </footer>
  );
}
