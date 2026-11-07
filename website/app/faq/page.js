import PageHead from "../../components/PageHead";
import Reveal from "../../components/Reveal";
import { REPO } from "../../components/config";

export const metadata = { title: "FAQ · OpenMusic" };

const faqs = [
  ["Is it really free?", "Yes. OpenMusic is free and has no ads."],
  ["Where does the music come from?", "Two catalogues: YouTube Music first, with JioSaavn as an automatic fallback."],
  ["Can I play my own music?", "Yes. Put songs in Music/K4 Audio on your phone, or Music\\K4 Audio on your PC, and they show up in the app."],
  ["Can I bring my Spotify or YouTube Music playlists?", "Yes. Use playlist import and paste the link."],
  ["Is there a Windows version?", "Yes. It runs on Windows 10 and 11, 64-bit. See the Windows page."],
  ["How do I update?", "The app shows a popup when a newer version is out. Tap Update to open the releases page, or Skip to hide that version."],
  ["Windows says it protected my PC. Is that normal?", "Yes, for now. The installer is not code-signed yet. Choose More info, then Run anyway."],
  ["Can I move my phone's music to the PC?", "Yes. Phone to PC transfer sends your library over Wi-Fi, encrypted, with no server in between."],
  ["Where is the source code?", `On GitHub: ${REPO}`],
];

export default function FAQ() {
  return (
    <>
      <PageHead eyebrow="FAQ" title="Good questions." subtitle="The answers you are most likely to need." />
      <section className="mx-auto max-w-[800px] space-y-3 px-5 pb-24">
        {faqs.map(([q, a], i) => (
          <Reveal key={q} delay={(i % 4) * 0.04}>
            <details className="group rounded-[20px] border border-line bg-card p-5 open:border-fern/60">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold">
                {q}
                <span className="text-fern-soft transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-body">{a}</p>
            </details>
          </Reveal>
        ))}
      </section>
    </>
  );
}
