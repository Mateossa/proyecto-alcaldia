import { useState } from "react";
import { Input, Select, Button, Modal } from "@/shared/components";
import { useNavigate } from "react-router-dom";

export default function HorasExtrasForm() {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nombreServidor: "",
    numeroIdentidad: "",
    identificacion: "",
    sedeCentral: "",
    fechaInicio: "",
    fechaFin: "",
    horaInicio: "",
    horaFin: "",
    tipoPermiso: "",
    justificacion: "",
    soporte: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "soporte") {
      setFormData((prev) => ({ ...prev, soporte: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.nombreServidor) newErrors.nombreServidor = "Requerido";
    if (!formData.numeroIdentidad) newErrors.numeroIdentidad = "Requerido";
    if (!formData.identificacion) newErrors.identificacion = "Requerido";
    if (!formData.sedeCentral) newErrors.sedeCentral = "Requerido";
    if (!formData.fechaInicio) newErrors.fechaInicio = "Requerido";
    if (!formData.fechaFin) newErrors.fechaFin = "Requerido";
    if (!formData.horaInicio) newErrors.horaInicio = "Requerido";
    if (!formData.horaFin) newErrors.horaFin = "Requerido";
    if (!formData.tipoPermiso) newErrors.tipoPermiso = "Requerido";
    if (!formData.justificacion) newErrors.justificacion = "Requerido";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    alert("Horas extras registradas correctamente");
  };

  

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-0 px-2 py-0 font-main"
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-0">
          <Input label="Nombre del Servidor" placeholder="Ingrese el nombre del servidor" name="nombreServidor" value={formData.nombreServidor} onChange={handleChange} error={error.nombreServidor} />
          <Input type="date" label="Fecha Fin" name="fechaFin" value={formData.fechaFin} onChange={handleChange} error={error.fechaFin} />

          <Input label="Número de identidad" placeholder="Ingrese el número de identidad" name="numeroIdentidad" value={formData.numeroIdentidad} onChange={handleChange} error={error.numeroIdentidad} />
          <Input type="time" label="Hora Inicio" name="horaInicio" value={formData.horaInicio} onChange={handleChange} error={error.horaInicio} />

          <Input label="Identificación" placeholder="Ingrese la identificación" name="identificacion" value={formData.identificacion} onChange={handleChange} error={error.identificacion} />
          <Input type="time" label="Hora fin" name="horaFin" value={formData.horaFin} onChange={handleChange} error={error.horaFin} />

          <Select label="Sede Central" name="sedeCentral" options={["Sede Principal", "Sede Norte", "Sede Sur", "Sede Oriental"]} value={formData.sedeCentral} onChange={handleChange} error={error.sedeCentral} />
          <Select label="Tipo de permiso" name="tipoPermiso" options={["Horas Extras"]} value={formData.tipoPermiso} onChange={handleChange} error={error.tipoPermiso} />

          <Input type="date" label="Fecha Inicio" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} error={error.fechaInicio} />
          <Input label="Justificación" placeholder="Ingrese la justificación" name="justificacion" value={formData.justificacion} onChange={handleChange} error={error.justificacion} />
        </div>

        <input type="file" name="soporte" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} className="hidden" id="soporteInput" />

        <div className="flex gap-3 justify-between items-center mt-4">
          <div className="flex gap-3">
            <Button variant="primary" size="md" type="submit">Guardar</Button>
            <Button variant="secondary" size="sm" type="button" onClick={() => navigate(-1)}>Regresar</Button>
          </div>
          
        </div>
      </form>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>{serverError}</Modal>
      )}
    </div>
  );
}