import PageHead from "../../components/PageHead";
import Reveal from "../../components/Reveal";
import { RELEASES } from "../../components/config";

export const metadata = { title: "Windows · OpenMusic" };

const shots = [
  ["Home", "/shots/01-home.png"],
  ["Discover", "/shots/02-discover.png"],
  ["Search", "/shots/03-search.png"],
  ["Library", "/shots/04-library.png"],
  ["Settings", "/shots/05-settings.png"],
];

const steps = [
  ["Download the installer", "Get OpenMusic-Setup-x.y.z.exe from the latest release."],
  ["If Windows warns you", "The installer is not code-signed yet. On Windows protected your PC, choose More info, then Run anyway."],
  ["Install and play", "Run the installer, then open OpenMusic from the Start menu."],
  ["Updating later", "The app shows a popup when a newer version is out. You can also run a newer installer."],
];

export default function Windows() {
  return (
    <>
      <PageHead
        eyebrow="Windows"
        title="OpenMusic on your PC."
        subtitle="The same player as on Android, made for the keyboard, the mouse and a bigger screen. Windows 10 and 11, 64-bit."
      />

      <section className="mx-auto max-w-[1100px] px-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shots.map(([label, src], i) => (
            <Reveal key={label} delay={(i % 3) * 0.06}>
              <figure className="overflow-hidden rounded-[20px] border border-line bg-card">
                <img src={src} alt={`OpenMusic on Windows: ${label}`} className="w-full" />
                <figcaption className="px-4 py-3 text-sm text-body">{label}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[900px] px-5 pb-24">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold">Install in four steps</h2>
        </Reveal>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {steps.map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.06}>
              <li className="h-full rounded-[20px] border border-line bg-card p-6">
                <span className="font-serif text-lg italic text-fern-soft">{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <a
          href={RELEASES}
          className="mt-10 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-black transition hover:bg-white/80"
        >
          Download for Windows
        </a>
      </section>
    </>
  );
}
