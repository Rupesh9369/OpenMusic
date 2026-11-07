import Reveal from "./Reveal";
import { RELEASES } from "./config";

const platforms = [
  {
    name: "Android",
    req: "Android 7.0 and up",
    steps: "Open the APK on your phone. Allow install from your browser when asked.",
    cta: "Download APK",
  },
  {
    name: "Windows",
    req: "Windows 10 and 11, 64-bit",
    steps: "Run OpenMusic-Setup.exe. It is not code-signed yet, so choose More info, then Run anyway.",
    cta: "Download installer",
  },
];

export default function Download() {
  return (
    <section id="download" className="px-5 pt-10 pb-24 md:pb-32">
      <div className="shimmer-line mx-auto mb-24 max-w-[200px]" />

      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm text-fern-soft">Platforms</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-[2.5rem]">
          Get OpenMusic.
        </h2>
        <p className="mt-4 text-body">Free, no ads, GPL-3.0 licensed.</p>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-[900px] gap-4 md:grid-cols-2">
        {platforms.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1} className="h-full">
            <div className="flex h-full flex-col rounded-[20px] border border-line bg-card p-7">
              <p className="font-display text-xl font-semibold">{p.name}</p>
              <p className="mt-1 text-sm text-fern-soft">{p.req}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-body">{p.steps}</p>
              <a
                href={RELEASES}
                className="mt-7 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/80"
              >
                {p.cta}
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
