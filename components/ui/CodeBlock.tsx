"use client";

import { useState } from "react";

export function CodeBlock({
  children,
  language = "python",
  title,
}: {
  children: string;
  language?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose group relative my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {title && (
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {language}
          </span>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto bg-[#1e1e2e] p-4 text-sm leading-relaxed">
          <code className="text-zinc-200 font-mono">{children}</code>
        </pre>
        <button
          onClick={copy}
          className="absolute top-3 right-3 rounded-lg bg-zinc-700/50 px-2 py-1 text-xs text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-600/50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
