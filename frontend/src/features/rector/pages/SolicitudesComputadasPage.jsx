import SolicitudesComputadas from "../components/SolicitudesComputadas";

export default function SolicitudesComputadasPage() {
  return (
    <div className="flex flex-col items-center gap-1 p-1">
      <h2
        className="w-full text-center font-black text-xl py-1 mb-1"
        style={{ color: "var(--color-brand-fort)" }}
      >
        Panel del Rector
      </h2>
      <div className="relative bg-beige rounded-xl shadow-2xl p-2 w-[1200px] max-w-[95vw]">
        <SolicitudesComputadas />
      </div>
    </div>
  );
}