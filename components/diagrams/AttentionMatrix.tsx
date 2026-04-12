"use client";

import { useState } from "react";

const TOKENS = ["<s>", "e", "m", "m", "a"];

// Simulated attention weights (each row sums to ~1)
const WEIGHTS = [
  [1.0, 0.0, 0.0, 0.0, 0.0],
  [0.3, 0.7, 0.0, 0.0, 0.0],
  [0.1, 0.4, 0.5, 0.0, 0.0],
  [0.1, 0.1, 0.3, 0.5, 0.0],
  [0.05, 0.3, 0.1, 0.15, 0.4],
];

export function AttentionMatrix() {
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const cellSize = 56;
  const labelSize = 48;

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          Self-Attention Weights
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Each row shows what the token attends to. The mask prevents looking
          ahead.
        </p>
        <svg
          viewBox={`0 0 ${labelSize + TOKENS.length * cellSize + 10} ${
            labelSize + TOKENS.length * cellSize + 10
          }`}
          className="w-full max-w-[360px] mx-auto"
        >
          {/* Column labels (keys) */}
          {TOKENS.map((t, j) => (
            <text
              key={`col-${j}`}
              x={labelSize + j * cellSize + cellSize / 2}
              y={30}
              textAnchor="middle"
              className={`text-[12px] font-mono font-semibold ${
                hoverRow !== null
                  ? WEIGHTS[hoverRow][j] > 0.2
                    ? "fill-violet-600"
                    : "fill-zinc-300"
                  : "fill-zinc-500"
              } transition-colors`}
            >
              {t}
            </text>
          ))}
          <text
            x={labelSize + (TOKENS.length * cellSize) / 2}
            y={14}
            textAnchor="middle"
            className="fill-zinc-400 text-[9px] font-medium"
          >
            Keys
          </text>
          {/* Row labels (queries) */}
          {TOKENS.map((t, i) => (
            <text
              key={`row-${i}`}
              x={30}
              y={labelSize + i * cellSize + cellSize / 2 + 4}
              textAnchor="middle"
              className={`text-[12px] font-mono font-semibold ${
                hoverRow === i ? "fill-violet-600" : "fill-zinc-500"
              } transition-colors`}
            >
              {t}
            </text>
          ))}
          {/* Cells */}
          {WEIGHTS.map((row, i) =>
            row.map((val, j) => {
              const isMasked = j > i;
              return (
                <g key={`${i}-${j}`}>
                  <rect
                    x={labelSize + j * cellSize + 2}
                    y={labelSize + i * cellSize + 2}
                    width={cellSize - 4}
                    height={cellSize - 4}
                    rx={6}
                    fill={
                      isMasked
                        ? "#f4f4f5"
                        : `rgba(124, 58, 237, ${val * 0.85})`
                    }
                    className="transition-all cursor-pointer dark:fill-zinc-800"
                    style={
                      isMasked
                        ? undefined
                        : {
                            fill: `rgba(124, 58, 237, ${val * 0.85})`,
                          }
                    }
                    opacity={
                      hoverRow !== null ? (hoverRow === i ? 1 : 0.3) : 1
                    }
                    onMouseEnter={() => setHoverRow(i)}
                    onMouseLeave={() => setHoverRow(null)}
                  />
                  {!isMasked && (
                    <text
                      x={labelSize + j * cellSize + cellSize / 2}
                      y={labelSize + i * cellSize + cellSize / 2 + 4}
                      textAnchor="middle"
                      className={`text-[10px] font-mono ${
                        val > 0.4 ? "fill-white" : "fill-zinc-600"
                      }`}
                      style={{ pointerEvents: "none" }}
                    >
                      {val.toFixed(2)}
                    </text>
                  )}
                  {isMasked && (
                    <text
                      x={labelSize + j * cellSize + cellSize / 2}
                      y={labelSize + i * cellSize + cellSize / 2 + 4}
                      textAnchor="middle"
                      className="fill-zinc-300 dark:fill-zinc-600 text-[10px]"
                      style={{ pointerEvents: "none" }}
                    >
                      --
                    </text>
                  )}
                </g>
              );
            })
          )}
        </svg>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-3">
          Hover over a row to see what that token attends to. Masked cells (--) prevent looking at future tokens.
        </p>
      </div>
    </div>
  );
}
