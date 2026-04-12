"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function AnimatedSlider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  onChange,
  autoPlay = true,
  speed = 50,
  label,
  formatValue,
}: {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  autoPlay?: boolean;
  speed?: number;
  label?: string;
  formatValue?: (value: number) => string;
}) {
  const [internalValue, setInternalValue] = useState(min);
  const [playing, setPlaying] = useState(autoPlay);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const value = controlledValue ?? internalValue;

  const setValue = useCallback(
    (v: number) => {
      if (onChange) onChange(v);
      else setInternalValue(v);
    },
    [onChange]
  );

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setValue(value >= max ? min : Math.min(value + step, max));
      }, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, value, min, max, step, speed, setValue]);

  return (
    <div className="not-prose flex items-center gap-3 my-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50">
      <button
        onClick={() => setPlaying(!playing)}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center text-xs font-bold hover:bg-violet-600 transition-colors"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? "||" : "\u25B6"}
      </button>
      {label && (
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex-shrink-0">
          {label}
        </span>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          setPlaying(false);
          setValue(Number(e.target.value));
        }}
        className="flex-1 h-2 accent-violet-500 cursor-pointer"
      />
      <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 flex-shrink-0 w-12 text-right">
        {formatValue ? formatValue(value) : value}
      </span>
    </div>
  );
}
