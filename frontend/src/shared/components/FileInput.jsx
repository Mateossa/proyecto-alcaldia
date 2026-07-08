// ─────────────────────────────────────────────
// FileInput.jsx
// Componente para seleccionar imágenes
// Muestra la imagen actual si existe y permite cambiarla
// La subida ocurre cuando el usuario guarda el formulario
// ─────────────────────────────────────────────

import { useState } from "react";

export default function FileInput({
  label = "Subir archivo",
  accept = "image/*",
  onUpload,
  currentImage, // 👈 URL de la imagen actual para modo edición
}) {
  // Estado para la preview de la imagen nueva seleccionada
  const [preview, setPreview] = useState(null);

  // Guarda el archivo seleccionado y genera una preview local
  const handleChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    // Genera una URL temporal para mostrar la preview antes de subir
    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    }

    // Envía el archivo al componente padre solo si onUpload existe
    if (typeof onUpload === 'function') {
      onUpload(f);
    }
  };

  // Decide qué imagen mostrar:
  // 1. Si el usuario seleccionó una nueva imagen → muestra la preview local
  // 2. Si no seleccionó pero tiene imagen guardada → muestra la imagen del servidor
  // 3. Si no tiene ninguna → no muestra nada
  const imagenMostrar = preview
    || (currentImage ? `http://localhost:8000${currentImage}` : null);

  return (
    <div className="grid grid-cols-1 text-center items-center mx-auto py-auto h-full">

      {/* Muestra la imagen actual o la nueva seleccionada */}
      {imagenMostrar && (
        <img
          src={imagenMostrar}
          className="mx-auto h-48 w-48 object-contain rounded-full"
          alt="Preview"
        />
      )}

      <div className="grid grid-cols gap-4 h-17">
        <label className="text-center text-sm font-main font-bold text-brand-hover">
          {label || "Foto de perfil (opcional)"}
        </label>
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="text-sm text-gray-600
            file:mr-6 file:rounded-lg file:border-0
            file:bg-brand-hover file:px-4 file:py-2
            file:text-white cursor-pointer"
        />
      </div>

    </div>
  );
}