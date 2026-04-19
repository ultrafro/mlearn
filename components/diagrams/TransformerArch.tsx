"use client";

import { motion } from "framer-motion";

export function TransformerArch() {
  // Layout constants
  const W = 460;
  const H = 760;
  const cx = 200;          // central column for stem boxes
  const boxW = 170;
  const boxH = 36;
  const residualX = cx + boxW / 2 + 60; // x-coordinate for residual loop arc

  // Stem boxes (y = top of box). Top to bottom, but data flows bottom -> top.
  // We build coordinates top-down because SVG y grows downward.
  type Box = {
    id: string;
    label: string;
    sub?: string;
    color: string;
    text?: string; // text color override
  };

  const top: Box[] = [
    { id: "softmax", label: "Softmax", sub: "→ probabilities", color: "#f43f5e" },
    { id: "linear", label: "Linear", sub: "n_embd → vocab_size", color: "#f43f5e" },
    { id: "lnf",    label: "LayerNorm", sub: "ln_f", color: "#a1a1aa" },
  ];

  const bottom: Box[] = [
    { id: "embed",  label: "Token Emb  +  Position Emb", sub: "embedding(x) + embedding(pos)", color: "#06b6d4" },
  ];

  // Block-internal items (y top of box). Listed bottom-to-top so first item is read first.
  const blockItems: (Box & { kind: "node" | "add" })[] = [
    // Bottom of block first
    { id: "ln1",  kind: "node", label: "LayerNorm",          sub: "ln1",                   color: "#a1a1aa" },
    { id: "mha",  kind: "node", label: "Multi-Head Attention", sub: "n_head heads × head_size", color: "#7c3aed" },
    { id: "add1", kind: "add",  label: "+",                  sub: "residual",              color: "#10b981" },
    { id: "ln2",  kind: "node", label: "LayerNorm",          sub: "ln2",                   color: "#a1a1aa" },
    { id: "ffn",  kind: "node", label: "Feed Forward",       sub: "Linear → ReLU → Linear", color: "#f59e0b" },
    { id: "add2", kind: "add",  label: "+",                  sub: "residual",              color: "#10b981" },
  ];

  // Y positions
  const padTop = 30;
  const labelGap = 24;
  const blockGap = 20;
  const innerGap = 18;     // between block items
  const blockPad = 26;     // padding inside the dashed block container

  let y = padTop;
  const yProbLabel = y;
  y += labelGap;

  const topYs: number[] = [];
  for (const _ of top) {
    topYs.push(y);
    y += boxH + blockGap;
  }

  // Block container starts here
  const blockTopY = y;
  y += blockPad;

  // Block-internal positions, top-to-bottom in SVG (so add2 is at the top of the block)
  const blockYs: number[] = [];
  const reversedBlockItems = [...blockItems].reverse();
  const addH = 28;
  for (const item of reversedBlockItems) {
    blockYs.push(y);
    y += (item.kind === "add" ? addH : boxH) + innerGap;
  }
  y -= innerGap; // remove last gap
  y += blockPad;
  const blockBottomY = y;
  y += blockGap;

  // Bottom items
  const bottomYs: number[] = [];
  for (const _ of bottom) {
    bottomYs.push(y);
    y += boxH + blockGap;
  }
  const yInputLabel = y - blockGap + 6;

  // Map item id -> (yTop, height)
  const itemAt = new Map<string, { y: number; h: number; centerY: number }>();
  top.forEach((b, i) => itemAt.set(b.id, { y: topYs[i], h: boxH, centerY: topYs[i] + boxH / 2 }));
  reversedBlockItems.forEach((b, i) => {
    const h = b.kind === "add" ? addH : boxH;
    itemAt.set(b.id, { y: blockYs[i], h, centerY: blockYs[i] + h / 2 });
  });
  bottom.forEach((b, i) => itemAt.set(b.id, { y: bottomYs[i], h: boxH, centerY: bottomYs[i] + boxH / 2 }));

  // Stem flow connections (consecutive boxes from bottom to top)
  // Order: embed -> ln1 -> mha -> add1 -> ln2 -> ffn -> add2 -> lnf -> linear -> softmax
  const flowOrder = ["embed", "ln1", "mha", "add1", "ln2", "ffn", "add2", "lnf", "linear", "softmax"];

  // Shape labels alongside the stem
  const shapeLabels: { id: string; text: string; where: "below" | "above" }[] = [
    { id: "embed",   text: "(B, T, n_embd)", where: "above" },
    { id: "lnf",     text: "(B, T, n_embd)", where: "above" },
    { id: "linear",  text: "(B, T, vocab)",  where: "above" },
  ];

  // Helper for residual arc path: from input-of-block point, around the right, into the add node
  const arcPath = (fromY: number, toY: number) => {
    const startX = cx + boxW / 2;
    const endX = cx + boxW / 2;
    const peakX = residualX;
    return `M ${startX} ${fromY}
            C ${peakX} ${fromY}, ${peakX} ${toY}, ${endX + 6} ${toY}`;
  };

  // Where do residuals branch from?
  // Residual 1: branches from above embed (block input) ─ joins add1
  // Residual 2: branches from above add1 ─ joins add2
  const blockInputY = (itemAt.get("embed")!.y) - blockGap / 2; // just above embed top? we want just at block bottom
  const blockInputBranch = blockBottomY - 4; // a hair inside the block bottom
  const add1Mid = itemAt.get("add1")!.centerY;
  const add2Mid = itemAt.get("add2")!.centerY;
  const branchAfterAdd1 = (itemAt.get("add1")!.y) - innerGap / 2 - 2;

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          Transformer Block Architecture
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Pre-norm GPT-style block. Data flows bottom → top. Dashed lines are residual (skip) connections.
        </p>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[460px] mx-auto">
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-zinc-500 dark:fill-zinc-400" />
            </marker>
            <marker
              id="arrowhead-residual"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
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
          {/* xN badge — to the far right, beyond the residual arc */}
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <rect
              x={W - 78}
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
            <text
              x={W - 50}
              y={(blockTopY + blockBottomY) / 2 - 1}
              textAnchor="middle"
              className="fill-violet-600 dark:fill-violet-400"
              fontSize="13"
              fontWeight={700}
            >
              × N
            </text>
            <text
              x={W - 50}
              y={(blockTopY + blockBottomY) / 2 + 12}
              textAnchor="middle"
              className="fill-zinc-400"
              fontSize="9"
              fontFamily="monospace"
            >
              n_layer
            </text>
          </motion.g>

          {/* Flow lines: from each item to the next, with arrowheads */}
          {flowOrder.slice(0, -1).map((fromId, idx) => {
            const toId = flowOrder[idx + 1];
            const from = itemAt.get(fromId)!;
            const to = itemAt.get(toId)!;
            const x1 = cx;
            const y1 = from.y; // top of source box
            const x2 = cx;
            const y2 = to.y + to.h; // bottom of dest box
            return (
              <motion.line
                key={`flow-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="stroke-zinc-400 dark:stroke-zinc-500"
                strokeWidth={1.6}
                markerStart="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.05 * idx }}
              />
            );
          })}

          {/* Residual 1: from block input -> add1 */}
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
          {/* Residual 2: from after add1 -> add2 */}
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
          {/* Branch dots */}
          <circle cx={cx + boxW / 2} cy={blockInputBranch} r={3.5} fill="#10b981" />
          <circle cx={cx + boxW / 2} cy={branchAfterAdd1} r={3.5} fill="#10b981" />

          {/* Render boxes */}
          {[...top, ...reversedBlockItems, ...bottom].map((item, idx) => {
            const pos = itemAt.get(item.id)!;
            const isAdd = "kind" in item && (item as any).kind === "add";
            if (isAdd) {
              const r = pos.h / 2;
              return (
                <motion.g
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 * idx }}
                >
                  <circle
                    cx={cx}
                    cy={pos.centerY}
                    r={r}
                    fill="white"
                    stroke="#10b981"
                    strokeWidth={2.2}
                    className="dark:fill-zinc-900"
                  />
                  <text
                    x={cx}
                    y={pos.centerY + 5}
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="16"
                    fontWeight={700}
                  >
                    +
                  </text>
                  <text
                    x={cx + r + 6}
                    y={pos.centerY + 4}
                    className="fill-emerald-600 dark:fill-emerald-400"
                    fontSize="9"
                    fontStyle="italic"
                  >
                    residual
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

          {/* Shape labels */}
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

          {/* Top label: Probabilities */}
          <text
            x={cx}
            y={yProbLabel + 10}
            textAnchor="middle"
            className="fill-zinc-500 dark:fill-zinc-400"
            fontSize="10"
            fontWeight={600}
          >
            Next-Character Probabilities
          </text>

          {/* Bottom label: Input */}
          <text
            x={cx}
            y={yInputLabel + 14}
            textAnchor="middle"
            className="fill-zinc-500 dark:fill-zinc-400"
            fontSize="10"
            fontWeight={600}
          >
            Input Characters &nbsp;
            <tspan className="fill-zinc-400" fontFamily="monospace" fontSize="9">(B, T)</tspan>
          </text>

          {/* Legend (right side) */}
          <g transform={`translate(${W - 130}, ${blockTopY - 6})`}>
            <text x={0} y={0} className="fill-zinc-500" fontSize="9" fontWeight={700}>LEGEND</text>
            <g transform="translate(0, 12)">
              <rect width={10} height={10} rx={2} fill="#7c3aed" />
              <text x={14} y={9} fontSize="9" className="fill-zinc-500">attention</text>
            </g>
            <g transform="translate(0, 26)">
              <rect width={10} height={10} rx={2} fill="#f59e0b" />
              <text x={14} y={9} fontSize="9" className="fill-zinc-500">feed-forward</text>
            </g>
            <g transform="translate(0, 40)">
              <rect width={10} height={10} rx={2} fill="#a1a1aa" />
              <text x={14} y={9} fontSize="9" className="fill-zinc-500">normalization</text>
            </g>
            <g transform="translate(0, 54)">
              <line x1={0} y1={5} x2={10} y2={5} stroke="#10b981" strokeWidth={1.6} strokeDasharray="3 2" />
              <text x={14} y={9} fontSize="9" className="fill-zinc-500">residual</text>
            </g>
          </g>
        </svg>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-3">
          The block (dashed box) repeats <span className="font-mono">n_layer</span> times. Each sublayer is wrapped in a residual: <span className="font-mono">x = x + sublayer(LN(x))</span>.
        </p>
      </div>
    </div>
  );
}
