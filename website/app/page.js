import Hero from "../components/Hero";
import Showcase from "../components/Showcase";
import Download from "../components/Download";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Hero />
      <Showcase />
      <section className="px-5 pb-24 text-center">
        <Link href="/features" className="rounded-full border border-line px-6 py-3 text-sm font-medium transition hover:bg-white/10">
          See every feature
        </Link>
      </section>
      <Download />
    </main>
  );
}
