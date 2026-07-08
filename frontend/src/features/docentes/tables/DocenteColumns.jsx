// Definición de las columnas de la tabla de docentes
// Este arreglo suele usarse en librerías de tablas como TanStack Table
export const DocenteColumns = [

  // Columna ID
  {
    accessorKey: "id",
    header: "Id",
  },

  // Nombre del servidor público (docente)
  {
    accessorKey: "nombreServidor",
    header: "Nombre del Servidor",
  },

  // Tipo de identificación
  {
    accessorKey: "tipoIdentificacion",
    header: "Tipo Identificación",
  },

  // Número de identificación
  {
    accessorKey: "numeroIdentificacion",
    header: "Número Identificación",
  },

  // Institución Educativa
  {
    accessorKey: "institucionEducativa",
    header: "Institución Educativa",
  },

  // Sede
  {
    accessorKey: "sedeCentral",
    header: "Sede",
  },

  // Fecha inicio del permiso
  {
    accessorKey: "fechaInicio",
    header: "Fecha Inicio",
  },

  // Fecha fin del permiso
  {
    accessorKey: "fechaFin",
    header: "Fecha Fin",
  },

  // Hora inicio
  {
    accessorKey: "horaInicio",
    header: "Hora Inicio",
  },

  // Hora fin
  {
    accessorKey: "horaFin",
    header: "Hora Fin",
  },

  // Tipo de permiso
  {
    accessorKey: "tipoPermiso",
    header: "Tipo Permiso",
  },

  // Justificación
  {
    accessorKey: "justificacion",
    header: "Justificación",
  },

  // Estado de la solicitud (Pendiente, Aprobado, Rechazado)
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const docente = row.original;
      return <span>{docente.estado}</span>;
    },
  },
];
