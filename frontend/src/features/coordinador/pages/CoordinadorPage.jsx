import { useNavigate } from "react-router-dom";
import CoordinadorOptionCard from "../components/CoordinadorOptionCard";

export default function CoordinadorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-1 p-1 pt-8">
      <h2
        className="w-full text-center font-black text-xl py-0.5 mb-6"
        style={{ color: "var(--color-brand-fort)" }}
      >
        Panel de Administración
      </h2>

      <div className="flex flex-col sm:flex-row gap-8 items-stretch justify-center w-full max-w-3xl">
        <CoordinadorOptionCard
          variant="primary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Registrar Horas Extras"
          description="Reportar horas extras de un docente"
          buttonLabel="Registrar Horas"
          onClick={() => navigate("/coordinador/registrar-horas-extras")}
        />

        <CoordinadorOptionCard
          variant="secondary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" style={{ color: "var(--color-warning)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title="Reportes e Infórmes"
          description="Consultar permisos y solicitudes registradas"
          buttonLabel="Ver Reportes"
          onClick={() => navigate("/coordinador/reportes")}
        />
      </div>
    </div>
  );
}