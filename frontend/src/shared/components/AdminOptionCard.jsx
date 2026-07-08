export default function AdminOptionCard({
  icon,
  title,
  description,
  buttonLabel,
  onClick,
  variant = "primary",
}) {
  const headerColors = {
    primary: "bg-brand-hover",
    secondary: "bg-warning",
  };

  const buttonColors = {
    primary: "bg-brand-hover hover:bg-brand-hoverv2 text-brand-soft",
    secondary: "bg-text-muted hover:bg-text-secondary text-white",
  };

  return (
    <div className="bg-surface rounded-[var(--border-main-container)] shadow-md overflow-hidden w-full max-w-xs">
      <div className={`${headerColors[variant]} flex items-center justify-center py-6`}>
        {icon}
      </div>
      <div className="p-4 flex flex-col items-center text-center gap-2">
        <h3
          className="font-main font-bold text-info-general"
          style={{ color: "var(--color-brand-fort)" }}
        >
          {title}
        </h3>
        <p className="text-info-regular text-text-secondary">{description}</p>
        <button
          type="button"
          onClick={onClick}
          className={`mt-2 px-4 py-1.5 rounded-[var(--border-buttons)] text-info-regular font-semibold transition-colors ${buttonColors[variant]}`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}