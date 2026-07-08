import ConsultasyReportes from "../components/ConsultasyReportes";

export default function DocentePage() {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2
        className="w-full text-center font-black text-2xl py-1 mb-1"
        style={{ color: "var(--color-brand-fort)" }}
      >
        Consultas y Reportes
      </h2>
      <div className="relative bg-beige rounded-xl shadow-2xl p-4 w-[1200px] max-w-[95vw]">
        <ConsultasyReportes />
      </div>
    </div>
  );
}