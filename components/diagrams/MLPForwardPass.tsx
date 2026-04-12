"use client";

import { motion } from "framer-motion";

export function MLPForwardPass() {
  const layers = [
    { name: "Input\n(one-hot)", nodes: 5, color: "#06b6d4" },
    { name: "Embed\n(dim=2)", nodes: 2, color: "#10b981" },
    { name: "Hidden\n(64 units)", nodes: 5, color: "#f59e0b" },
    { name: "Output\n(27 chars)", nodes: 5, color: "#7c3aed" },
  ];

  const layerX = [80, 200, 320, 440];
  const width = 520;
  const height = 280;

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          MLP Forward Pass
        </h3>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[520px] mx-auto">
          {/* Connections */}
          {layers.slice(0, -1).map((layer, li) => {
            const nextLayer = layers[li + 1];
            const x1 = layerX[li];
            const x2 = layerX[li + 1];
            return Array.from({ length: layer.nodes }).flatMap((_, ni) =>
              Array.from({ length: nextLayer.nodes }).map((_, nj) => {
                const y1 =
                  60 +
                  (ni / (layer.nodes - 1)) * 160;
                const y2 =
                  60 +
                  (nj / (nextLayer.nodes - 1)) * 160;
                return (
                  <motion.line
                    key={`${li}-${ni}-${nj}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#a1a1aa"
                    strokeWidth={1.2}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{
                      duration: 0.5,
                      delay: li * 0.3 + 0.1,
                    }}
                  />
                );
              })
            );
          })}
          {/* Nodes */}
          {layers.map((layer, li) =>
            Array.from({ length: layer.nodes }).map((_, ni) => {
              const x = layerX[li];
              const y =
                60 +
                (ni / (layer.nodes - 1)) * 160;
              return (
                <motion.circle
                  key={`node-${li}-${ni}`}
                  cx={x}
                  cy={y}
                  r={10}
                  fill={layer.color}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{
                    duration: 0.3,
                    delay: li * 0.3,
                    type: "spring",
                  }}
                />
              );
            })
          )}
          {/* Labels */}
          {layers.map((layer, li) => (
            <text
              key={`label-${li}`}
              x={layerX[li]}
              y={260}
              textAnchor="middle"
              className="fill-zinc-500 text-[9px] font-medium"
            >
              {layer.name.split("\n").map((line, i) => (
                <tspan key={i} x={layerX[li]} dy={i === 0 ? 0 : 12}>
                  {line}
                </tspan>
              ))}
            </text>
          ))}
          {/* Flow arrow */}
          <motion.text
            x={260}
            y={30}
            textAnchor="middle"
            className="fill-zinc-400 text-[10px] font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Forward Pass →
          </motion.text>
        </svg>
      </div>
    </div>
  );
}
