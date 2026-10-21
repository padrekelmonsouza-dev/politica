import { useState } from "react";

import foroLogo from "@/assets/foro-do-brasil-logo.png";
import { BRAZIL_STATE_PATHS } from "@/data/brazil-states";
import { FORO_PRESENCE_UFS } from "@/lib/campaign-data";

const INACTIVE_FILL = "#e0e0e0";
const ACTIVE_FILL = "#f5c518";
const ACTIVE_HOVER = "#e6b400";
const STROKE = "#ffffff";
const LABEL = "#003c8c";

const LABEL_SHIFT: Record<string, { x: number; y: number }> = {
  DF: { x: 10, y: -6 },
  ES: { x: 8, y: 0 },
  RJ: { x: 8, y: 4 },
  RN: { x: 6, y: -2 },
  PB: { x: 7, y: 0 },
  AL: { x: 7, y: 1 },
  SE: { x: 7, y: 2 },
};

export function BrazilPresenceMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const activeUf = hovered ?? selected;
  const activeState = BRAZIL_STATE_PATHS.find((state) => state.uf === activeUf);
  const activeShift = activeUf ? (LABEL_SHIFT[activeUf] ?? { x: 0, y: 0 }) : { x: 0, y: 0 };

  return (
    <div className="brazil-presence-map relative mx-auto w-full">
      <div className="brazil-presence-map-frame relative">
        <svg
          viewBox="0 0 520 500"
          role="img"
          aria-label="Mapa do Brasil com os 17 estados em que o Foro do Brasil tem presença organizada"
          preserveAspectRatio="xMidYMid meet"
        >
          <title>Presença organizada do Foro do Brasil</title>
          {BRAZIL_STATE_PATHS.map((state) => {
            const active = FORO_PRESENCE_UFS.has(state.uf);
            const isHovered = hovered === state.uf || selected === state.uf;
            return (
              <path
                key={state.uf}
                d={state.d}
                fill={
                  active
                    ? isHovered
                      ? ACTIVE_HOVER
                      : ACTIVE_FILL
                    : isHovered
                      ? "#d4d4d4"
                      : INACTIVE_FILL
                }
                stroke={STROKE}
                strokeWidth={1.15}
                strokeLinejoin="round"
                className="cursor-pointer transition-colors duration-150"
                style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
                onMouseEnter={() => setHovered(state.uf)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(state.uf)}
              >
                <title>
                  {state.name}
                  {active ? " — presença organizada" : ""}
                </title>
              </path>
            );
          })}
          {BRAZIL_STATE_PATHS.map((state) => {
            const active = FORO_PRESENCE_UFS.has(state.uf);
            const shift = LABEL_SHIFT[state.uf] ?? { x: 0, y: 0 };
            return (
              <text
                key={`${state.uf}-label`}
                x={state.cx + shift.x}
                y={state.cy + shift.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={active ? LABEL : "#6b7280"}
                fontSize={active ? 9.5 : 8}
                fontWeight={active ? 800 : 600}
                style={{ fontFamily: "var(--font-display), sans-serif", pointerEvents: "none" }}
              >
                {state.uf}
              </text>
            );
          })}
        </svg>

        {activeState ? (
          <div
            className="pointer-events-none absolute"
            style={{
              left: `${((activeState.cx + activeShift.x) / 520) * 100}%`,
              top: `${((activeState.cy + activeShift.y) / 500) * 100}%`,
              transform: "translate(-50%, -115%)",
              width: 132,
            }}
          >
            <div className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 shadow-lg">
              <img
                src={foroLogo}
                alt="Foro do Brasil"
                width={240}
                height={88}
                className="h-auto w-full"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="brazil-presence-map-caption pointer-events-none">
        {hovered || selected ? (
          <p className="text-center text-xs font-semibold text-gray-700">
            {BRAZIL_STATE_PATHS.find((state) => state.uf === (hovered ?? selected))?.name}
            {FORO_PRESENCE_UFS.has(hovered ?? selected ?? "") ? " · presença organizada" : ""}
          </p>
        ) : (
          <p className="text-center text-xs text-gray-500">
            Passe o mouse ou clique em um estado para ver o Foro do Brasil
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-gray-600">
          <span className="inline-flex items-center gap-2">
            <span
              className="size-3 rounded-sm"
              style={{ background: "#f5c518", boxShadow: "0 0 0 1px rgba(0,0,0,0.08)" }}
            />
            Presença organizada
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              className="size-3 rounded-sm"
              style={{ background: "#e0e0e0", boxShadow: "0 0 0 1px rgba(0,0,0,0.08)" }}
            />
            Demais estados
          </span>
        </div>
      </div>
    </div>
  );
}
