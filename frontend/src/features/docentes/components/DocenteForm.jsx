import { useState, useEffect } from "react";
import { Input, Select, Button, Modal } from "@/shared/components";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

export default function DocenteForm() {
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const [serverError, setServerError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [instituciones, setInstituciones] = useState([]);
  const [sedes, setSedes] = useState([]);

  const [formData, setFormData] = useState({
    institucionEducativa: "",
    sedeCentral: "",
    fechaInicio: "",
    fechaFin: "",
    horaInicio: "",
    horaFin: "",
    tipoPermiso: "",
    justificacion: "",
    soporte: null,
  });

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });

  // Carga la lista de Instituciones Educativas al montar el componente
  useEffect(() => {
    const fetchInstituciones = async () => {
      try {
        const response = await fetch(`${API_URL}/instituciones-educativas/`, {
          headers: authHeaders(),
        });
        const data = await response.json();
        setInstituciones(
          data.map((ie) => ({ value: ie.id, label: ie.nombre }))
        );
      } catch (err) {
        setServerError("No se pudieron cargar las instituciones educativas");
      }
    };

    fetchInstituciones();
  }, []);

  // Carga las sedes correspondientes cada vez que cambia la IE seleccionada
  useEffect(() => {
    if (!formData.institucionEducativa) {
      setSedes([]);
      return;
    }

    const fetchSedes = async () => {
      try {
        const response = await fetch(
          `${API_URL}/sedes/?institucion_educativa=${formData.institucionEducativa}`,
          { headers: authHeaders() }
        );
        const data = await response.json();
        setSedes(data.map((sede) => ({ value: sede.id, label: sede.nombre })));
      } catch (err) {
        setServerError("No se pudieron cargar las sedes");
      }
    };

    fetchSedes();
  }, [formData.institucionEducativa]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "soporte") {
      setFormData((prev) => ({ ...prev, soporte: files[0] }));
    } else if (name === "institucionEducativa") {
      // Al cambiar de IE, se limpia la sede elegida (pertenecía a la IE anterior)
      setFormData((prev) => ({ ...prev, institucionEducativa: value, sedeCentral: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.institucionEducativa) newErrors.institucionEducativa = "Requerido";
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
    setServerError("");
    setLoading(true);

    // Usamos FormData porque el anexo es un archivo (multipart, no JSON)
    const body = new FormData();
    body.append("institucion_educativa", formData.institucionEducativa);
    body.append("sede", formData.sedeCentral);
    body.append("motivo", formData.tipoPermiso);
    body.append("descripcion", formData.justificacion);
    body.append("fecha_inicio", formData.fechaInicio);
    body.append("fecha_fin", formData.fechaFin);
    body.append("hora_inicio", formData.horaInicio);
    body.append("hora_fin", formData.horaFin);
    if (formData.soporte) {
      body.append("anexo", formData.soporte);
    }

    try {
      const response = await fetch(`${API_URL}/ausentismos/`, {
        method: "POST",
        headers: authHeaders(), // OJO: sin Content-Type, el navegador lo pone solo con boundary correcto
        body,
      });

      if (!response.ok) {
        const errData = await response.json();
        setServerError(JSON.stringify(errData));
        setShowModal(true);
        return;
      }

      setShowModal(true);
      setServerError("Ausentismo registrado correctamente");
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
        <div className="grid grid-cols-2 gap-x-3 gap-y-0">
          <Input
            label="Nombre del Servidor"
            value={usuario.nombre_completo ?? `${usuario.nombres ?? ""} ${usuario.apellidos ?? ""}`}
            disabled
          />
          <Input type="date" label="Fecha Fin" name="fechaFin" value={formData.fechaFin} onChange={handleChange} error={error.fechaFin} />

          <Input
            label="Tipo de identificación"
            value={usuario.tipo_documento ?? ""}
            disabled
          />
          <Input type="time" label="Hora Inicio" name="horaInicio" value={formData.horaInicio} onChange={handleChange} error={error.horaInicio} />

          <Input
            label="Número de identificación"
            value={usuario.numero_documento ?? ""}
            disabled
          />
          <Input type="time" label="Hora Fin" name="horaFin" value={formData.horaFin} onChange={handleChange} error={error.horaFin} />

          <Select
            label="Institución Educativa"
            name="institucionEducativa"
            options={instituciones}
            value={formData.institucionEducativa}
            onChange={handleChange}
            error={error.institucionEducativa}
          />
          <Select
            label="Tipo de permiso"
            name="tipoPermiso"
            options={["Ausentismo", "Permiso académico", "Permiso administrativo", "Incapacidad médica", "Licencia especial"]}
            value={formData.tipoPermiso}
            onChange={handleChange}
            error={error.tipoPermiso}
          />

          <Select
            label="Sede"
            name="sedeCentral"
            options={sedes}
            value={formData.sedeCentral}
            onChange={handleChange}
            error={error.sedeCentral}
            disabled={!formData.institucionEducativa}
          />
          <Input label="Justificación" placeholder="Ingrese la justificación" name="justificacion" value={formData.justificacion} onChange={handleChange} error={error.justificacion} />

          <Input type="date" label="Fecha Inicio" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} error={error.fechaInicio} />
          <div />
        </div>

        <input type="file" name="soporte" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} className="hidden" id="soporteInput" />

        <div className="flex gap-3 justify-between items-center mt-1">
          <div className="flex gap-3">
            <Button variant="primary" size="md" type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <Button variant="secondary" size="sm" type="button" onClick={() => navigate(-1)}>Cancelar</Button>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" type="button" onClick={() => document.getElementById("soporteInput").click()}>
              Agregar Soporte
            </Button>
            <Button variant="primary" size="sm" type="button" onClick={() => navigate("/consultas-y-reportes?tipo=Ausentismo")}>
              <span className="whitespace-nowrap">Consulta Ausentismos</span>
            </Button>
            <Button variant="primary" size="sm" type="button" onClick={() => navigate("/consultas-y-reportes?tipo=Horas Extras")}>
              <span className="whitespace-nowrap">Consulta Horas Extras</span>
            </Button>
          </div>
        </div>
      </form>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>{serverError}</Modal>
      )}
    </div>
  );
}