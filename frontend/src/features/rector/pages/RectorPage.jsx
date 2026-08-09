import { useNavigate } from "react-router-dom";
import CoordinadorOptionCard from "../../coordinador/components/CoordinadorOptionCard";

export default function RectorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-1 p-1 pt-8">
      <h2
        className="w-full text-center font-black text-xl py-0.5 mb-6"
        style={{ color: "var(--color-brand-fort)" }}
      >
        Panel del Rector
      </h2>

      <div className="flex flex-col sm:flex-row gap-8 items-stretch justify-center w-full max-w-3xl">
        <CoordinadorOptionCard
          variant="primary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
          title="Consultas y Reportes"
          description="Consultar los ausentismos registrados por los docentes"
          buttonLabel="Ver Ausentismos"
          onClick={() => navigate("/rector/reportes?tipo=Ausentismo")}
        />

        <CoordinadorOptionCard
          variant="tertiary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Horas Extras"
          description="Consultar las horas extras registradas por los docentes"
          buttonLabel="Ver Horas Extras"
          onClick={() => navigate("/rector/reportes?tipo=Horas Extras")}
        />
      </div>
    </div>
  );
}