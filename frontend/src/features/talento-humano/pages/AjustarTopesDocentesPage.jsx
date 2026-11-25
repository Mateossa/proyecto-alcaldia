import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Input, Modal, Select } from "@/shared/components";

const API_URL = "http://127.0.0.1:8000/api";

const TIPOS_HORA_EXTRA = [
  "COMPLEMENTO ASIGN ACADEMICA",
  "JORNADA UNICA",
  "EDUCACION DE ADULTOS / DOCENTES",
  "APOYO CORD JOR. NOC",
  "METODOLOGIA GEMPA",
  "VALIDACIONES",
  "OTROS PROG AUTORIZADOS POR LA SE",
];

const primerError = (valor) => (Array.isArray(valor) ? valor[0] : valor);

export default function AjustarTopesPage() {
  const navigate = useNavigate();

  const [instituciones, setInstituciones] = useState([]);
  const [institucionId, setInstitucionId] = useState("");
  const [tipoHoraExtra, setTipoHoraExtra] = useState("");
  const [horasDiurnas, setHorasDiurnas] = useState("");
  const [horasNocturnas, setHorasNocturnas] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // { exito: true | false, mensaje: "..." }
  const [resultado, setResultado] = useState(null);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });

  // Carga las instituciones reales desde el backend
  useEffect(() => {
    const fetchInstituciones = async () => {
      try {
        const response = await fetch(`${API_URL}/instituciones-educativas/`, {
          headers: authHeaders(),
        });
        if (!response.ok) throw new Error("No se pudo cargar");
        const data = await response.json();
        setInstituciones(data.map((ie) => ({ value: ie.id, label: ie.nombre })));
      } catch (err) {
        setResultado({
          exito: false,
          mensaje: "No se pudieron cargar las instituciones educativas.",
        });
      }
    };
    fetchInstituciones();
  }, []);

  const handleGuardar = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!institucionId) newErrors.institucionId = "Requerido";
    if (!tipoHoraExtra) newErrors.tipoHoraExtra = "Requerido";
    if (horasDiurnas === "") newErrors.horasDiurnas = "Requerido";
    if (horasNocturnas === "") newErrors.horasNocturnas = "Requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/topes-horas-extras/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          institucion_educativa: Number(institucionId),
          tipo_hora_extra: tipoHoraExtra,
          horas_diurnas: horasDiurnas,
          horas_nocturnas: horasNocturnas,
        }),
      });

      if (response.ok) {
        setResultado({
          exito: true,
          mensaje: "Los topes de la institución fueron actualizados con éxito.",
        });
        setInstitucionId("");
        setTipoHoraExtra("");
        setHorasDiurnas("");
        setHorasNocturnas("");
        return;
      }

      if (response.status === 401) {
        setResultado({
          exito: false,
          mensaje: "Tu sesión expiró. Cierra sesión y vuelve a ingresar.",
        });
        return;
      }

      if (response.status === 403) {
        setResultado({
          exito: false,
          mensaje: "No tienes permiso para ajustar los topes.",
        });
        return;
      }

      const errData = await response.json().catch(() => ({}));

      const fieldErrors = {};
      if (errData.institucion_educativa) fieldErrors.institucionId = primerError(errData.institucion_educativa);
      if (errData.tipo_hora_extra) fieldErrors.tipoHoraExtra = primerError(errData.tipo_hora_extra);
      if (errData.horas_diurnas) fieldErrors.horasDiurnas = primerError(errData.horas_diurnas);
      if (errData.horas_nocturnas) fieldErrors.horasNocturnas = primerError(errData.horas_nocturnas);

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return;
      }

      setResultado({
        exito: false,
        mensaje: errData.detail || "No se pudieron guardar los topes.",
      });
    } catch (err) {
      setResultado({
        exito: false,
        mensaje: "No se pudo conectar con el servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center px-4">

      {/* TARJETA PRINCIPAL */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl px-5 py-3">

        {/* TÍTULO */}
        <div className="text-center mb-2">
          <h1
            className="text-lg font-extrabold leading-tight"
            style={{ color: "var(--color-brand-fort)" }}
          >
            Ajustar Topes por IE
          </h1>

          <p className="mt-0.5 text-xs text-gray-500">
            Configure las horas extras diurnas y nocturnas de una institución
            educativa.
          </p>
        </div>

        {/* AVISO */}
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 flex-shrink-0 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7h.01" />
          </svg>

          <p className="text-xs text-blue-700 text-center flex-1">
            Los valores configurados se aplicarán solo a la institución
            seleccionada.
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleGuardar} className="space-y-1.5">

          {/* INSTITUCIÓN EDUCATIVA */}
          <Select
            label="Institución educativa"
            name="institucionId"
            options={instituciones}
            value={institucionId}
            onChange={(e) => setInstitucionId(e.target.value)}
            error={errors.institucionId}
          />

          {/* TIPO DE HORA EXTRA */}
          <Select
            label="Tipo de Hora Extra"
            name="tipoHoraExtra"
            options={TIPOS_HORA_EXTRA}
            value={tipoHoraExtra}
            onChange={(e) => setTipoHoraExtra(e.target.value)}
            error={errors.tipoHoraExtra}
          />

          {/* HORAS DIURNAS */}
          <Input
            label="Horas extras diurnas"
            type="number"
            min="0"
            value={horasDiurnas}
            onChange={(e) => setHorasDiurnas(e.target.value)}
            placeholder="Ingrese las horas"
            error={errors.horasDiurnas}
          />

          {/* HORAS NOCTURNAS */}
          <Input
            label="Horas extras nocturnas"
            type="number"
            min="0"
            value={horasNocturnas}
            onChange={(e) => setHorasNocturnas(e.target.value)}
            placeholder="Ingrese las horas"
            error={errors.horasNocturnas}
          />

          {/* BOTONES */}
          <div className="flex flex-col items-center gap-1 pt-1">

            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => navigate("/talento-humano/configuracion")}
            >
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>

                Regresar
              </span>
            </Button>

          </div>
        </form>
      </div>

      {/* MODAL DE RESULTADO (éxito o error) */}
      {resultado && (
        <Modal
          onClose={() => setResultado(null)}
          logo={
            resultado.exito ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="green"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="red"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )
          }
        >
          <span className="font-semibold">{resultado.mensaje}</span>
        </Modal>
      )}
    </div>
  );
}