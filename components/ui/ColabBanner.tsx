"use client";

export function ColabBanner({
  href,
  title = "Open in Google Colab",
  description = "Run all the code from this lesson in your browser",
}: {
  href: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className="not-prose my-8 flex items-center gap-4 rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5">
      <div className="flex-shrink-0 text-3xl">&#x1F4D3;</div>
      <div className="flex-1">
        <p className="font-semibold text-amber-900 dark:text-amber-200">
          {title}
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
          {description}
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
      >
        Open Colab
      </a>
    </div>
  );
}
