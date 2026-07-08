export default function Select({
  label,
  name,
  options = [],
  value,
  error,
  onChange,
  disabled,
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

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full h-8 px-3 pr-8
            rounded-xl
            border
            text-sm
            text-[#181818]
            transition
            appearance-none
            bg-brand-soft/60
            ${error ? "border-red-600" : "border-border-strong"}
            focus:outline-none
            focus:ring-1
            focus:ring-brand-hover
            focus:border-brand-hover
            focus:bg-white
            hover:bg-white
            hover:border-brand-hover
          `}
        >
          <option disabled value="">Seleccione una opción</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-3 h-3" fill="none" stroke="#186319" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <p className="text-red-700 text-xs mt-0.5 h-3">{error || ""}</p>
    </div>
  );
}