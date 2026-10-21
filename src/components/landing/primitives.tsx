import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const siteContainerStyle: CSSProperties = {
  width: "min(calc(100% - clamp(32px, 5vw, 48px)), 1280px)",
  marginInline: "auto",
  minWidth: 0,
};

/** Container padrão do site — mesma largura/padding em todos os breakpoints */
export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("site-container", className)} style={siteContainerStyle}>
      {children}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px 80px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  headingAs = "h2",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  headingAs?: "h1" | "h2";
}) {
  const Heading = headingAs;
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
      ) : null}
      <Heading
        className="mt-3 font-semibold leading-tight"
        style={{
          fontSize: headingAs === "h1" ? "clamp(1.5rem, 2.6vw, 2.5rem)" : "clamp(1.35rem, 2.2vw, 2.25rem)",
        }}
      >
        {title}
      </Heading>
      <div className={`gold-rule mt-4 sm:mt-5 ${align === "center" ? "mx-auto" : ""}`} />
      {subtitle ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-justify sm:mt-5 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}

export function Counter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string | undefined;
  suffix?: string | undefined;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(value);
  const formatted = `${prefix}${value.toLocaleString("pt-BR")}${suffix}`;

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className="relative inline-block tabular-nums" data-value={value}>
      <span className={inView ? "invisible" : undefined}>{formatted}</span>
      {inView ? (
        <span className="absolute inset-0" aria-hidden="true">
          {prefix}
          {display.toLocaleString("pt-BR")}
          {suffix}
        </span>
      ) : null}
    </span>
  );
}
