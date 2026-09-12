import { useEffect } from "react";
import { SectionHeading } from "../components/ui/SectionHeading";
import { SkylineDivider } from "../components/ui/SkylineDivider";
import { WobblyButton } from "../components/ui/WobblyButton";

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "Who runs them",
    body: "TripCheck is operated by the Oregon Department of Transportation (ODOT). It's a public traffic-information site — it pulls in live traffic incidents, congestion, closures, and camera images to help people plan trips around Oregon.",
  },
  {
    title: "How many cameras, and where",
    body: "There are over 300 cameras on TripCheck, and ODOT's own materials describe images from more than 1,000 cameras throughout Oregon, southern Washington, northern Nevada, western Idaho, and northern California. They're mounted along major highways like I-5, I-205, I-405, US-101, and other key routes.",
  },
  {
    title: "Not real video — mostly stills on a loop",
    body: "For nearly all locations, you're not watching true live video. Instead, a new camera image is displayed every two seconds, which gives an animated effect of live streaming from a series of still photos. Most cameras update every 5 minutes, though rural cameras may be a bit slower depending on their network connection — but at minimum, every camera updates several times an hour. The one exception is Portland: true live streaming is only available there, made possible through a partnership with trafficland.com.",
  },
  {
    title: "Privacy — nothing is recorded or saved",
    body: "ODOT does not save the camera images. Once an image has been shown for its set time, it's simply overwritten by the next one. Images aren't archived, both because of the storage cost of saving thousands of images a day and out of respect for privacy. So there's no video history to pull up later.",
  },
  {
    title: "How new cameras get added",
    body: "Expansion is deliberate, not automatic. ODOT staff around the state weigh priorities for new camera sites, and factors like access to phone lines and power can limit where cameras can go, on top of ongoing maintenance and operating costs. The public can even submit suggestions for new camera locations to the TripCheck support mailbox.",
  },
  {
    title: "The data is open to developers, too",
    body: "Beyond the website, ODOT offers a public TripCheck API that gives developers access to the same data — incidents, cameras, message signs, weather stations, and more — for building their own apps or integrations.",
  },
];

export function AboutPage() {
  useEffect(() => {
    document.title = "About — PDX Traffic";
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
          <SectionHeading
            eyebrow="Unofficial · Perpetually damp"
            title="About this site"
            blurb={
              <>
                PDX Traffic is a hobby project run by{" "}
                <a
                  href="https://geografa.io/"
                  className="text-rose underline decoration-wavy underline-offset-4 hover:text-moss"
                >
                  Geografa
                </a>
                . It pulls ODOT TripCheck cameras onto a Mapbox map so you can
                poke around Oregon&apos;s roadside views without digging through
                the official site. Nothing here is affiliated with ODOT,
                TripCheck, or Mapbox — just a rainy-day side project.
              </>
            }
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <WobblyButton to="/cams" variant="rose">
              Open the map
            </WobblyButton>
            <WobblyButton href="https://geografa.io/" variant="paper">
              geografa.io
            </WobblyButton>
          </div>
        </div>
      </section>

      <SkylineDivider fill="#1F6F4A" />

      <section className="bg-moss text-paper">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            How TripCheck cameras work
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-paper/90">
            A plain-English rundown based on ODOT&apos;s own site and FAQ — so
            you know what you&apos;re looking at when you open a cam.
          </p>

          <div className="mt-12 space-y-12">
            {SECTIONS.map((section) => (
              <article key={section.title}>
                <h3 className="font-display text-2xl leading-snug sm:text-3xl">
                  {section.title}
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-paper/90">
                  {section.body}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-14 border-t border-dashed border-paper/30 pt-10 text-lg leading-relaxed text-paper/90">
            <span className="font-display text-stag">Bottom line:</span> think
            of it less as &ldquo;surveillance cameras&rdquo; and more as a
            public utility — a state-run network of roadside snapshot cameras,
            refreshed every few minutes, that exists purely to help drivers see
            road and weather conditions and help ODOT manage traffic and
            incidents, with nothing kept or stored afterward.
          </p>

          <div className="mt-10">
            <WobblyButton href="https://www.tripcheck.com/" variant="stag">
              Visit TripCheck
            </WobblyButton>
          </div>
        </div>
      </section>
    </>
  );
}
