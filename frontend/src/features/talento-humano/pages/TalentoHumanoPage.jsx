import { useNavigate } from "react-router-dom";
import AdminOptionCard from "../../../shared/components/AdminOptionCard";

export default function TalentoHumanoPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-1 p-1 pt-8">
      <h2
        className="w-full text-center font-black text-xl py-0.5 mb-6"
        style={{ color: "var(--color-brand-fort)" }}
      >
        Panel de Talento Humano
      </h2>

      <div className="flex flex-col sm:flex-row gap-8 items-stretch justify-center w-full max-w-5xl">
        {/* Card Configuración */}
        <AdminOptionCard
          variant="tertiary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <circle cx="12" cy="12" r="3" strokeWidth={1.5} />
            </svg>
          }
          title="Configuración"
          description="Registrar nuevo docente y ajustar topes"
          buttonLabel="Configurar"
          onClick={() => navigate("/talento-humano/configuracion")}
        />

        {/* Card Reportes y Solicitudes → Tabla Horas Extras */}
        <AdminOptionCard
          variant="primary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Reportes y Solicitudes"
          description="Consultar las horas extras registradas"
          buttonLabel="Ver Horas Extras"
          onClick={() => navigate("/coordinador/reportes?tipo=Horas Extras")}
        />

        {/* Card Reportes e Informes → Tabla Ausentismos */}
        <AdminOptionCard
          variant="secondary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" style={{ color: "var(--color-warning)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title="Reportes e Informes"
          description="Consultar permisos y solicitudes registradas"
          buttonLabel="Ver Reportes"
          onClick={() => navigate("/coordinador/reportes?tipo=Ausentismo")}
        />
      </div>
    </div>
  );
}
