import { CSSProperties, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

export interface CoverflowItem { id: string; title: string; text: string; image: string; }
interface Props { items: CoverflowItem[]; ctaLabel: string; ctaHref: string; interval?: number; }

/** Coverflow 3D: autoplay, setas, teclado, swipe, paginação, fundo desfocado. */
export default function CoverflowCarousel({ items, ctaLabel, ctaHref, interval = 4500 }: Props) {
  const n = items.length;
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);
  const go = useCallback((i: number) => setCur(((i % n) + n) % n), [n]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setCur((c) => (c + 1) % n), interval);
    return () => clearInterval(t);
  }, [paused, n, interval]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(cur - 1);
    if (e.key === "ArrowRight") go(cur + 1);
  };
  const onUp = (x: number) => {
    if (startX.current === null) return;
    const d = x - startX.current; startX.current = null;
    if (Math.abs(d) > 45) { moved.current = true; go(cur + (d < 0 ? 1 : -1)); setTimeout(() => (moved.current = false), 60); }
    setPaused(false);
  };

  return (
    <div className="relative overflow-hidden bg-panel py-20" style={{ "--sp": "min(186px,42vw)" } as CSSProperties}>
      <div className="absolute -inset-10 scale-125 blur-[50px] brightness-[.45] saturate-150 transition-all duration-700"
        style={{ backgroundImage: items[cur].image, backgroundSize: "cover" }} aria-hidden />
      <div className="relative z-10 h-[min(460px,118vw)] outline-none [perspective:1200px]" style={{ touchAction: "pan-y" }}
        tabIndex={0} role="region" aria-roledescription="carrossel" aria-label="Modalidades da VOLT PERFORMANCE"
        onKeyDown={onKey} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onPointerDown={(e) => { startX.current = e.clientX; moved.current = false; setPaused(true); }}
        onPointerUp={(e) => onUp(e.clientX)} onPointerCancel={() => { startX.current = null; setPaused(false); }}>
        {items.map((it, i) => {
          let o = i - cur; if (o > n / 2) o -= n; if (o < -n / 2) o += n;
          const a = Math.abs(o), active = a === 0;
          return (
            <div key={it.id} role="group" aria-roledescription="slide" aria-label={`${i + 1} de ${n}: ${it.title}`} aria-hidden={!active}
              onClick={() => { if (!active && !moved.current) go(i); }}
              className={`absolute left-1/2 top-0 flex h-full w-[min(300px,68vw)] -ml-[min(150px,34vw)] cursor-pointer flex-col justify-end overflow-hidden border p-5 shadow-[0_30px_60px_rgba(0,0,0,.6)] transition-all duration-700 ease-out ${active ? "border-volt shadow-[0_0_50px_rgba(43,123,255,.35)]" : "border-white/15"}`}
              style={{ backgroundImage: it.image, backgroundSize: "cover", backgroundPosition: "center",
                transform: `translateX(calc(var(--sp) * ${o})) translateZ(${-a * 140}px) rotateY(${-o * 38}deg) scale(${a ? 0.92 : 1})`,
                zIndex: 10 - a, opacity: a > 2 ? 0 : 1 - a * 0.28, pointerEvents: a > 2 ? "none" : "auto", filter: a ? `brightness(${1 - a * 0.25})` : "none" }}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/90" />
              <h3 className="relative mb-1.5 text-3xl">{it.title}</h3>
              <p className="relative mb-3.5 text-sm text-[#c3c9d6]">{it.text}</p>
              <a href={ctaHref} target="_blank" rel="noopener noreferrer" tabIndex={active ? 0 : -1}
                className="relative inline-flex min-h-10 items-center self-start border border-volt bg-volt px-4 text-[.7rem] font-extrabold tracking-[.08em]">{ctaLabel}</a>
            </div>
          );
        })}
      </div>
      <div className="relative z-10 mt-8 flex items-center justify-center gap-4">
        <button aria-label="Anterior" onClick={() => go(cur - 1)} className="h-12 w-12 rounded-full border border-white/30 bg-black/40 transition hover:border-volt hover:bg-volt">←</button>
        <div className="flex">
          {items.map((it, i) => (
            <button key={it.id} aria-label={`Ir para ${it.title}`} aria-current={i === cur} onClick={() => go(i)} className="relative h-7 w-7">
              <span className={`absolute left-1/2 top-1/2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${i === cur ? "w-6 bg-cyan2" : "w-2 bg-[#5a6272]"}`} />
            </button>
          ))}
        </div>
        <button aria-label="Próximo" onClick={() => go(cur + 1)} className="h-12 w-12 rounded-full border border-white/30 bg-black/40 transition hover:border-volt hover:bg-volt">→</button>
      </div>
    </div>
  );
}
