// ===== Reglas del soporte (una sola vez para todos los formularios) =====
export const SOPORTE_OBLIGATORIO = false;
export const SOPORTE_EXTENSIONES = ["pdf", "jpg", "jpeg", "png"];
export const SOPORTE_ACCEPT = SOPORTE_EXTENSIONES.map((ext) => `.${ext}`).join(",");
export const SOPORTE_MAX_MB = 5;
export const SOPORTE_MAX_BYTES = SOPORTE_MAX_MB * 1024 * 1024;

// Devuelve un mensaje de error, o "" si el archivo es válido
export const validarSoporte = (archivo) => {
  const extension = archivo.name.split(".").pop().toLowerCase();
  if (!SOPORTE_EXTENSIONES.includes(extension)) {
    return "El soporte debe ser un archivo PDF, JPG o PNG.";
  }
  if (archivo.size === 0) {
    return "El archivo seleccionado está vacío.";
  }
  if (archivo.size > SOPORTE_MAX_BYTES) {
    return `El soporte no puede superar los ${SOPORTE_MAX_MB} MB.`;
  }
  return "";
};

export const formatearTamano = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;