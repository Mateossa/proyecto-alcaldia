import { useNavigate } from "react-router-dom";
import CoordinadorOptionCard from "../../coordinador/components/CoordinadorOptionCard";

export default function TecnicoTalentoHumanoPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-1 p-1 pt-8">
      <h2
        className="w-full text-center font-black text-xl py-0.5 mb-6"
        style={{ color: "var(--color-brand-fort)" }}
      >
        Panel Técnico Talento Humano
      </h2>

      <div className="flex flex-col sm:flex-row gap-8 items-stretch justify-center w-full max-w-5xl">
        {/* Card Reportes de Horas Extras */}
        <CoordinadorOptionCard
          variant="tertiary"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-8 0h10M7 21h10a2 2 0 002-2V7.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0014.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          }
          title="Reportes de Horas Extras"
          description="Consultar las horas extras registradas"
          buttonLabel="Ver Horas Extras"
          onClick={() => navigate("/coordinador/reportes?tipo=Horas Extras")}
        />

        {/* Card Reportes e Informes */}
        <CoordinadorOptionCard
          variant="secondary"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              style={{ color: "var(--color-warning)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          title="Reportes e Informes"
          description="Consultar permisos y solicitudes"
          buttonLabel="Ver Reportes"
          onClick={() => navigate("/coordinador/reportes?tipo=Ausentismo")}
        />
      </div>
    </div>
  );
}
