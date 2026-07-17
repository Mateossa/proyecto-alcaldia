import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";
import RectorTable from "../tables/RectorTable";

const ESTADOS = ["Pendiente", "Aprobado", "Rechazado"];
const ITEMS_POR_PAGINA = 5;

// 🔧 Datos de ejemplo mientras no hay backend.
const MOCK_SOLICITUDES = [
  { id: 1, fechaRegistro: "2026-05-30", documento: "1128548648", motivo: "Cita Médica", fechaInicio: "2026-06-02", fechaFin: "2026-06-02", estado: "Pendiente" },
  { id: 2, fechaRegistro: "2026-05-25", documento: "1124855688", motivo: "Jornada adicional", fechaInicio: "2026-05-28", fechaFin: "2026-05-28", estado: "Pendiente" },
  { id: 3, fechaRegistro: "2026-05-18", documento: "1248784562", motivo: "Incapacidad", fechaInicio: "2026-05-20", fechaFin: "2026-05-20", estado: "Aprobado" },
  { id: 4, fechaRegistro: "2026-05-19", documento: "965895255", motivo: "Licencia Médica", fechaInicio: "2026-05-21", fechaFin: "2026-05-21", estado: "Rechazado" },
  { id: 5, fechaRegistro: "2026-06-10", documento: "125545864", motivo: "Evento Escolar", fechaInicio: "2026-06-14", fechaFin: "2026-06-14", estado: "Pendiente" },
  { id: 6, fechaRegistro: "2026-06-03", documento: "1128905366", motivo: "Incapacidad", fechaInicio: "2026-06-05", fechaFin: "2026-06-06", estado: "Aprobado" },
  { id: 7, fechaRegistro: "2026-05-30", documento: "1094123462", motivo: "Cita Médica", fechaInicio: "2026-06-01", fechaFin: "2026-06-01", estado: "Pendiente" },
  { id: 8, fechaRegistro: "2026-05-13", documento: "1094123463", motivo: "Jornada adicional", fechaInicio: "2026-05-15", fechaFin: "2026-05-15", estado: "Rechazado" },
];

const selectArrowStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236E6E6E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
  backgroundSize: "0.9rem",
};

export default function SolicitudesComputadas() {
  const navigate = useNavigate();

  // 🔧 Cuando tengas backend, cambia esto por useState([]) + useEffect con el fetch
  const [solicitudes, setSolicitudes] = useState(MOCK_SOLICITUDES);
  const [cargando] = useState(false);
  const [error] = useState(null);

  // Filtros
  const [documento, setDocumento] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);

  const handleFiltrar = () => {
    setPaginaActual(1);
  };

  const handleCambiarEstado = (id, nuevoEstado) => {
    // 🔧 Cuando tengas backend: PATCH /api/solicitudes-computadas/${id}/ { estado: nuevoEstado }
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s))
    );
  };

  const handleDescargar = (id) => {
    // 🔧 Cuando tengas backend: fetch(`/api/solicitudes-computadas/${id}/descargar/`)
    alert(`Descargar solicitud #${id} (pendiente de conectar con backend)`);
  };

  const solicitudesFiltradas = useMemo(() => {
  return solicitudes.filter((s) => {
    const coincideDocumento = documento
      ? String(s.documento || "").includes(documento)
      : true;
    const coincideFecha = fecha
      ? s.fechaRegistro === fecha || s.fechaInicio === fecha || s.fechaFin === fecha
      : true;
    const coincideEstado = estado ? s.estado === estado : true;
    return coincideDocumento && coincideFecha && coincideEstado;
  });
}, [solicitudes, documento, fecha, estado]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(solicitudesFiltradas.length / ITEMS_POR_PAGINA)
  );

  const solicitudesPagina = solicitudesFiltradas.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const irPaginaAnterior = () => setPaginaActual((p) => Math.max(1, p - 1));
  const irPaginaSiguiente = () =>
    setPaginaActual((p) => Math.min(totalPaginas, p + 1));

  return (
    <div className="w-full font-secondary">
      <div className="flex flex-col md:flex-row gap-3 items-start">
        {/* Panel de filtros */}
        <aside className="bg-surface rounded-[var(--border-main-container)] shadow-md p-3 w-full md:w-56 shrink-0">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-border rounded-[var(--border-buttons)] py-1.5 text-info-regular text-text-secondary mb-2 hover:bg-brand"
          >
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
                d="M3 4h18M6 8h12M10 12h4M11 16h2"
              />
            </svg>
            Filtrar por
          </button>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Número de Documento"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="bg-brand-soft border border-brand-softv2 rounded-[var(--border-inputs)] px-3 py-1.5 text-info-regular text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="bg-brand-soft border border-brand-softv2 rounded-[var(--border-inputs)] px-3 py-1.5 text-info-regular text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="appearance-none bg-brand-soft border border-brand-softv2 rounded-[var(--border-inputs)] px-3 py-1.5 pr-10 text-info-regular text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary bg-no-repeat bg-[right_1rem_center]"
              style={selectArrowStyle}
            >
              <option value="">Estado</option>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            <Button variant="primary" size="sm" onClick={handleFiltrar}>
              Filtrar
            </Button>
          </div>
        </aside>

        {/* Tabla principal */}
        <section className="bg-beige rounded-[var(--border-main-container)] shadow-md p-3 flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              style={{ color: "var(--color-text-primary)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <h2
              className="text-info-general font-main font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Consultas y Reportes
            </h2>
          </div>

          {error && (
            <p className="text-error text-info-regular mb-2">{error}</p>
          )}

          <RectorTable
            solicitudes={solicitudesPagina}
            cargando={cargando}
            onCambiarEstado={handleCambiarEstado}
            onDescargar={handleDescargar}
          />

          <div className="flex items-center justify-between mt-3">
            <Button variant="primary" size="sm" onClick={() => navigate(-1)}>
              Regresar
            </Button>

            <div className="flex items-center gap-1 text-info-regular">
              <button
                type="button"
                onClick={irPaginaAnterior}
                disabled={paginaActual === 1}
                className="px-2 py-1 rounded-[var(--border-buttons)] disabled:opacity-40 text-text-secondary"
              >
                ‹
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPaginaActual(num)}
                  className={`px-2 py-1 rounded-[var(--border-buttons)] ${
                    paginaActual === num
                      ? "font-extrabold text-brand-hoverv2"
                      : "text-text-muted hover:text-primary"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={irPaginaSiguiente}
                disabled={paginaActual === totalPaginas}
                className="px-2 py-1 rounded-[var(--border-buttons)] disabled:opacity-40 text-text-secondary"
              >
                ›
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}