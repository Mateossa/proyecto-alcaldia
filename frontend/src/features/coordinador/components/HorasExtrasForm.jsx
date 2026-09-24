import { useState, useEffect } from "react";
import { Input, Select, Button, Modal } from "@/shared/components";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

export default function HorasExtrasForm() {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [buscandoDocente, setBuscandoDocente] = useState(false);

  const [instituciones, setInstituciones] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [docenteId, setDocenteId] = useState(null);

  const [formData, setFormData] = useState({
    nombreServidor: "",
    numeroIdentidad: "",
    nombreIE: "",
    sedeCentral: "",
    fechaInicio: "",
    fechaFin: "",
    horaInicio: "",
    horaFin: "",
    tipoPermiso: "",
    horasSituacionAdministrativa: "",
    justificacion: "",
    soporte: null,
  });

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });

  useEffect(() => {
    const fetchInstituciones = async () => {
      try {
        const response = await fetch(`${API_URL}/instituciones-educativas/`, {
          headers: authHeaders(),
        });
        const data = await response.json();
        setInstituciones(data.map((ie) => ({ value: ie.id, label: ie.nombre })));
      } catch (err) {
        setServerError("No se pudieron cargar las instituciones educativas");
      }
    };
    fetchInstituciones();
  }, []);

  useEffect(() => {
    if (!formData.nombreIE) {
      setSedes([]);
      return;
    }
    const fetchSedes = async () => {
      try {
        const response = await fetch(
          `${API_URL}/sedes/?institucion_educativa=${formData.nombreIE}`,
          { headers: authHeaders() }
        );
        const data = await response.json();
        setSedes(data.map((sede) => ({ value: sede.id, label: sede.nombre })));
      } catch (err) {
        setServerError("No se pudieron cargar las sedes");
      }
    };
    fetchSedes();
  }, [formData.nombreIE]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "soporte") {
      setFormData((prev) => ({ ...prev, soporte: files[0] }));
    } else if (name === "nombreIE") {
      setFormData((prev) => ({ ...prev, nombreIE: value, sedeCentral: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Al salir del campo de número de identidad, busca al docente en el backend
  const handleBuscarDocente = async () => {
    if (!formData.numeroIdentidad) return;

    setBuscandoDocente(true);
    setErrors((prev) => ({ ...prev, numeroIdentidad: undefined }));
    setDocenteId(null);

    try {
      const response = await fetch(
        `${API_URL}/docentes/buscar/?numero_documento=${formData.numeroIdentidad}`,
        { headers: authHeaders() }
      );

      if (!response.ok) {
        setErrors((prev) => ({
          ...prev,
          numeroIdentidad: "No se encontró un docente con ese número de documento",
        }));
        setFormData((prev) => ({ ...prev, nombreServidor: "" }));
        return;
      }

      const docente = await response.json();
      setDocenteId(docente.id);
      setFormData((prev) => ({ ...prev, nombreServidor: docente.nombre_completo }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, numeroIdentidad: "Error al buscar el docente" }));
    } finally {
      setBuscandoDocente(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!docenteId) newErrors.numeroIdentidad = "Debe buscar un docente válido";
    if (!formData.nombreIE) newErrors.nombreIE = "Requerido";
    if (!formData.sedeCentral) newErrors.sedeCentral = "Requerido";
    if (!formData.fechaInicio) newErrors.fechaInicio = "Requerido";
    if (!formData.horaInicio) newErrors.horaInicio = "Requerido";
    if (!formData.horaFin) newErrors.horaFin = "Requerido";
    if (!formData.justificacion) newErrors.justificacion = "Requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setServerError("");
    setLoading(true);

    const body = new FormData();
    body.append("docente", docenteId);
    body.append("institucion_educativa", formData.nombreIE);
    body.append("sede", formData.sedeCentral);
    body.append("fecha", formData.fechaInicio);
    if (formData.fechaFin) body.append("fecha_fin", formData.fechaFin);
    body.append("hora_inicio", formData.horaInicio);
    body.append("hora_fin", formData.horaFin);
    body.append(
      "horas_situacion_administrativa",
      formData.horasSituacionAdministrativa || 0
    );
    body.append("descripcion", formData.justificacion);
    if (formData.soporte) body.append("anexo", formData.soporte);

    try {
      const response = await fetch(`${API_URL}/horas-extras/`, {
        method: "POST",
        headers: authHeaders(),
        body,
      });

      if (!response.ok) {
        const errData = await response.json();
        setServerError(JSON.stringify(errData));
        setShowModal(true);
        return;
      }

      setShowModal(true);
      setServerError("Horas extras registradas correctamente");
    } catch (err) {
      setServerError("No se pudo conectar con el servidor");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-0 px-2 py-0 font-main"
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-0">
          <Input
            label="Nombre del Servidor"
            placeholder="Se completa al buscar el número de identidad"
            name="nombreServidor"
            value={formData.nombreServidor}
            disabled
          />
          <Input
            label="Número de identidad"
            placeholder="Ingrese el número de identidad"
            name="numeroIdentidad"
            value={formData.numeroIdentidad}
            onChange={handleChange}
            onBlur={handleBuscarDocente}
            error={error.numeroIdentidad || (buscandoDocente ? "Buscando..." : undefined)}
          />

          <Select label="Nombre de la IE" name="nombreIE" options={instituciones} value={formData.nombreIE} onChange={handleChange} error={error.nombreIE} />
          <Select
            label="Sede Central"
            name="sedeCentral"
            options={sedes}
            value={formData.sedeCentral}
            onChange={handleChange}
            error={error.sedeCentral}
            disabled={!formData.nombreIE}
          />

          <Select label="Tipo de permiso" name="tipoPermiso" options={["Horas Extras"]} value={formData.tipoPermiso} onChange={handleChange} error={error.tipoPermiso} />
          <Input type="number" min="0" label="Horas extras por situación administrativa" placeholder="Ingrese las horas" name="horasSituacionAdministrativa" value={formData.horasSituacionAdministrativa} onChange={handleChange} error={error.horasSituacionAdministrativa} />

          <Input type="date" label="Fecha Inicio" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} error={error.fechaInicio} />
          <Input type="date" label="Fecha Fin" name="fechaFin" value={formData.fechaFin} onChange={handleChange} error={error.fechaFin} />

          <Input type="time" label="Hora Inicio" name="horaInicio" value={formData.horaInicio} onChange={handleChange} error={error.horaInicio} />
          <Input type="time" label="Hora fin" name="horaFin" value={formData.horaFin} onChange={handleChange} error={error.horaFin} />

          <Input label="Justificación" placeholder="Ingrese la justificación" name="justificacion" value={formData.justificacion} onChange={handleChange} error={error.justificacion} />
        </div>

        <input type="file" name="soporte" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} className="hidden" id="soporteInput" />

        <div className="flex gap-3 justify-between items-center mt-4">
          <div className="flex gap-3">
            <Button variant="primary" size="md" type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
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