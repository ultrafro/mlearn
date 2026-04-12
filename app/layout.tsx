import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mlearn — Learn ML by Building",
  description:
    "Interactive lessons teaching PyTorch and ML architectures to experienced developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
            <a href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                mlearn
              </span>
            </a>
            <div className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <a
                href="/lessons/transformer"
                className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                Transformers
              </a>
              <a
                href="/lessons/diffusion"
                className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors"
              >
                Diffusion
              </a>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-sm text-zinc-500">
          Built with Next.js. Learn ML by building.
        </footer>
      </body>
    </html>
  );
}
