import Reveal from "./Reveal";
export default function Heading({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <Reveal className="mb-11">
      <p className="mb-3.5 text-xs font-bold uppercase tracking-[.3em] text-volt">{eyebrow}</p>
      <h2 className="mb-4 text-[clamp(2.2rem,7vw,4rem)]">{title}</h2>
      {lead && <p className="max-w-[560px] text-[#8b93a3]">{lead}</p>}
    </Reveal>
  );
}
