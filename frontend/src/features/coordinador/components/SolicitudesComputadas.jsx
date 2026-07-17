import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../shared/components/Button";
import CoordinadorTable from "../tables/CoordinadorTable";

const ESTADOS = ["Pendiente", "Aprobado", "Rechazado"];
const ITEMS_POR_PAGINA = 5;

// 🔧 Datos de ejemplo mientras no hay backend.
// Ausentismo usa fechaInicio/fechaFin. Horas Extras usa horaInicio/horaFin.
const MOCK_AUSENTISMO = [
  // Ausentismo
  { id: 1, fechaRegistro: "2026-05-30", documento: "1128548648", motivo: "Cita Médica", tipo: "Ausentismo", fechaInicio: "2026-06-02", fechaFin: "2026-06-02", estado: "Pendiente" },
  { id: 2, fechaRegistro: "2026-05-25", documento: "1124855688", motivo: "Cobertura de turno", tipo: "Ausentismo", fechaInicio: "2026-05-16", fechaFin: "2026-05-04", estado: "Aprobado" },
  { id: 3, fechaRegistro: "2026-05-18", documento: "1248784562", motivo: "Incapacidad", tipo: "Ausentismo", fechaInicio: "2026-05-20", fechaFin: "2026-05-22", estado: "Pendiente" },
  { id: 4, fechaRegistro: "2026-05-19", documento: "965895255", motivo: "Licencia Médica", tipo: "Ausentismo", fechaInicio: "2026-05-21", fechaFin: "2026-05-21", estado: "Rechazado" },
  { id: 5, fechaRegistro: "2026-06-10", documento: "125545864", motivo: "Evento institucional", tipo: "Ausentismo", fechaInicio: "2026-12-16", fechaFin: "2026-06-20", estado: "Rechazado" },
  { id: 6, fechaRegistro: "2026-06-03", documento: "1189578628", motivo: "Incapacidad", tipo: "Ausentismo", fechaInicio: "2026-06-05", fechaFin: "2026-06-07", estado: "Aprobado" },
]

const MOCK_HORAS_EXTRAS = [
  // Horas Extras
  { id: 7, fechaRegistro: "2026-07-10", documento: "123456789", motivo: "Revisión de informes", tipo: "Horas Extras", horaInicio: "18:00", horaFin: "20:00", estado: "Pendiente" },
  { id: 8, fechaRegistro: "2026-07-11", documento: "987654321", motivo: "Capacitación docente", tipo: "Horas Extras", horaInicio: "19:00", horaFin: "21:00", estado: "Aprobado" },
  { id: 9, fechaRegistro: "2026-07-12", documento: "456123789", motivo: "Reunión extraordinaria", tipo: "Horas Extras", horaInicio: "17:30", horaFin: "19:00", estado: "Rechazado" },
  { id: 17, fechaRegistro: "2026-07-10", documento: "123456789", motivo: "Revisión de informes", tipo: "Horas Extras", horaInicio: "18:00", horaFin: "20:00", estado: "Pendiente" },
  { id: 18, fechaRegistro: "2026-07-11", documento: "987654321", motivo: "Capacitación docente", tipo: "Horas Extras", horaInicio: "19:00", horaFin: "21:00", estado: "Aprobado" },
  { id: 19, fechaRegistro: "2026-07-12", documento: "456123789", motivo: "Reunión extraordinaria", tipo: "Horas Extras", horaInicio: "17:30", horaFin: "19:00", estado: "Rechazado" },
  { id: 10, fechaRegistro: "2026-07-13", documento: "852741963", motivo: "Actualización de plataforma", tipo: "Horas Extras", horaInicio: "20:00", horaFin: "22:00", estado: "Pendiente" },
  { id: 11, fechaRegistro: "2026-07-14", documento: "963258741", motivo: "Soporte técnico nocturno", tipo: "Horas Extras", horaInicio: "21:00", horaFin: "23:00", estado: "Aprobado" },
  { id: 12, fechaRegistro: "2026-07-15", documento: "741852963", motivo: "Revisión presupuestal", tipo: "Horas Extras", horaInicio: "18:30", horaFin: "20:30", estado: "Pendiente" },
  { id: 13, fechaRegistro: "2026-07-16", documento: "159753486", motivo: "Capacitación en seguridad", tipo: "Horas Extras", horaInicio: "19:30", horaFin: "21:30", estado: "Rechazado" },
  { id: 14, fechaRegistro: "2026-07-17", documento: "357951456", motivo: "Reunión con proveedores", tipo: "Horas Extras", horaInicio: "17:00", horaFin: "19:00", estado: "Aprobado" },
  { id: 15, fechaRegistro: "2026-07-18", documento: "258963147", motivo: "Auditoría interna", tipo: "Horas Extras", horaInicio: "20:00", horaFin: "22:00", estado: "Pendiente" },
  { id: 16, fechaRegistro: "2026-07-19", documento: "654789321", motivo: "Revisión de contratos", tipo: "Horas Extras", horaInicio: "18:00", horaFin: "20:00", estado: "Aprobado" },
];

const selectArrowStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236E6E6E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
  backgroundSize: "0.9rem",
};

export default function SolicitudesComputadas() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

    // Tipo viene preseleccionado desde el botón "Ver Horas Extras" del panel/formulario
  const tipoParam = searchParams.get("tipo") || "";
  const mostrarHoras = tipoParam === "Horas Extras";

  // 🔧 Cuando tengas backend, cambia esto por useState([]) + useEffect con el fetch
  const [solicitudes] = useState(tipoParam === "Horas Extras" ? MOCK_HORAS_EXTRAS : MOCK_AUSENTISMO);
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

  const handleDescargar = (id) => {
    // 🔧 Cuando tengas backend: fetch(`/api/solicitudes-computadas/${id}/descargar/`)
    alert(`Descargar solicitud #${id} (pendiente de conectar con backend)`);
  };

  const handleExportarPDF = () => {
    // 🔧 Cuando tengas backend: fetch(`/api/horas-extras/exportar/pdf/`)
    alert("Exportar a PDF (pendiente de conectar con backend)");
  };

  const handleExportarExcel = () => {
    // 🔧 Cuando tengas backend: fetch(`/api/horas-extras/exportar/excel/`)
    alert("Exportar a Excel (pendiente de conectar con backend)");
  };

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((s) => {
      const coincideTipo = tipoParam ? s.tipo === tipoParam : true;
      const coincideDocumento = documento
        ? String(s.documento || "").includes(documento)
        : true;
      const coincideFecha = fecha
        ? s.fechaRegistro === fecha || s.fechaInicio === fecha || s.fechaFin === fecha
        : true;
      const coincideEstado = estado ? s.estado === estado : true;
      return coincideTipo && coincideDocumento && coincideFecha && coincideEstado;
    });
  }, [solicitudes, tipoParam, documento, fecha, estado]);

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
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
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
                Solicitudes computadas{tipoParam ? ` · ${tipoParam}` : ""}
              </h2>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleExportarPDF}
                className="px-4 py-1.5 rounded-[var(--border-buttons)] border border-primary text-primary text-info-regular font-semibold hover:bg-brand-soft transition-colors"
              >
                Exportar PDF
              </button>
              <button
                type="button"
                onClick={handleExportarExcel}
                className="px-4 py-1.5 rounded-[var(--border-buttons)] border border-primary text-primary text-info-regular font-semibold hover:bg-brand-soft transition-colors"
              >
                Exportar Excel
              </button>
            </div>
          </div>

          {error && (
            <p className="text-error text-info-regular mb-2">{error}</p>
          )}

          <CoordinadorTable
            solicitudes={solicitudesPagina}
            cargando={cargando}
            onDescargar={handleDescargar}
            mostrarHoras={mostrarHoras}
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