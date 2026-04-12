"use client";

import { useMemo } from "react";

function generateSpiral(n: number): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 4 * Math.PI;
    const r = t / (4 * Math.PI);
    const noise = () => (Math.random() - 0.5) * 0.05;
    points.push([r * Math.cos(t) + noise(), r * Math.sin(t) + noise()]);
  }
  return points;
}

export function SpiralDataset() {
  const points = useMemo(() => generateSpiral(300), []);
  const size = 300;
  const scale = (v: number) => (v + 1.1) * (size / 2.2);

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          2D Spiral Dataset
        </h3>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[300px] mx-auto">
          {/* Grid */}
          <line
            x1={size / 2}
            y1={0}
            x2={size / 2}
            y2={size}
            stroke="#e4e4e7"
            strokeWidth={0.5}
          />
          <line
            x1={0}
            y1={size / 2}
            x2={size}
            y2={size / 2}
            stroke="#e4e4e7"
            strokeWidth={0.5}
          />
          {/* Points */}
          {points.map(([x, y], i) => (
            <circle
              key={i}
              cx={scale(x)}
              cy={scale(y)}
              r={2.5}
              fill={`hsl(${(i / points.length) * 300 + 240}, 80%, 60%)`}
              opacity={0.8}
            />
          ))}
        </svg>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-3">
          300 points sampled from a 2D spiral. Color indicates position along the curve.
        </p>
      </div>
    </div>
  );
}
