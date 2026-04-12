"use client";

import { useState } from "react";

const CHARS = ".abcdefghijklmnopqrstuvwxyz";

// Pre-computed bigram frequencies from a names dataset (simplified)
// Rows = first char, Cols = second char. Values are log-frequencies normalized 0-1
function generateFrequencies(): number[][] {
  const freq: number[][] = [];
  // Seed-based pseudo-random for consistent rendering
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 27; i++) {
    freq.push([]);
    for (let j = 0; j < 27; j++) {
      // Make it sparse — most bigrams are rare
      const r = rand();
      // Common patterns: vowels after consonants, consonants after vowels
      const iChar = CHARS[i];
      const jChar = CHARS[j];
      const isVowel = (c: string) => "aeiou".includes(c);
      let boost = 0;
      if (i > 0 && j > 0) {
        if (isVowel(iChar) !== isVowel(jChar)) boost = 0.3;
        if (iChar === "." || jChar === ".") boost = 0;
      }
      // Start/end tokens
      if (i === 0 && j > 0) boost = isVowel(jChar) ? 0.2 : 0.4; // names start with consonants
      if (j === 0 && i > 0) boost = isVowel(iChar) ? 0.3 : 0.1; // names end with vowels

      freq[i].push(Math.min(1, r * 0.4 + boost));
    }
  }
  return freq;
}

const FREQ = generateFrequencies();

export function BigramHeatmap() {
  const [hover, setHover] = useState<{
    i: number;
    j: number;
  } | null>(null);

  const cellSize = 18;
  const labelSize = 16;
  const width = labelSize + 27 * cellSize;
  const height = labelSize + 27 * cellSize;

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Bigram Frequency Matrix
          </h3>
          {hover && (
            <span className="text-sm font-mono text-violet-600 dark:text-violet-400">
              P({CHARS[hover.j]}|{CHARS[hover.i]}) ={" "}
              {FREQ[hover.i][hover.j].toFixed(2)}
            </span>
          )}
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[600px] mx-auto"
        >
          {/* Column labels */}
          {CHARS.split("").map((c, j) => (
            <text
              key={`col-${j}`}
              x={labelSize + j * cellSize + cellSize / 2}
              y={12}
              textAnchor="middle"
              className="fill-zinc-400 text-[6px] font-mono"
            >
              {c === "." ? "\u00B7" : c}
            </text>
          ))}
          {/* Row labels */}
          {CHARS.split("").map((c, i) => (
            <text
              key={`row-${i}`}
              x={10}
              y={labelSize + i * cellSize + cellSize / 2 + 2}
              textAnchor="middle"
              className="fill-zinc-400 text-[6px] font-mono"
            >
              {c === "." ? "\u00B7" : c}
            </text>
          ))}
          {/* Cells */}
          {FREQ.map((row, i) =>
            row.map((val, j) => (
              <rect
                key={`${i}-${j}`}
                x={labelSize + j * cellSize}
                y={labelSize + i * cellSize}
                width={cellSize - 1}
                height={cellSize - 1}
                rx={2}
                fill={`rgba(124, 58, 237, ${val * 0.9})`}
                className="transition-opacity cursor-pointer"
                opacity={
                  hover ? (hover.i === i && hover.j === j ? 1 : 0.4) : 1
                }
                onMouseEnter={() => setHover({ i, j })}
                onMouseLeave={() => setHover(null)}
              />
            ))
          )}
          {/* Highlight row/col on hover */}
          {hover && (
            <>
              <rect
                x={labelSize}
                y={labelSize + hover.i * cellSize}
                width={27 * cellSize}
                height={cellSize - 1}
                fill="none"
                stroke="#7c3aed"
                strokeWidth={1}
                rx={2}
                opacity={0.5}
              />
              <rect
                x={labelSize + hover.j * cellSize}
                y={labelSize}
                width={cellSize - 1}
                height={27 * cellSize}
                fill="none"
                stroke="#7c3aed"
                strokeWidth={1}
                rx={2}
                opacity={0.5}
              />
            </>
          )}
        </svg>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-3">
          Hover over cells to see bigram probabilities. Brighter = more frequent.
        </p>
      </div>
    </div>
  );
}
