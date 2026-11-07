"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RELEASES } from "./config";

const links = [
  ["Features", "/features"],
  ["Windows", "/windows"],
  ["Install", "/install"],
  ["FAQ", "/faq"],
];

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <nav className="mx-auto flex max-w-[960px] items-center justify-between rounded-[20px] border border-line bg-black/60 px-5 py-3 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 font-serif text-2xl italic leading-none">
          <img src="/shots/logo.png" alt="" width={28} height={28} className="rounded-md" />
          OpenMusic
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <Link key={label} href={href} className="text-sm text-body transition hover:text-ink">
              {label}
            </Link>
          ))}
        </div>
        <a
          href={RELEASES}
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-black transition hover:bg-white/80"
        >
          Download
        </a>
      </nav>
    </motion.header>
  );
}
