"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "Q" | "K" | "V";

const MODE_INFO: Record<Mode, { color: string; weight: string; title: string }> = {
  Q: { color: "#7c3aed", weight: "W_q", title: "Query — what am I looking for?" },
  K: { color: "#06b6d4", weight: "W_k", title: "Key — what do I advertise?" },
  V: { color: "#f59e0b", weight: "W_v", title: "Value — what do I share?" },
};

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s / 0xffffffff) * 2 - 1;
  };
}

function makeMatrix(rows: number, cols: number, seed: number): number[][] {
  const rand = seeded(seed);
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Number(rand().toFixed(2)))
  );
}

function multiply(A: number[][], B: number[][]): number[][] {
  const out: number[][] = [];
  for (let i = 0; i < A.length; i++) {
    out.push([]);
    for (let j = 0; j < B[0].length; j++) {
      let s = 0;
      for (let k = 0; k < A[0].length; k++) s += A[i][k] * B[k][j];
      out[i].push(Number(s.toFixed(2)));
    }
  }
  return out;
}

type HL = {
  row?: number | null;
  col?: number | null;
  cell?: { i: number; j: number } | null;
};

function Matrix({
  data,
  label,
  shape,
  hl,
  color,
  cellSize,
}: {
  data: number[][];
  label: string;
  shape: string;
  hl: HL;
  color: string;
  cellSize: number;
}) {
  const max = Math.max(0.001, ...data.flat().map((v) => Math.abs(v)));
  const rows = data.length;
  const cols = data[0].length;
  const w = cols * cellSize + 2;
  const h = rows * cellSize + 2;
  return (
    <div className="flex flex-col items-center">
      <div className="text-[11px] font-mono font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
        {label}
      </div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        {data.map((row, i) =>
          row.map((v, j) => {
            const intensity = Math.abs(v) / max;
            return (
              <motion.rect
                key={`${i}-${j}`}
                x={1 + j * cellSize}
                y={1 + i * cellSize}
                width={cellSize - 1}
                height={cellSize - 1}
                rx={2}
                fill={v >= 0 ? color : "#71717a"}
                initial={false}
                animate={{ opacity: 0.18 + intensity * 0.7 }}
                transition={{ duration: 0.25 }}
              />
            );
          })
        )}
        {data.map((row, i) =>
          row.map((v, j) =>
            cellSize >= 22 ? (
              <text
                key={`t-${i}-${j}`}
                x={1 + j * cellSize + cellSize / 2}
                y={1 + i * cellSize + cellSize / 2 + 3}
                textAnchor="middle"
                fontSize={cellSize >= 28 ? 9 : 8}
                className="font-mono fill-white pointer-events-none"
              >
                {v.toFixed(1)}
              </text>
            ) : null
          )
        )}
        {/* Row highlight */}
        {hl.row != null && (
          <motion.rect
            x={0}
            y={1 + hl.row * cellSize - 1}
            width={w}
            height={cellSize + 2}
            fill="none"
            stroke="#facc15"
            strokeWidth={2.5}
            rx={3}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
        {/* Col highlight */}
        {hl.col != null && (
          <motion.rect
            x={1 + hl.col * cellSize - 1}
            y={0}
            width={cellSize + 2}
            height={h}
            fill="none"
            stroke="#facc15"
            strokeWidth={2.5}
            rx={3}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
        {/* Cell highlight (pulse) */}
        {hl.cell && (
          <motion.rect
            key={`cell-${hl.cell.i}-${hl.cell.j}`}
            x={1 + hl.cell.j * cellSize}
            y={1 + hl.cell.i * cellSize}
            width={cellSize - 1}
            height={cellSize - 1}
            rx={2}
            fill="none"
            stroke="#facc15"
            strokeWidth={3}
            initial={{ opacity: 0, scale: 1.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          />
        )}
      </svg>
      <div className="text-[10px] font-mono text-zinc-400 mt-1.5 tracking-wide">
        {shape}
      </div>
    </div>
  );
}

export function QKVMatrixViz() {
  const [T, setT] = useState(4);
  const [C, setC] = useState(6);
  const [H, setH] = useState(4);
  const [mode, setMode] = useState<Mode>("Q");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  const X = useMemo(() => makeMatrix(T, C, 13), [T, C]);
  const Wq = useMemo(() => makeMatrix(C, H, 17), [C, H]);
  const Wk = useMemo(() => makeMatrix(C, H, 23), [C, H]);
  const Wv = useMemo(() => makeMatrix(C, H, 29), [C, H]);

  const W = mode === "Q" ? Wq : mode === "K" ? Wk : Wv;
  const result = useMemo(() => multiply(X, W), [X, W]);
  const totalSteps = T * H;

  useEffect(() => {
    setStep((s) => Math.min(s, totalSteps - 1));
  }, [totalSteps]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => (s + 1) % totalSteps);
    }, 750);
    return () => clearInterval(id);
  }, [playing, totalSteps]);

  const i = Math.floor(step / H);
  const j = step % H;
  const products = X[i].map((xv, k) => xv * W[k][j]);
  const sum = products.reduce((a, b) => a + b, 0);

  const info = MODE_INFO[mode];
  const cellSize = Math.max(22, Math.min(34, Math.floor(220 / Math.max(C, H))));

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Q/K/V projection: X · W = {mode}
          </h3>
          <span className="text-[11px] font-medium" style={{ color: info.color }}>
            {info.title}
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Each output cell is a dot product:{" "}
          <code className="font-mono">
            {mode}[i,j] = Σ<sub>k</sub> X[i,k] · {info.weight}[k,j]
          </code>
          . The highlighted row of X dotted with the highlighted column of {info.weight} produces the highlighted cell of {mode}.
        </p>

        <div className="flex gap-2 mb-5">
          {(Object.keys(MODE_INFO) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setStep(0);
              }}
              className="px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors"
              style={
                mode === m
                  ? { backgroundColor: MODE_INFO[m].color, color: "white" }
                  : { color: MODE_INFO[m].color, backgroundColor: "transparent", border: `1px solid ${MODE_INFO[m].color}55` }
              }
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2">
          <Matrix
            data={X}
            label="X  (input embeddings)"
            shape={`T × C  =  ${T} × ${C}`}
            hl={{ row: i }}
            color="#10b981"
            cellSize={cellSize}
          />
          <div className="text-3xl text-zinc-400 font-light px-1">×</div>
          <Matrix
            data={W}
            label={`${info.weight}  (learned weights)`}
            shape={`C × H  =  ${C} × ${H}`}
            hl={{ col: j }}
            color={info.color}
            cellSize={cellSize}
          />
          <div className="text-3xl text-zinc-400 font-light px-1">=</div>
          <Matrix
            data={result}
            label={`${mode}  (projected)`}
            shape={`T × H  =  ${T} × ${H}`}
            hl={{ cell: { i, j } }}
            color={info.color}
            cellSize={cellSize}
          />
        </div>

        <div className="mt-5 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/40">
          <div className="text-[11px] font-mono text-zinc-500 mb-1.5">
            Computing {mode}[{i},{j}]
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${i}-${j}-${T}-${C}-${H}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 font-mono text-xs"
            >
              {products.map((p, k) => (
                <span key={k} className="text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                  <span className="text-emerald-500">{X[i][k].toFixed(2)}</span>
                  <span className="text-zinc-400 mx-0.5">·</span>
                  <span style={{ color: info.color }}>{W[k][j].toFixed(2)}</span>
                  {k < products.length - 1 && <span className="text-zinc-400 ml-1">+</span>}
                </span>
              ))}
              <span className="text-zinc-400 mx-1">=</span>
              <span className="font-bold text-yellow-500">{sum.toFixed(2)}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setPlaying(!playing)}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center text-xs font-bold hover:bg-violet-600 transition-colors"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "||" : "\u25B6"}
          </button>
          <span className="text-[11px] font-mono text-zinc-500 flex-shrink-0 w-24">
            step {step + 1} / {totalSteps}
          </span>
          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={step}
            onChange={(e) => {
              setPlaying(false);
              setStep(Number(e.target.value));
            }}
            className="flex-1 h-2 accent-violet-500 cursor-pointer"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {(
            [
              { label: "T  (seq length)", v: T, set: setT, min: 2, max: 8 },
              { label: "C  (embed dim)", v: C, set: setC, min: 2, max: 8 },
              { label: "H  (head size)", v: H, set: setH, min: 2, max: 8 },
            ] as const
          ).map(({ label, v, set, min, max }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-2.5 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800/40"
            >
              <span className="text-[10px] font-mono text-zinc-500 flex-shrink-0 w-24">
                {label}
              </span>
              <input
                type="range"
                min={min}
                max={max}
                value={v}
                onChange={(e) => set(Number(e.target.value))}
                className="flex-1 h-1.5 accent-violet-500 cursor-pointer"
              />
              <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300 w-5 text-right">
                {v}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-4 text-center">
          The same X feeds into all three projections — toggle Q/K/V to see how the same input becomes three different views via three different weight matrices.
        </p>
      </div>
    </div>
  );
}
