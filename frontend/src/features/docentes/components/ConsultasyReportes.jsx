import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../shared/components/Button";

const API_URL = "http://127.0.0.1:8000/api";

const ESTADOS = ["Pendiente", "Aprobado", "Rechazado"];
const TIPOS = ["Ausentismo", "Horas Extras"];

const ESTADO_LABELS = {
  PENDIENTE: "Pendiente",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
};

const ESTADO_STYLES = {
  Pendiente: "text-warning font-semibold",
  Aprobado: "text-success font-semibold",
  Rechazado: "text-error font-semibold",
};

const ITEMS_POR_PAGINA = 5;

const selectArrowStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236E6E6E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
  backgroundSize: "0.9rem",
};

function calcularHorasAusentismo(horaInicio, horaFin) {
  if (!horaInicio || !horaFin) return "-";
  const [h1, m1] = horaInicio.split(":").map(Number);
  const [h2, m2] = horaFin.split(":").map(Number);
  const minutos = h2 * 60 + m2 - (h1 * 60 + m1);
  if (minutos <= 0) return "-";
  return (minutos / 60).toFixed(1);
}

export default function ConsultasyReportes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [tipo, setTipo] = useState(searchParams.get("tipo") || "");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    const tipoParam = searchParams.get("tipo");
    if (tipoParam) setTipo(tipoParam);
  }, [searchParams]);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      setError(null);
      try {
        const [ausentismosRes, horasExtrasRes] = await Promise.all([
          fetch(`${API_URL}/ausentismos/`, { headers: authHeaders() }),
          fetch(`${API_URL}/horas-extras/`, { headers: authHeaders() }),
        ]);

        const ausentismosData = ausentismosRes.ok ? await ausentismosRes.json() : [];
        const horasExtrasData = horasExtrasRes.ok ? await horasExtrasRes.json() : [];

        const ausentismosNormalizados = ausentismosData.map((a) => ({
          id: `ausentismo-${a.id}`,
          fecha: a.fecha_inicio,
          tipo: "Ausentismo",
          motivo: a.motivo,
          horas_extras: calcularHorasAusentismo(a.hora_inicio, a.hora_fin),
          estado: ESTADO_LABELS[a.estado] || a.estado,
        }));

        const horasExtrasNormalizadas = horasExtrasData.map((h) => ({
          id: `horas-extras-${h.id}`,
          fecha: h.fecha,
          tipo: "Horas Extras",
          motivo: h.docente_nombre,
          horas_extras: (
            parseFloat(h.horas_diurnas) +
            parseFloat(h.horas_nocturnas) +
            parseFloat(h.horas_situacion_administrativa)
          ).toFixed(1),
          estado: ESTADO_LABELS[h.estado] || h.estado,
        }));

        setSolicitudes([...ausentismosNormalizados, ...horasExtrasNormalizadas]);
      } catch (err) {
        setError("No se pudo conectar con el servidor");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  const handleFiltrar = () => {
    setPaginaActual(1);
  };

  const handleDescargar = (id) => {
    // 🔧 Pendiente: no existe todavía endpoint de descarga en el backend
    alert(`Descargar solicitud ${id} (pendiente de conectar con backend)`);
  };

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((s) => {
      const coincideTipo = tipo ? s.tipo === tipo : true;
      const coincideFecha = fecha ? s.fecha === fecha : true;
      const coincideEstado = estado ? s.estado === estado : true;
      return coincideTipo && coincideFecha && coincideEstado;
    });
  }, [solicitudes, tipo, fecha, estado]);

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

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const [anio, mes, dia] = fechaStr.split("-");
    if (!mes) return fechaStr;
    return `${dia}/${mes}/${anio}`;
  };

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
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="appearance-none bg-brand-soft border border-brand-softv2 rounded-[var(--border-inputs)] px-3 py-1.5 pr-10 text-info-regular text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary bg-no-repeat bg-[right_1rem_center]"
              style={selectArrowStyle}
            >
              <option value="">Tipo de Permiso</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

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
              Consultas y Reportes{tipo ? ` · ${tipo}` : ""}
            </h2>
          </div>

          {error && (
            <p className="text-error text-info-regular mb-2">{error}</p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-info-regular text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-text-primary">
                  <th className="py-1 px-2 font-semibold">Fecha</th>
                  <th className="py-1 px-2 font-semibold">Tipo</th>
                  <th className="py-1 px-2 font-semibold">Motivo</th>
                  <th className="py-1 px-2 font-semibold">Horas</th>
                  <th className="py-1 px-2 font-semibold">Estado</th>
                  <th className="py-1 px-2 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan={6} className="text-center py-3 text-text-muted">
                      Cargando...
                    </td>
                  </tr>
                ) : solicitudesPagina.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-3 text-text-muted">
                      No hay registros que coincidan con el filtro.
                    </td>
                  </tr>
                ) : (
                  solicitudesPagina.map((s) => (
                    <tr key={s.id} className="border-b border-brand-softv2">
                      <td className="py-1 px-2 text-text-primary">{formatearFecha(s.fecha)}</td>
                      <td className="py-1 px-2 text-text-primary">{s.tipo}</td>
                      <td className="py-1 px-2 text-text-primary">{s.motivo}</td>
                      <td className="py-1 px-2 text-text-primary">{s.horas_extras}</td>
                      <td className={`py-1 px-2 ${ESTADO_STYLES[s.estado] || ""}`}>
                        {s.estado}
                      </td>
                      <td className="py-1 px-2">
                        <button
                          type="button"
                          onClick={() => handleDescargar(s.id)}
                          className="text-info hover:underline font-semibold"
                        >
                          Descargar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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