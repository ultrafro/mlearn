import Link from "next/link";

const lessons = [
  {
    slug: "transformer",
    number: 1,
    title: "Build a Transformer",
    subtitle: "Generate human-like names from scratch",
    description:
      "Start with counting character pairs and work your way up through neural bigrams, MLPs, and a full transformer — generating names at every step so you can watch your models get smarter.",
    gradient: "from-violet-500 to-indigo-600",
    bgGlow: "bg-violet-500/10",
    tags: ["PyTorch", "Bigrams", "MLP", "Self-Attention", "Transformer"],
  },
  {
    slug: "diffusion",
    number: 2,
    title: "Build a Diffusion Model",
    subtitle: "Generate 2D spiral patterns with DDPM",
    description:
      "Learn how diffusion models work by destroying a spiral with noise and teaching a network to reverse the process. Watch random dots organize into beautiful spirals.",
    gradient: "from-fuchsia-500 to-rose-600",
    bgGlow: "bg-fuchsia-500/10",
    tags: ["PyTorch", "DDPM", "Noise Schedules", "Denoising", "Sampling"],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="w-full px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            Learn ML
          </span>{" "}
          by Building
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Interactive lessons that teach you PyTorch and machine learning
          architectures from the ground up. Designed for experienced developers
          who learn by doing.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Python", "PyTorch", "Transformers", "Diffusion Models"].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </section>

      {/* Lesson Cards */}
      <section className="w-full max-w-4xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          {lessons.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/lessons/${lesson.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${lesson.bgGlow}`}
              />
              <div className="relative">
                <div
                  className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${lesson.gradient} px-3 py-1 text-xs font-semibold text-white mb-4`}
                >
                  Lesson {lesson.number}
                </div>
                <h2 className="text-2xl font-bold">{lesson.title}</h2>
                <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {lesson.subtitle}
                </p>
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {lesson.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {lesson.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 text-sm font-semibold text-violet-600 dark:text-violet-400 group-hover:underline">
                  Start lesson &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
