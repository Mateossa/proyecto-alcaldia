import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Modal from "../../../shared/components/Modal";

export default function AjustarTopesDocentesPage() {
  const navigate = useNavigate();

  const [horasDiurnas, setHorasDiurnas] = useState("");
  const [horasNocturnas, setHorasNocturnas] = useState("");

  const [showModal, setShowModal] = useState(false);

  const handleGuardar = (e) => {
    e.preventDefault();

    // Por ahora solo simulamos el guardado.
    // Más adelante aquí conectamos con el backend.
    console.log("Horas extras diurnas:", horasDiurnas);
    console.log("Horas extras nocturnas:", horasNocturnas);

    setShowModal(true);
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
            Ajustar Topes Docentes
          </h1>

          <p className="mt-0.5 text-xs text-gray-500">
            Configure las horas extras diurnas y nocturnas para todos los
            docentes.
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10v6"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7h.01"
            />
          </svg>

          <p className="text-xs text-blue-700 text-center flex-1">
            Los valores configurados se aplicarán de forma masiva a todos
            los docentes.
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleGuardar} className="space-y-1.5">

          {/* HORAS DIURNAS */}
          <Input
            label="Horas extras diurnas"
            type="number"
            min="0"
            value={horasDiurnas}
            onChange={(e) => setHorasDiurnas(e.target.value)}
            placeholder="Ingrese las horas"
          />

          {/* HORAS NOCTURNAS */}
          <Input
            label="Horas extras nocturnas"
            type="number"
            min="0"
            value={horasNocturnas}
            onChange={(e) => setHorasNocturnas(e.target.value)}
            placeholder="Ingrese las horas"
          />

          {/* BOTONES */}
          <div className="flex flex-col items-center gap-1 pt-1">

            <Button
              variant="primary"
              size="sm"
              type="submit"
            >
              Guardar
            </Button>

            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() =>
                navigate("/talento-humano/configuracion")
              }
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

      {/* MODAL DE ÉXITO */}
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          logo={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="green"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          }
        >
          <span className="font-semibold">
            Los topes para los docentes fueron actualizados con éxito.
          </span>
        </Modal>
      )}
    </div>
  );
}