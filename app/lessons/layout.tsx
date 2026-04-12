export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <article className="prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:bg-gradient-to-r prose-h1:from-violet-500 prose-h1:to-fuchsia-500 prose-h1:bg-clip-text prose-h1:text-transparent prose-h2:text-2xl prose-h2:border-b prose-h2:border-zinc-200 prose-h2:dark:border-zinc-800 prose-h2:pb-2 prose-h2:mt-16 prose-h3:text-xl prose-a:text-violet-600 prose-a:dark:text-violet-400 prose-a:no-underline prose-a:hover:underline prose-pre:bg-[#1e1e2e] prose-pre:text-sm">
        {children}
      </article>
    </div>
  );
}
