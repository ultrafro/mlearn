"use client";

import { motion } from "framer-motion";

interface CurveData {
  name: string;
  color: string;
  // Simulated loss values
  values: number[];
}

const curves: CurveData[] = [
  {
    name: "Bigram",
    color: "#06b6d4",
    values: [3.4, 3.2, 3.0, 2.8, 2.7, 2.65, 2.6, 2.58, 2.55, 2.54, 2.53, 2.52, 2.52, 2.51, 2.51, 2.51, 2.5, 2.5, 2.5, 2.5],
  },
  {
    name: "MLP",
    color: "#f59e0b",
    values: [3.4, 2.9, 2.6, 2.4, 2.3, 2.25, 2.2, 2.18, 2.15, 2.13, 2.12, 2.11, 2.1, 2.1, 2.09, 2.09, 2.08, 2.08, 2.08, 2.08],
  },
  {
    name: "Transformer",
    color: "#7c3aed",
    values: [3.4, 2.7, 2.3, 2.1, 1.95, 1.85, 1.78, 1.73, 1.7, 1.67, 1.65, 1.63, 1.62, 1.61, 1.6, 1.6, 1.59, 1.59, 1.58, 1.58],
  },
];

export function LossCurve() {
  const width = 500;
  const height = 250;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const maxEpoch = curves[0].values.length - 1;
  const minLoss = 1.4;
  const maxLoss = 3.6;

  const xScale = (i: number) => padL + (i / maxEpoch) * plotW;
  const yScale = (v: number) =>
    padT + ((maxLoss - v) / (maxLoss - minLoss)) * plotH;

  const pathD = (values: number[]) =>
    values
      .map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`)
      .join(" ");

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          Training Loss Comparison
        </h3>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[500px] mx-auto">
          {/* Grid lines */}
          {[1.5, 2.0, 2.5, 3.0, 3.5].map((v) => (
            <g key={v}>
              <line
                x1={padL}
                y1={yScale(v)}
                x2={width - padR}
                y2={yScale(v)}
                stroke="#e4e4e7"
                strokeWidth={0.5}
              />
              <text
                x={padL - 8}
                y={yScale(v) + 3}
                textAnchor="end"
                className="fill-zinc-400 text-[9px] font-mono"
              >
                {v.toFixed(1)}
              </text>
            </g>
          ))}
          {/* Axes */}
          <line
            x1={padL}
            y1={padT}
            x2={padL}
            y2={height - padB}
            stroke="#d4d4d8"
            strokeWidth={1}
          />
          <line
            x1={padL}
            y1={height - padB}
            x2={width - padR}
            y2={height - padB}
            stroke="#d4d4d8"
            strokeWidth={1}
          />
          {/* Axis labels */}
          <text
            x={padL + plotW / 2}
            y={height - 5}
            textAnchor="middle"
            className="fill-zinc-400 text-[10px] font-medium"
          >
            Training Steps
          </text>
          <text
            x={12}
            y={padT + plotH / 2}
            textAnchor="middle"
            className="fill-zinc-400 text-[10px] font-medium"
            transform={`rotate(-90, 12, ${padT + plotH / 2})`}
          >
            Loss
          </text>
          {/* Curves */}
          {curves.map((curve) => (
            <motion.path
              key={curve.name}
              d={pathD(curve.values)}
              fill="none"
              stroke={curve.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          ))}
          {/* Legend */}
          {curves.map((curve, i) => (
            <g key={`legend-${curve.name}`}>
              <rect
                x={padL + 10 + i * 110}
                y={padT + 5}
                width={12}
                height={3}
                rx={1.5}
                fill={curve.color}
              />
              <text
                x={padL + 26 + i * 110}
                y={padT + 10}
                className="fill-zinc-600 dark:fill-zinc-400 text-[9px] font-medium"
              >
                {curve.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
