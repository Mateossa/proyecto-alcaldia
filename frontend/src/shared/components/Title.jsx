export default function Title({ title, size = "text-2xl" }) {
  return (
    <div className="grid grid-cols-1">
      <h1
        className={`w-full text-center font-black py-1 mb-2 border-b ${size}`}
        style={{ color: "var(--color-brand-fort)" }}
      >
        {title}
      </h1>
    </div>
  );
}