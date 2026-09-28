import { ReactNode, useEffect, useRef, useState } from "react";
export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); o.disconnect(); } }, { threshold: 0.12 });
    o.observe(el); return () => o.disconnect();
  }, []);
  return <div ref={ref} className={`transition-all duration-700 ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"} ${className}`}>{children}</div>;
}
