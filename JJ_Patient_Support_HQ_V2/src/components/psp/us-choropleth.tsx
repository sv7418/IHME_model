import { useMemo, useState } from "react";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import topology from "us-atlas/states-10m.json";
import { cn } from "@/lib/utils";

const NAME_TO_CODE: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
  Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
  Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK",
  Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI",
  Wyoming: "WY",
};

const WIDTH = 960;
const HEIGHT = 560;

type Shape = { code: string; name: string; d: string; centroid: [number, number] };

const shapes: Shape[] = (() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collection = feature(topology as any, (topology as any).objects.states) as unknown as {
    features: { properties: { name: string }; geometry: unknown }[];
  };
  const projection = geoAlbersUsa().scale(1250).translate([WIDTH / 2, HEIGHT / 2 - 20]);
  const path = geoPath(projection);
  return collection.features
    .map((f) => {
      const code = NAME_TO_CODE[f.properties.name];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = path(f as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = path.centroid(f as any) as [number, number];
      const centroid: [number, number] = [
        Math.round(raw[0] * 100) / 100,
        Math.round(raw[1] * 100) / 100,
      ];
      if (!code || !d) return null;
      return { code, name: f.properties.name, d, centroid };
    })
    .filter(Boolean) as Shape[];
})();

export type MapBand = { min: number; fill: string; label: string };

const DEFAULT_BANDS: MapBand[] = [
  { min: 100, fill: "var(--risk-5)", label: "100+" },
  { min: 50, fill: "var(--risk-4)", label: "50–99" },
  { min: 20, fill: "var(--risk-3)", label: "20–49" },
  { min: 1, fill: "var(--risk-2)", label: "1–19" },
];

/**
 * Five shades of J&J red, scaled to the data so density reads as intensity
 * of a single brand colour rather than a green-to-red ramp.
 */
export function redHeatBands(values: Record<string, number>): MapBand[] {
  // Quantile cuts over the states that have patients, so a single large state
  // does not flatten everyone else into the lightest shade.
  const nonZero = Object.values(values)
    .filter((v) => v > 0)
    .sort((a, b) => a - b);
  const max = Math.max(1, ...nonZero);
  const q = (p: number) => nonZero[Math.min(nonZero.length - 1, Math.floor(p * nonZero.length))] ?? 1;
  const raw = nonZero.length
    ? [q(0.8), q(0.6), q(0.4), q(0.2), 1]
    : [max, max, max, max, 1];
  // Keep the cuts strictly descending and >= 1.
  const cuts = raw.map((v, i) => Math.max(1, i === raw.length - 1 ? 1 : v));
  for (let i = cuts.length - 2; i >= 0; i--) {
    if (cuts[i] <= cuts[i + 1]) cuts[i] = cuts[i + 1] + 1;
  }
  const fills = ["var(--heat-5)", "var(--heat-4)", "var(--heat-3)", "var(--heat-2)", "var(--heat-1)"];
  return cuts.map((min, i) => {
    const upper = i === 0 ? null : cuts[i - 1] - 1;
    return {
      min,
      fill: fills[i],
      label: upper === null ? `${min}+` : min === upper ? `${min}` : `${min}–${upper}`,
    };
  });
}

export function UsChoropleth({
  values,
  selected,
  onSelect,
  metricLabel = "patients in stage",
  bands = DEFAULT_BANDS,
  suffix = "",
}: {
  values: Record<string, number>;
  selected: string | null;
  onSelect: (code: string | null) => void;
  metricLabel?: string;
  bands?: MapBand[];
  suffix?: string;
}) {
  const bandFill = (value: number) => {
    if (!value) return "var(--surface-muted)";
    return bands.find((b) => value >= b.min)?.fill ?? bands[bands.length - 1].fill;
  };
  const [hover, setHover] = useState<Shape | null>(null);
  const labelled = useMemo(() => shapes.filter((s) => (values[s.code] ?? 0) > 0), [values]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label={`US choropleth of ${metricLabel}`}
        >
          {shapes.map((s) => {
            const v = values[s.code] ?? 0;
            const isSel = selected === s.code;
            return (
              <path
                key={s.code}
                d={s.d}
                fill={bandFill(v)}
                stroke={isSel ? "var(--signal)" : "var(--card)"}
                strokeWidth={isSel ? 2.5 : 0.8}
                className={cn(
                  "transition-[fill,opacity] duration-150",
                  v > 0 ? "cursor-pointer" : "cursor-default opacity-70",
                  hover && hover.code !== s.code && v > 0 && "opacity-80",
                )}
                onMouseEnter={() => v > 0 && setHover(s)}
                onMouseLeave={() => setHover(null)}
                onClick={() => v > 0 && onSelect(isSel ? null : s.code)}
              />
            );
          })}

          {labelled.map((s) => (
            <text
              key={`t-${s.code}`}
              x={s.centroid[0]}
              y={s.centroid[1]}
              textAnchor="middle"
              className="pointer-events-none fill-foreground text-[13px] font-semibold"
            >
              {values[s.code]}{suffix}
            </text>
          ))}
        </svg>

        {hover && (
          <div
            className="pointer-events-none absolute z-10 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs shadow-panel"
            style={{
              left: `${(hover.centroid[0] / WIDTH) * 100}%`,
              top: `${(hover.centroid[1] / HEIGHT) * 100}%`,
              transform: "translate(-50%, -125%)",
            }}
          >
            <span className="font-semibold">{hover.name}</span>
            <span className="ml-1.5 tabular text-muted-foreground">
              {values[hover.code] ?? 0}{suffix} {metricLabel}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[11px] font-medium text-muted-foreground">{metricLabel}</span>
        {[...bands].reverse().map((b) => (
          <span key={b.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-3 w-3 rounded-[3px]" style={{ background: b.fill }} />
            {b.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="h-3 w-3 rounded-[3px] border border-border" style={{ background: "var(--surface-muted)" }} />
          none
        </span>
      </div>
    </div>
  );
}
