import Reveal from "./Reveal";

export default function PageHead({ eyebrow, title, subtitle }) {
  return (
    <section className="px-5 pt-36 pb-16 md:pt-44">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm text-fern-soft">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-[3.2rem]">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-xl text-body">{subtitle}</p>}
      </Reveal>
    </section>
  );
}
