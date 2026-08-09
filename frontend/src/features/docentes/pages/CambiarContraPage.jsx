import { useNavigate } from "react-router-dom";
import CambiarContraForm from "../components/CambiarContraForm";

export default function CambiarContraPage() {
  const navigate = useNavigate();

  const handleChangePassword = async (password) => {
    console.log("Nueva contraseña docente:", password);

    // Aquí luego irá el servicio para cambiar la contraseña

    navigate("/docentes");
  };

  return (
    <div className="h-full min-h-0 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <div className="text-center mb-5">
          <h1
            className="text-general-title font-extrabold text-center leading-tight"
            style={{ color: "var(--color-brand-fort)" }}
          >
            Cambiar contraseña
          </h1>

          <p className="mt-3 text-gray-500 text-sm">
            Por seguridad, debes actualizar tu contraseña antes de continuar.
          </p>
        </div>

        <CambiarContraForm onSubmit={handleChangePassword} />

      </div>
    </div>
  );
}