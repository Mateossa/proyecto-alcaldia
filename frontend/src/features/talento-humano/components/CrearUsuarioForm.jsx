import { useState } from "react";
import { Input, Select, Button, Modal } from "@/shared/components";
import { useNavigate } from "react-router-dom";

const GRUPOS = ["Docente", "Rector", "Coordinador", "Talento Humano"];

const generarPasswordTemporal = () => {
  const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return password;
};

export default function CrearUsuarioForm() {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setErrors] = useState({});

  const [formData, setFormData] = useState({
    tipoIdentificacion: "",
    numeroDocumento: "",
    nombreCompleto: "",
    correo: "",
    confirmarCorreo: "",
    direccion: "",
    grupo: "",
    celular: "",
    foto: null,
  });

  const [fotoPreview, setFotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, foto: file }));
      if (file) {
        setFotoPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.tipoIdentificacion) newErrors.tipoIdentificacion = "Requerido";
    if (!formData.numeroDocumento) newErrors.numeroDocumento = "Requerido";
    if (!formData.nombreCompleto) newErrors.nombreCompleto = "Requerido";
    if (!formData.correo) newErrors.correo = "Requerido";
    if (!formData.confirmarCorreo) newErrors.confirmarCorreo = "Requerido";
    if (
      formData.correo &&
      formData.confirmarCorreo &&
      formData.correo !== formData.confirmarCorreo
    ) {
      newErrors.confirmarCorreo = "Los correos no coinciden";
    }
    if (!formData.direccion) newErrors.direccion = "Requerido";
    if (!formData.grupo) newErrors.grupo = "Requerido";
    if (!formData.celular) newErrors.celular = "Requerido";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    // 🔧 Cuando tengas backend: POST /api/usuarios/ con formData; el backend genera y envía la contraseña temporal
    const passwordGenerada = generarPasswordTemporal();
    alert(`Usuario creado correctamente.\nGrupo: ${formData.grupo}\nContraseña temporal: ${passwordGenerada}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-0 px-2 py-0 font-main">

        <div className="flex flex-col md:flex-row gap-6">
          {/* Columna 1 */}
          <div className="flex flex-col gap-2 flex-1">
            <Select label="Tipo de identificación" name="tipoIdentificacion" options={["CC", "TI", "CE"]} value={formData.tipoIdentificacion} onChange={handleChange} error={error.tipoIdentificacion} />
            <Input label="Número de documento" placeholder="Ingrese el número de documento" name="numeroDocumento" value={formData.numeroDocumento} onChange={handleChange} error={error.numeroDocumento} />
            <Input label="Nombre completo" placeholder="Ingrese el nombre completo" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} error={error.nombreCompleto} />
            <Input label="Celular" placeholder="Ingrese el número de celular" name="celular" value={formData.celular} onChange={handleChange} error={error.celular} />
          </div>

          {/* Columna 2 */}
          <div className="flex flex-col gap-2 flex-1">
            <Input label="Dirección" placeholder="Ingrese la dirección" name="direccion" value={formData.direccion} onChange={handleChange} error={error.direccion} />
            <Select label="Grupo del usuario" name="grupo" options={GRUPOS} value={formData.grupo} onChange={handleChange} error={error.grupo} />
            <Input type="email" label="Correo electrónico" placeholder="Ingrese el correo electrónico" name="correo" value={formData.correo} onChange={handleChange} error={error.correo} />
            <Input type="email" label="Confirmar correo electrónico" placeholder="Confirme el correo electrónico" name="confirmarCorreo" value={formData.confirmarCorreo} onChange={handleChange} error={error.confirmarCorreo} />
          </div>

          {/* Columna 3 — Foto */}
          <div className="flex flex-col items-center justify-center gap-2 bg-brand-soft rounded-[var(--border-main-container)] p-4 w-full md:w-48 shrink-0">
            <div className="h-28 w-28 rounded-full bg-white border border-brand-softv2 overflow-hidden flex items-center justify-center">
              {fotoPreview ? (
                <img src={fotoPreview} alt="Foto del usuario" className="h-full w-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="8" r="4" strokeWidth={1.5} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
                </svg>
              )}
            </div>
            <input type="file" name="foto" accept=".jpg,.jpeg,.png" onChange={handleChange} className="hidden" id="fotoInput" />
            <button
              type="button"
              onClick={() => document.getElementById("fotoInput").click()}
              className="flex items-center gap-1 text-info-regular font-semibold hover:underline"
              style={{ color: "var(--color-brand-hover)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Cargar foto
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-center items-center mt-6">
          <Button variant="secondary" size="sm" type="button" onClick={() => navigate(-1)}>Regresar</Button>
          <Button variant="primary" size="md" type="submit">Crear</Button>
        </div>
      </form>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>{serverError}</Modal>
      )}
    </div>
  );
}