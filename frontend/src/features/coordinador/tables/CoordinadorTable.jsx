const ESTADO_STYLES = {
  Pendiente: "text-warning font-semibold",
  Aprobado: "text-success font-semibold",
  Rechazado: "text-error font-semibold",
};

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "";
  const [anio, mes, dia] = fechaStr.split("-");
  if (!mes) return fechaStr;
  return `${dia}/${mes}/${anio}`;
};

export default function CoordinadorTable({ solicitudes, cargando, onDescargar, mostrarHoras = false }) {
  const etiquetaInicio = mostrarHoras ? "Hora Inicio" : "Fecha Inicio";
  const etiquetaFin = mostrarHoras ? "Hora Fin" : "Fecha Fin";

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-info-regular text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-text-primary">
            <th className="py-1 px-2 font-semibold">Fecha Registro</th>
            <th className="py-1 px-2 font-semibold">Documento</th>
            <th className="py-1 px-2 font-semibold">Motivo</th>
            <th className="py-1 px-2 font-semibold">{etiquetaInicio}</th>
            <th className="py-1 px-2 font-semibold">{etiquetaFin}</th>
            <th className="py-1 px-2 font-semibold">Estado</th>
            <th className="py-1 px-2 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cargando ? (
            <tr>
              <td colSpan={7} className="text-center py-3 text-text-muted">
                Cargando...
              </td>
            </tr>
          ) : solicitudes.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-3 text-text-muted">
                No hay registros que coincidan con el filtro.
              </td>
            </tr>
          ) : (
            solicitudes.map((s) => {
              // Cada fila decide su propio formato según su tipo,
              // así una vista mixta (Ausentismo + Horas Extras) nunca deja celdas vacías.
              const esHorasExtras = s.tipo === "Horas Extras";
              const valorInicio = esHorasExtras ? s.horaInicio : formatearFecha(s.fechaInicio);
              const valorFin = esHorasExtras ? s.horaFin : formatearFecha(s.fechaFin);

              return (
                <tr key={s.id} className="border-b border-brand-softv2">
                  <td className="py-1 px-2 text-text-primary">{formatearFecha(s.fechaRegistro)}</td>
                  <td className="py-1 px-2 text-text-primary">{s.documento}</td>
                  <td className="py-1 px-2 text-text-primary">{s.motivo}</td>
                  <td className="py-1 px-2 text-text-primary">{valorInicio}</td>
                  <td className="py-1 px-2 text-text-primary">{valorFin}</td>
                  <td className={`py-1 px-2 ${ESTADO_STYLES[s.estado] || ""}`}>{s.estado}</td>
                  <td className="py-1 px-2">
                    <button
                      type="button"
                      onClick={() => onDescargar(s.id)}
                      className="text-info hover:underline font-semibold"
                    >
                      Descargar
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}