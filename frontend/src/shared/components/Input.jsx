import "./../../styles/global.css";

export default function Input({
  label,
  type = "text",
  error,
  className = "",
  ...props
}) {
  return (
    <div className="w-full flex flex-col">
      {label && (
        <label
          className={`px-1 text-xs font-main ${error ? "text-red-600" : "text-brand-hover"}`}
        >
          {label}
        </label>
      )}

      <div className="relative h-9 flex items-center">
        <div
          className="absolute inset-0 pointer-events-none"
          onMouseDown={(e) => {
            e.preventDefault();
            e.currentTarget.nextSibling.focus();
          }}
        />
        <input
          type={type}
          className={`
            w-full h-8
            px-3
            text-sm
            text-[#181818]
            rounded-xl
            transition
            bg-brand-soft/60
            border
            ${error ? "border-red-600" : "border-border-strong"}
            focus:outline-none
            focus:ring-1
            focus:ring-brand-hover
            focus:border-brand-hover
            focus:bg-white
            hover:bg-white
            hover:border-brand-hover
            ${className}
          `}
          {...props}
        />
      </div>

      <p className="text-red-700 text-xs mt-0.5 h-3">
        {error || ""}
      </p>
    </div>
  );
}