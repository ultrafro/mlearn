"use client";

import { motion } from "framer-motion";

const blocks = [
  { label: "Token\nEmbedding", color: "#06b6d4", y: 380 },
  { label: "Positional\nEncoding", color: "#0891b2", y: 340 },
  { label: "Multi-Head\nAttention", color: "#7c3aed", y: 260 },
  { label: "Add & Norm", color: "#a78bfa", y: 220 },
  { label: "Feed\nForward", color: "#f59e0b", y: 160 },
  { label: "Add & Norm", color: "#a78bfa", y: 120 },
  { label: "Linear +\nSoftmax", color: "#f43f5e", y: 50 },
];

export function TransformerArch() {
  const width = 300;
  const height = 440;
  const boxW = 140;
  const boxH = 36;
  const cx = width / 2;

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          Transformer Block Architecture
        </h3>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[300px] mx-auto">
          {/* Connecting lines */}
          {blocks.slice(0, -1).map((block, i) => (
            <motion.line
              key={`line-${i}`}
              x1={cx}
              y1={block.y}
              x2={cx}
              y2={blocks[i + 1].y + boxH}
              stroke="#d4d4d8"
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: i * 0.15 }}
            />
          ))}
          {/* Residual connection arrows */}
          <motion.path
            d={`M ${cx + boxW / 2 + 5} ${blocks[2].y + boxH / 2}
                Q ${cx + boxW / 2 + 30} ${blocks[2].y + boxH / 2}
                  ${cx + boxW / 2 + 30} ${blocks[3].y + boxH / 2}
                Q ${cx + boxW / 2 + 30} ${blocks[3].y + boxH / 2}
                  ${cx + boxW / 2 + 5} ${blocks[3].y + boxH / 2}`}
            fill="none"
            stroke="#a78bfa"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
          <motion.path
            d={`M ${cx + boxW / 2 + 5} ${blocks[4].y + boxH / 2}
                Q ${cx + boxW / 2 + 30} ${blocks[4].y + boxH / 2}
                  ${cx + boxW / 2 + 30} ${blocks[5].y + boxH / 2}
                Q ${cx + boxW / 2 + 30} ${blocks[5].y + boxH / 2}
                  ${cx + boxW / 2 + 5} ${blocks[5].y + boxH / 2}`}
            fill="none"
            stroke="#a78bfa"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          />
          {/* Blocks */}
          {blocks.map((block, i) => (
            <motion.g
              key={`block-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.15 }}
            >
              <rect
                x={cx - boxW / 2}
                y={block.y}
                width={boxW}
                height={boxH}
                rx={8}
                fill={block.color}
                opacity={0.9}
              />
              {block.label.split("\n").map((line, li) => (
                <text
                  key={`text-${i}-${li}`}
                  x={cx}
                  y={
                    block.y +
                    boxH / 2 +
                    (li - (block.label.split("\n").length - 1) / 2) * 12 +
                    4
                  }
                  textAnchor="middle"
                  className="fill-white text-[9px] font-semibold"
                  style={{ pointerEvents: "none" }}
                >
                  {line}
                </text>
              ))}
            </motion.g>
          ))}
          {/* Input/Output labels */}
          <text
            x={cx}
            y={height - 5}
            textAnchor="middle"
            className="fill-zinc-400 text-[9px] font-medium"
          >
            Input Characters
          </text>
          <text
            x={cx}
            y={40}
            textAnchor="middle"
            className="fill-zinc-400 text-[9px] font-medium"
          >
            Next Character Probabilities
          </text>
          {/* Nx label */}
          <rect
            x={cx - boxW / 2 - 35}
            y={blocks[2].y - 5}
            width={24}
            height={blocks[5].y + boxH - blocks[2].y + 10}
            rx={4}
            fill="none"
            stroke="#d4d4d8"
            strokeWidth={1}
            strokeDasharray="4 2"
          />
          <text
            x={cx - boxW / 2 - 23}
            y={(blocks[2].y + blocks[5].y + boxH) / 2 + 4}
            textAnchor="middle"
            className="fill-zinc-400 text-[8px] font-bold"
          >
            xN
          </text>
        </svg>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-3">
          Dashed lines show residual connections. The attention + FFN block repeats N times.
        </p>
      </div>
    </div>
  );
}
