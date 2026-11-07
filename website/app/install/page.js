import PageHead from "../../components/PageHead";
import Reveal from "../../components/Reveal";
import Link from "next/link";
import { RELEASES, REPO } from "../../components/config";

export const metadata = { title: "Install · OpenMusic" };

const android = [
  ["Download the APK", "Open the latest release and tap the APK file."],
  ["Allow the install", "Android asks once to let your browser install apps. Allow it for this download."],
  ["Open the file", "Tap the downloaded file and press Install."],
  ["Say hello", "On first launch OpenMusic explains the optional permissions: notifications and music access."],
];

export default function Install() {
  return (
    <>
      <PageHead
        eyebrow="Install"
        title="Up and running in a minute."
        subtitle="OpenMusic installs from an APK on Android 7.0 and up, and from an installer on Windows."
      />

      <section className="mx-auto max-w-[900px] space-y-16 px-5 pb-24">
        <div>
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">Android</h2>
          </Reveal>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {android.map(([title, body], i) => (
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
            className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-black transition hover:bg-white/80"
          >
            Download for Android
          </a>
        </div>

        <Reveal>
          <div className="rounded-[20px] border border-line bg-card p-6">
            <h2 className="font-display text-xl font-semibold">On a PC?</h2>
            <p className="mt-2 text-sm leading-relaxed text-body">
              The Windows app has its own installer and steps.{" "}
              <Link href="/windows" className="text-ink underline underline-offset-4">See the Windows page</Link>.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-[20px] border border-line bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Open source</h2>
            <p className="mt-2 text-sm leading-relaxed text-body">
              The source code is public, with every release on GitHub.{" "}
              <a href={REPO} className="text-ink underline underline-offset-4">View the repository</a>.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
