import PageHead from "../../components/PageHead";
import Download from "../../components/Download";
import { RELEASES, REPO } from "../../components/config";

export const metadata = { title: "Download · OpenMusic" };

export default function DownloadPage() {
  return (
    <>
      <PageHead
        eyebrow="Download"
        title="Get the latest build."
        subtitle="Both apps come from the same release page on GitHub."
      />
      <Download />
      <section className="px-5 pb-24 text-center text-sm text-body">
        <a href={RELEASES} className="underline underline-offset-4 hover:text-ink">All releases</a>
        <span className="mx-3 text-muted">·</span>
        <a href={REPO} className="underline underline-offset-4 hover:text-ink">Source on GitHub</a>
      </section>
    </>
  );
}
