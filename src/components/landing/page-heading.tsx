import type { ReactNode } from "react";

import { PageShell } from "./primitives";

export function PageHeading({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <PageShell className="max-w-3xl">
      <p
        className="mb-3 text-sm font-bold uppercase tracking-widest"
        style={{ color: "var(--yellow-primary)" }}
      >
        {kicker}
      </p>
      <h1
        className="font-black leading-tight"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--blue-primary)",
          fontSize: "clamp(1.5rem, 2.6vw, 2.5rem)",
        }}
      >
        {title}
      </h1>
      {children ? (
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700 sm:text-base">
          {children}
        </div>
      ) : null}
    </PageShell>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      className="text-xl font-black sm:text-2xl"
      style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
    >
      {children}
    </h2>
  );
}
