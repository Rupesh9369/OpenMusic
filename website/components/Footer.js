import Link from "next/link";
import { REPO, RELEASES } from "./config";

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-10">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-6 text-sm text-body md:flex-row">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl italic text-ink">
          <img src="/shots/logo.png" alt="" width={24} height={24} className="rounded-md" />
          OpenMusic
        </Link>
        <nav className="flex flex-wrap justify-center gap-6">
          <Link href="/features" className="transition hover:text-ink">Features</Link>
          <Link href="/faq" className="transition hover:text-ink">FAQ</Link>
          <a href={REPO} className="transition hover:text-ink">GitHub</a>
          <a href={RELEASES} className="transition hover:text-ink">Releases</a>
          <a href="https://rupeshh.pages.dev" className="transition hover:text-ink">Portfolio</a>
        </nav>
        <p className="text-muted">© 2026 Rupesh · GPL-3.0</p>
      </div>
    </footer>
  );
}
