const ESTADOS = ["Pendiente", "Aprobado", "Rechazado"];

const selectArrowStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236E6E6E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
  backgroundSize: "0.9rem",
};

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "";
  const [anio, mes, dia] = fechaStr.split("-");
  if (!mes) return fechaStr;
  return `${dia}/${mes}/${anio}`;
};

export default function RectorTable({
  solicitudes,
  cargando,
  onCambiarEstado,
  onDescargar,
  onDescargarAnexo,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-info-regular text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-text-primary">
            <th className="py-1.5 px-2 font-semibold">Fecha Registro</th>
            <th className="py-1.5 px-2 font-semibold">Documento</th>
            <th className="py-1.5 px-2 font-semibold">Motivo</th>
            <th className="py-1.5 px-2 font-semibold">Fecha Inicio</th>
            <th className="py-1.5 px-2 font-semibold">Fecha Fin</th>
            <th className="py-1.5 px-2 font-semibold">Anexo</th>
            <th className="py-1.5 px-2 font-semibold">Estado</th>
            <th className="py-1.5 px-2 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cargando ? (
            <tr>
              <td colSpan={8} className="text-center py-4 text-text-muted">
                Cargando...
              </td>
            </tr>
          ) : solicitudes.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4 text-text-muted">
                No hay registros que coincidan con el filtro.
              </td>
            </tr>
          ) : (
            solicitudes.map((s) => (
              <tr key={s.id} className="border-b border-brand-softv2">
                <td className="py-1.5 px-2 text-text-primary">{formatearFecha(s.fechaRegistro)}</td>
                <td className="py-1.5 px-2 text-text-primary">{s.documento}</td>
                <td className="py-1.5 px-2 text-text-primary">{s.motivo}</td>
                <td className="py-1.5 px-2 text-text-primary">{formatearFecha(s.fechaInicio)}</td>
                <td className="py-1.5 px-2 text-text-primary">{formatearFecha(s.fechaFin)}</td>
                <td className="py-1.5 px-2">
                  <button
                    type="button"
                    onClick={() => onDescargarAnexo(s.id)}
                    className="text-info hover:underline font-semibold"
                  >
                    Descargar
                  </button>
                </td>
                <td className="py-1.5 px-2">
                  <select
                    value={s.estado}
                    onChange={(e) => onCambiarEstado(s.id, e.target.value)}
                    className="appearance-none bg-brand-soft border border-brand-softv2 rounded-[var(--border-inputs)] pl-3 pr-8 py-1 text-info-regular text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary bg-no-repeat bg-[right_0.6rem_center]"
                    style={selectArrowStyle}
                  >
                    {ESTADOS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-1.5 px-2">
                  <button
                    type="button"
                    onClick={() => onDescargar(s.id)}
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
  );
}