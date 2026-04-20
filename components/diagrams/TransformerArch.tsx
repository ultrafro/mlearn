"use client";

import { motion } from "framer-motion";

export function TransformerArch() {
  // Layout constants
  const W = 620;
  const H = 760;
  const cx = 175;          // central column for stem boxes
  const boxW = 170;
  const boxH = 38;
  const residualX = cx + boxW / 2 + 90; // x-coordinate for residual loop arc

  type Box = {
    id: string;
    label: string;
    sub?: string;
    color: string;
    /** Weight-parameter annotations rendered to the right of the box. */
    weights?: string[];
  };

  const top: Box[] = [
    { id: "softmax", label: "Softmax", sub: "→ probabilities", color: "#f43f5e" },
    {
      id: "linear",
      label: "Linear (lm_head)",
      sub: "n_embd → vocab",
      color: "#f43f5e",
      weights: ["W: (n_embd, vocab)"],
    },
    {
      id: "lnf",
      label: "LayerNorm",
      sub: "ln_f",
      color: "#a1a1aa",
      weights: ["γ, β: (n_embd,)"],
    },
  ];

  const bottom: Box[] = [
    {
      id: "embed",
      label: "Token Emb  +  Position Emb",
      sub: "tok_emb(idx) + pos_emb(arange(T))",
      color: "#06b6d4",
      weights: [
        "tok: (vocab, n_embd)",
        "pos: (block_size, n_embd)",
      ],
    },
  ];

  const blockItems: (Box & { kind: "node" | "add" })[] = [
    { id: "ln1", kind: "node", label: "LayerNorm", sub: "ln1", color: "#a1a1aa", weights: ["γ, β: (n_embd,)"] },
    {
      id: "mha",
      kind: "node",
      label: "Multi-Head Attention",
      sub: "softmax(Q·Kᵀ / √d) · V  ×  n_head",
      color: "#7c3aed",
      weights: [
        "W_q, W_k, W_v: (n_embd, head)·n_head",
        "W_o: (n_embd, n_embd)",
      ],
    },
    { id: "add1", kind: "add", label: "+", color: "#10b981" },
    { id: "ln2", kind: "node", label: "LayerNorm", sub: "ln2", color: "#a1a1aa", weights: ["γ, β: (n_embd,)"] },
    {
      id: "ffn",
      kind: "node",
      label: "Feed Forward",
      sub: "Linear → ReLU → Linear",
      color: "#f59e0b",
      weights: [
        "fc1: (n_embd, 4·n_embd)",
        "fc2: (4·n_embd, n_embd)",
      ],
    },
    { id: "add2", kind: "add", label: "+", color: "#10b981" },
  ];

  const padTop = 30;
  const labelGap = 24;
  const blockGap = 22;
  const innerGap = 22;
  const blockPad = 28;

  let y = padTop;
  const yProbLabel = y;
  y += labelGap;

  const topYs: number[] = [];
  for (const _ of top) {
    topYs.push(y);
    y += boxH + blockGap;
  }

  const blockTopY = y;
  y += blockPad;

  const blockYs: number[] = [];
  const reversedBlockItems = [...blockItems].reverse();
  const addH = 28;
  for (const item of reversedBlockItems) {
    blockYs.push(y);
    y += (item.kind === "add" ? addH : boxH) + innerGap;
  }
  y -= innerGap;
  y += blockPad;
  const blockBottomY = y;
  y += blockGap;

  const bottomYs: number[] = [];
  for (const _ of bottom) {
    bottomYs.push(y);
    y += boxH + blockGap;
  }
  const yInputLabel = y - blockGap + 6;

  const itemAt = new Map<string, { y: number; h: number; centerY: number }>();
  top.forEach((b, i) => itemAt.set(b.id, { y: topYs[i], h: boxH, centerY: topYs[i] + boxH / 2 }));
  reversedBlockItems.forEach((b, i) => {
    const h = b.kind === "add" ? addH : boxH;
    itemAt.set(b.id, { y: blockYs[i], h, centerY: blockYs[i] + h / 2 });
  });
  bottom.forEach((b, i) => itemAt.set(b.id, { y: bottomYs[i], h: boxH, centerY: bottomYs[i] + boxH / 2 }));

  const flowOrder = ["embed", "ln1", "mha", "add1", "ln2", "ffn", "add2", "lnf", "linear", "softmax"];

  const shapeLabels: { id: string; text: string; where: "below" | "above" }[] = [
    { id: "embed", text: "(B, T, n_embd)", where: "above" },
    { id: "lnf", text: "(B, T, n_embd)", where: "above" },
    { id: "linear", text: "(B, T, vocab)", where: "above" },
  ];

  const arcPath = (fromY: number, toY: number) => {
    const startX = cx + boxW / 2;
    const endX = cx + boxW / 2;
    const peakX = residualX;
    return `M ${startX} ${fromY}
            C ${peakX} ${fromY}, ${peakX} ${toY}, ${endX + 6} ${toY}`;
  };

  const blockInputBranch = blockBottomY - 4;
  const add1Mid = itemAt.get("add1")!.centerY;
  const add2Mid = itemAt.get("add2")!.centerY;
  const branchAfterAdd1 = (itemAt.get("add1")!.y) - innerGap / 2 - 2;

  // x-coordinate where weight annotations begin (just past the residual arc)
  const weightX = residualX + 18;

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          Transformer Block Architecture
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Pre-norm GPT-style block. Data flows bottom → top. Left labels show the activation tensor shape; right labels show each layer&apos;s learnable weights. Dashed lines are residual (skip) connections.
        </p>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[620px] mx-auto">
          <defs>
            <marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-zinc-500 dark:fill-zinc-400" />
            </marker>
            <marker id="arrowhead-residual" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Block container (dashed) */}
          <motion.rect
            x={cx - boxW / 2 - 14}
            y={blockTopY}
            width={boxW + 28}
            height={blockBottomY - blockTopY}
            rx={10}
            fill="none"
            stroke="#a78bfa"
            strokeOpacity={0.5}
            strokeWidth={1.5}
            strokeDasharray="6 4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          />

          {/* Sub-layer accent bars */}
          {(() => {
            const ln1 = itemAt.get("ln1")!;
            const mha = itemAt.get("mha")!;
            const ln2 = itemAt.get("ln2")!;
            const ffn = itemAt.get("ffn")!;
            const groups = [
              { top: mha.y - 3, bottom: ln1.y + ln1.h + 3, color: "#7c3aed" },
              { top: ffn.y - 3, bottom: ln2.y + ln2.h + 3, color: "#f59e0b" },
            ];
            const barX = cx - boxW / 2 - 7;
            return groups.map((g, i) => (
              <motion.rect
                key={`group-${i}`}
                x={barX}
                y={g.top}
                width={3}
                height={g.bottom - g.top}
                rx={1.5}
                fill={g.color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
              />
            ));
          })()}

          {/* xN badge — far right */}
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <rect
              x={W - 64}
              y={(blockTopY + blockBottomY) / 2 - 18}
              width={56}
              height={36}
              rx={8}
              fill="#a78bfa"
              opacity={0.18}
              stroke="#a78bfa"
              strokeOpacity={0.55}
              strokeWidth={1}
            />
            <text x={W - 36} y={(blockTopY + blockBottomY) / 2 - 1} textAnchor="middle" className="fill-violet-600 dark:fill-violet-400" fontSize="13" fontWeight={700}>
              × N
            </text>
            <text x={W - 36} y={(blockTopY + blockBottomY) / 2 + 12} textAnchor="middle" className="fill-zinc-400" fontSize="9" fontFamily="monospace">
              n_layer
            </text>
          </motion.g>

          {/* Flow lines with arrowheads (pointing UP, in the direction of data flow) */}
          {flowOrder.slice(0, -1).map((fromId, idx) => {
            const toId = flowOrder[idx + 1];
            const from = itemAt.get(fromId)!;
            const to = itemAt.get(toId)!;
            // Draw line in data-flow direction: from source-top to dest-bottom (upward in SVG y).
            // Use markerEnd with auto orient so the arrowhead lands at the dest and points up.
            return (
              <motion.line
                key={`flow-${idx}`}
                x1={cx}
                y1={from.y}
                x2={cx}
                y2={to.y + to.h}
                className="stroke-zinc-400 dark:stroke-zinc-500"
                strokeWidth={1.6}
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.05 * idx }}
              />
            );
          })}

          {/* Residual arcs */}
          <motion.path
            d={arcPath(blockInputBranch, add1Mid)}
            fill="none"
            stroke="#10b981"
            strokeWidth={1.6}
            strokeDasharray="5 3"
            markerEnd="url(#arrowhead-residual)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          />
          <motion.path
            d={arcPath(branchAfterAdd1, add2Mid)}
            fill="none"
            stroke="#10b981"
            strokeWidth={1.6}
            strokeDasharray="5 3"
            markerEnd="url(#arrowhead-residual)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{ duration: 0.7, delay: 1.3 }}
          />
          <circle cx={cx + boxW / 2} cy={blockInputBranch} r={3.5} fill="#10b981" />
          <circle cx={cx + boxW / 2} cy={branchAfterAdd1} r={3.5} fill="#10b981" />

          {/* Boxes + add nodes */}
          {[...top, ...reversedBlockItems, ...bottom].map((item, idx) => {
            const pos = itemAt.get(item.id)!;
            const isAdd = "kind" in item && (item as any).kind === "add";
            if (isAdd) {
              const r = pos.h / 2;
              const formula =
                item.id === "add1"
                  ? ["x", "+ sa(ln1(x))"]
                  : ["x", "+ ffwd(ln2(x))"];
              return (
                <motion.g
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 * idx }}
                >
                  <circle cx={cx} cy={pos.centerY} r={r} fill="white" stroke="#10b981" strokeWidth={2.2} className="dark:fill-zinc-900" />
                  <text x={cx} y={pos.centerY + 5} textAnchor="middle" fill="#10b981" fontSize="16" fontWeight={700}>+</text>
                  <text x={cx - r - 6} y={pos.centerY - 1} textAnchor="end" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontFamily="monospace" fontWeight={600}>
                    {formula[0]}
                  </text>
                  <text x={cx + r + 6} y={pos.centerY - 1} className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontFamily="monospace" fontWeight={600}>
                    {formula[1]}
                  </text>
                </motion.g>
              );
            }
            return (
              <motion.g
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * idx }}
              >
                <rect
                  x={cx - boxW / 2}
                  y={pos.y}
                  width={boxW}
                  height={pos.h}
                  rx={8}
                  fill={item.color}
                  opacity={0.92}
                />
                <text
                  x={cx}
                  y={pos.y + (item.sub ? 14 : pos.h / 2 + 4)}
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="11"
                  fontWeight={600}
                >
                  {item.label}
                </text>
                {item.sub && (
                  <text
                    x={cx}
                    y={pos.y + 27}
                    textAnchor="middle"
                    className="fill-white"
                    fontSize="8.5"
                    opacity={0.85}
                  >
                    {item.sub}
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* Activation shape labels (left side) */}
          {shapeLabels.map(({ id, text, where }) => {
            const pos = itemAt.get(id)!;
            const yPos = where === "above" ? pos.y - 6 : pos.y + pos.h + 12;
            return (
              <text
                key={`shape-${id}`}
                x={cx - boxW / 2 - 18}
                y={yPos}
                textAnchor="end"
                className="fill-zinc-400 dark:fill-zinc-500"
                fontSize="9"
                fontFamily="monospace"
              >
                {text}
              </text>
            );
          })}

          {/* Weight annotations (right side) */}
          {[...top, ...reversedBlockItems, ...bottom].map((item) => {
            if (!("weights" in item) || !item.weights || item.weights.length === 0) return null;
            const pos = itemAt.get(item.id)!;
            const lines = item.weights;
            const startY = pos.centerY - ((lines.length - 1) * 11) / 2 + 3;
            return (
              <motion.g
                key={`w-${item.id}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.4 }}
              >
                {lines.map((line, li) => (
                  <text
                    key={li}
                    x={weightX}
                    y={startY + li * 11}
                    className="fill-zinc-500 dark:fill-zinc-400"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {line}
                  </text>
                ))}
              </motion.g>
            );
          })}

          {/* Top label */}
          <text x={cx} y={yProbLabel + 10} textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="10" fontWeight={600}>
            Next-Character Probabilities
          </text>

          {/* Bottom label */}
          <text x={cx} y={yInputLabel + 14} textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="10" fontWeight={600}>
            Input Characters &nbsp;
            <tspan className="fill-zinc-400" fontFamily="monospace" fontSize="9">(B, T)</tspan>
          </text>

          {/* Column headers */}
          <text x={weightX} y={padTop + 12} className="fill-zinc-400" fontSize="9" fontWeight={700} letterSpacing="0.05em">
            LEARNED WEIGHTS →
          </text>
          <text x={cx - boxW / 2 - 18} y={padTop + 12} textAnchor="end" className="fill-zinc-400" fontSize="9" fontWeight={700} letterSpacing="0.05em">
            ← ACTIVATIONS
          </text>
        </svg>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[11px]">
          <span className="text-zinc-500 dark:text-zinc-400 font-semibold mr-2">LEGEND:</span>
          {[
            { color: "#7c3aed", label: "attention" },
            { color: "#f59e0b", label: "feed-forward" },
            { color: "#a1a1aa", label: "normalization" },
            { color: "#06b6d4", label: "embedding" },
            { color: "#f43f5e", label: "output head" },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <svg width={20} height={6}>
              <line x1={0} y1={3} x2={20} y2={3} stroke="#10b981" strokeWidth={1.6} strokeDasharray="3 2" />
            </svg>
            <span className="text-zinc-500 dark:text-zinc-400">residual</span>
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-3">
          The block (dashed box) repeats <span className="font-mono">n_layer</span> times. Each sublayer is wrapped in a residual: <span className="font-mono">x = x + sublayer(LN(x))</span>.
        </p>
      </div>
    </div>
  );
}
