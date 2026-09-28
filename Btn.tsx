import { ReactNode } from "react";
type P = { href: string; children: ReactNode; ghost?: boolean; external?: boolean; className?: string };
export default function Btn({ href, children, ghost, external, className = "" }: P) {
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex min-h-12 items-center justify-center rounded-sm border px-7 text-[.82rem] font-extrabold tracking-[.08em] transition hover:-translate-y-0.5 ${ghost ? "border-white/35 bg-transparent hover:border-cyan2" : "border-volt bg-volt hover:shadow-[0_0_30px_rgba(43,123,255,.6)]"} ${className}`}>
      {children}
    </a>
  );
}
