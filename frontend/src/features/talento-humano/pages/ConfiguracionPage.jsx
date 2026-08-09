import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";
import AdminOptionCard from "../../../shared/components/AdminOptionCard";

export default function ConfiguracionPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-1 p-1 pt-8">
      <h2
        className="w-full text-center font-black text-xl py-0.5 mb-6"
        style={{ color: "var(--color-brand-fort)" }}
      >
        Configuración
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center w-full max-w-6xl mb-8">

        {/* Crear Usuario */}
        <AdminOptionCard
          variant="tertiary"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              style={{ color: "var(--color-warning)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="9" cy="8" r="3.5" strokeWidth={1.5} />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3.5 19c0-3.5 2.5-6 5.5-6s5.5 2.5 5.5 6"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 8v5m-2.5-2.5h5"
              />
            </svg>
          }
          title="Crear Usuario Docente"
          description="Registrar nuevo docente en el sistema"
          buttonLabel="Crear Usuario"
          onClick={() =>
            navigate("/talento-humano/configuracion/crear-usuario")
          }
        />

        {/* Ajustar Topes por IE */}
        <AdminOptionCard
          variant="primary"
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
                d="M12 3v18M5 8l-3 5a3.5 3.5 0 007 0l-3-5zm14 0l-3 5a3.5 3.5 0 007 0l-3-5zM5 8h14M9 21h6"
              />
            </svg>
          }
          title="Ajustar Topes"
          description="Configurar topes por Institución Educativa"
          buttonLabel="Ajustar Topes"
          onClick={() =>
            navigate("/talento-humano/configuracion/ajustar-topes")
          }
        />

        {/* Nueva Card */}
        <AdminOptionCard
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
                strokeWidth={1.7}
                d="M7 10V7a5 5 0 0110 0v3"
              />
              <rect
                x="5"
                y="10"
                width="14"
                height="9"
                rx="2"
                strokeWidth={1.7}
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
                d="M9 14h6M9 17h6"
              />
            </svg>
          }
          title="Ajustar Topes Docentes"
          description="Extender horas extras diurnas y nocturnas para todos los docentes."
          buttonLabel="Ajustar Topes"
          onClick={() =>
            navigate(
              "/talento-humano/configuracion/ajustar-topes-docentes"
            )
          }
        />

      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => navigate("/talento-humano")}
      >
        <span className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Regresar
        </span>
      </Button>
    </div>
  );
}