export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "tip" | "warning";
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: {
      border: "border-blue-200 dark:border-blue-800",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      title: "text-blue-900 dark:text-blue-200",
      text: "text-blue-800 dark:text-blue-300",
      icon: "\u{1F4A1}",
    },
    tip: {
      border: "border-emerald-200 dark:border-emerald-800",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      title: "text-emerald-900 dark:text-emerald-200",
      text: "text-emerald-800 dark:text-emerald-300",
      icon: "\u2728",
    },
    warning: {
      border: "border-amber-200 dark:border-amber-800",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      title: "text-amber-900 dark:text-amber-200",
      text: "text-amber-800 dark:text-amber-300",
      icon: "\u26A0\uFE0F",
    },
  };

  const s = styles[type];

  return (
    <div
      className={`not-prose my-6 rounded-xl border-2 ${s.border} ${s.bg} p-5`}
    >
      {title && (
        <p className={`font-semibold ${s.title} mb-1`}>
          {s.icon} {title}
        </p>
      )}
      <div className={`text-sm leading-relaxed ${s.text}`}>{children}</div>
    </div>
  );
}
