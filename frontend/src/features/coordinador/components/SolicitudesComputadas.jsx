import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../shared/components/Button";
import CoordinadorTable from "../tables/CoordinadorTable";

const API_URL = "http://127.0.0.1:8000/api";

const ESTADOS = ["Pendiente", "Aprobado", "Rechazado"];
const ITEMS_POR_PAGINA = 5;

const ESTADO_LABELS = {
  PENDIENTE: "Pendiente",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
};

const selectArrowStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236E6E6E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
  backgroundSize: "0.9rem",
};

const getColumnasDisponibles = (mostrarHoras) => [
  { key: "fechaRegistro", label: "Fecha Registro" },
  { key: "documento", label: "Documento" },
  { key: "motivo", label: "Motivo" },
  { key: "inicio", label: mostrarHoras ? "Hora Inicio" : "Fecha Inicio" },
  { key: "fin", label: mostrarHoras ? "Hora Fin" : "Fecha Fin" },
  ...(mostrarHoras ? [{ key: "situacionAdministrativa", label: "Horas Sit. Administrativa" }] : []),
  { key: "estado", label: "Estado" },
];

export default function SolicitudesComputadas() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tipoParam = searchParams.get("tipo") || "";
  const mostrarHoras = tipoParam === "Horas Extras";

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [documento, setDocumento] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);

  const [showExportModal, setShowExportModal] = useState(false);
  const [formatoExport, setFormatoExport] = useState(null);
  const columnasDisponibles = getColumnasDisponibles(mostrarHoras);
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState(
    columnasDisponibles.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      setError(null);
      try {
        const endpoint = mostrarHoras ? "horas-extras" : "ausentismos";
        const response = await fetch(`${API_URL}/${endpoint}/`, {
          headers: authHeaders(),
        });

        if (!response.ok) {
          setError("No se pudo conectar con el servidor");
          setSolicitudes([]);
          return;
        }

        const data = await response.json();

        const normalizadas = mostrarHoras
          ? data.map((h) => ({
              id: h.id,
              fechaRegistro: h.fecha_registro?.slice(0, 10),
              documento: h.docente_numero_documento,
              motivo: h.descripcion,
              tipo: "Horas Extras",
              horaInicio: h.hora_inicio?.slice(0, 5) || "",
              horaFin: h.hora_fin?.slice(0, 5) || "",
              situacionAdministrativa: h.horas_situacion_administrativa,
              estado: ESTADO_LABELS[h.estado] || h.estado,
            }))
          : data.map((a) => ({
              id: a.id,
              fechaRegistro: a.fecha_registro?.slice(0, 10),
              documento: a.docente_numero_documento,
              motivo: a.motivo,
              tipo: "Ausentismo",
              fechaInicio: a.fecha_inicio,
              fechaFin: a.fecha_fin,
              estado: ESTADO_LABELS[a.estado] || a.estado,
            }));

        setSolicitudes(normalizadas);
      } catch (err) {
        setError("No se pudo conectar con el servidor");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [mostrarHoras]);

  const handleFiltrar = () => {
    setPaginaActual(1);
  };

  const handleDescargar = (id) => {
    alert(`Descargar solicitud #${id} (pendiente de conectar con backend)`);
  };

  const abrirModalExport = (formato) => {
    setFormatoExport(formato);
    setShowExportModal(true);
  };

  const toggleColumna = (key) => {
    setColumnasSeleccionadas((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTodas = (marcar) => {
    setColumnasSeleccionadas(
      columnasDisponibles.reduce((acc, col) => ({ ...acc, [col.key]: marcar }), {})
    );
  };

  const confirmarExportacion = () => {
    const columnasElegidas = columnasDisponibles
      .filter((col) => columnasSeleccionadas[col.key])
      .map((col) => col.label);

    if (columnasElegidas.length === 0) {
      alert("Selecciona al menos una columna para exportar.");
      return;
    }

    alert(
      `Exportar a ${formatoExport === "pdf" ? "PDF" : "Excel"} con las columnas:\n${columnasElegidas.join(", ")}`
    );
    setShowExportModal(false);
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
        <aside className="bg-surface rounded-[var(--border-main-container)] shadow-md p-3 w-full md:w-56 shrink-0">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-border rounded-[var(--border-buttons)] py-1.5 text-info-regular text-text-secondary mb-2 hover:bg-brand"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M10 12h4M11 16h2" />
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
                <option key={e} value={e}>{e}</option>
              ))}
            </select>

            <Button variant="primary" size="sm" onClick={handleFiltrar}>
              Filtrar
            </Button>
          </div>
        </aside>

        <section className="bg-beige rounded-[var(--border-main-container)] shadow-md p-3 flex-1 w-full">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: "var(--color-text-primary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h2 className="text-info-general font-main font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Solicitudes computadas{tipoParam ? ` · ${tipoParam}` : ""}
              </h2>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => abrirModalExport("pdf")} className="px-4 py-1.5 rounded-[var(--border-buttons)] border border-primary text-primary text-info-regular font-semibold hover:bg-brand-soft transition-colors">
                Exportar PDF
              </button>
              <button type="button" onClick={() => abrirModalExport("excel")} className="px-4 py-1.5 rounded-[var(--border-buttons)] border border-primary text-primary text-info-regular font-semibold hover:bg-brand-soft transition-colors">
                Exportar Excel
              </button>
            </div>
          </div>

          {error && <p className="text-error text-info-regular mb-2">{error}</p>}

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
              <button type="button" onClick={irPaginaAnterior} disabled={paginaActual === 1} className="px-2 py-1 rounded-[var(--border-buttons)] disabled:opacity-40 text-text-secondary">
                ‹
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPaginaActual(num)}
                  className={`px-2 py-1 rounded-[var(--border-buttons)] ${
                    paginaActual === num ? "font-extrabold text-brand-hoverv2" : "text-text-muted hover:text-primary"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button type="button" onClick={irPaginaSiguiente} disabled={paginaActual === totalPaginas} className="px-2 py-1 rounded-[var(--border-buttons)] disabled:opacity-40 text-text-secondary">
                ›
              </button>
            </div>
          </div>
        </section>
      </div>

      {showExportModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 p-4"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              className="absolute top-3 right-4 text-text-muted hover:text-text-primary text-lg cursor-pointer"
            >
              ×
            </button>

            <h3 className="font-main font-bold text-info-general text-center mb-1" style={{ color: "var(--color-brand-fort)" }}>
              Exportar a {formatoExport === "pdf" ? "PDF" : "Excel"}
            </h3>
            <p className="text-info-regular text-text-secondary text-center mb-4">
              Selecciona los datos que quieres incluir:
            </p>

            <div className="flex gap-3 justify-center mb-3 text-info-regular">
              <button type="button" onClick={() => toggleTodas(true)} className="text-info hover:underline font-semibold">
                Seleccionar todo
              </button>
              <button type="button" onClick={() => toggleTodas(false)} className="text-text-muted hover:underline font-semibold">
                Quitar todo
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {columnasDisponibles.map((col) => (
                <label key={col.key} className="flex items-center gap-2 text-info-regular text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={columnasSeleccionadas[col.key] || false}
                    onChange={() => toggleColumna(col.key)}
                    className="h-4 w-4 accent-primary"
                  />
                  {col.label}
                </label>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="secondary" size="sm" onClick={() => setShowExportModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={confirmarExportacion}>
                Exportar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}