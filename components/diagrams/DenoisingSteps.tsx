"use client";

import { useMemo, useState, useCallback } from "react";
import { AnimatedSlider } from "@/components/ui/AnimatedSlider";

function generateSpiral(n: number, seed: number): [number, number][] {
  const points: [number, number][] = [];
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646 - 0.5;
  };
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 4 * Math.PI;
    const r = t / (4 * Math.PI);
    points.push([r * Math.cos(t) + rand() * 0.05, r * Math.sin(t) + rand() * 0.05]);
  }
  return points;
}

function generateNoise(n: number, seed: number): [number, number][] {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646 - 0.5;
  };
  return Array.from({ length: n }, () => [rand() * 2, rand() * 2] as [number, number]);
}

export function DenoisingSteps() {
  const [step, setStep] = useState(50);
  const maxSteps = 50;
  const nPoints = 200;

  const spiralPoints = useMemo(() => generateSpiral(nPoints, 789), []);
  const noisePoints = useMemo(() => generateNoise(nPoints, 101), []);

  // Interpolate from noise to spiral as step goes from maxSteps to 0
  const currentPoints = useMemo(() => {
    const ratio = step / maxSteps; // 1 = all noise, 0 = all spiral
    return spiralPoints.map(([sx, sy], i) => {
      const [nx, ny] = noisePoints[i];
      return [
        sx * (1 - ratio) + nx * ratio,
        sy * (1 - ratio) + ny * ratio,
      ] as [number, number];
    });
  }, [spiralPoints, noisePoints, step]);

  const size = 300;
  const scale = (v: number) => (v + 1.3) * (size / 2.6);

  const handleChange = useCallback((v: number) => setStep(v), []);

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          Reverse Diffusion (Sampling)
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Watch noise organize into a spiral as the model denoises step by step
        </p>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[300px] mx-auto">
          <rect width={size} height={size} rx={8} fill="#fafafa" className="dark:fill-zinc-950" />
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
          {currentPoints.map(([x, y], i) => (
            <circle
              key={i}
              cx={scale(x)}
              cy={scale(y)}
              r={2.5}
              fill={`hsl(${320 - (step / maxSteps) * 40}, ${60 + ((maxSteps - step) / maxSteps) * 20}%, ${60 - ((maxSteps - step) / maxSteps) * 10}%)`}
              opacity={0.7}
            />
          ))}
          <text
            x={size - 10}
            y={20}
            textAnchor="end"
            className="fill-zinc-400 text-[10px] font-mono"
          >
            t={step}/{maxSteps}
          </text>
        </svg>
        <AnimatedSlider
          min={0}
          max={maxSteps}
          step={1}
          value={step}
          onChange={handleChange}
          autoPlay={true}
          speed={120}
          label="Denoise"
          formatValue={(v) => `${maxSteps - v}/${maxSteps}`}
        />
      </div>
    </div>
  );
}
