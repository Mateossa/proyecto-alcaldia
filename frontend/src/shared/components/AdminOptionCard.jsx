export default function AdminOptionCard({
  icon,
  title,
  description,
  buttonLabel,
  onClick,
  variant = "primary",
}) {
  const headerColors = {
    primary: "bg-info",
    secondary: "bg-text-muted",
    tertiary: "bg-primary",
  };

  const buttonColors = {
    primary: "bg-info hover:opacity-90 text-white",
    secondary: "bg-text-muted hover:bg-text-secondary text-white",
    tertiary: "bg-primary hover:opacity-90 text-white",
  };

  const titleColors = {
    primary: "var(--color-info)",
    secondary: "var(--color-text-muted)",
    tertiary: "var(--color-primary)",
  };

  return (
    <div className="bg-surface rounded-[var(--border-main-container)] shadow-md overflow-hidden w-full max-w-sm">
      <div className={`${headerColors[variant]} flex items-center justify-center py-10`}>
        {icon}
      </div>
      <div className="p-6 flex flex-col items-center text-center gap-3">
        <h3
          className="font-main font-bold text-xl pb-3 border-b border-brand-softv2 w-full"
          style={{ color: titleColors[variant] }}
        >
          {title}
        </h3>
        <p className="text-info-general text-text-secondary">{description}</p>
        <button
          type="button"
          onClick={onClick}
          className={`mt-3 px-6 py-2.5 rounded-[var(--border-buttons)] text-info-general font-semibold transition-colors ${buttonColors[variant]}`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}