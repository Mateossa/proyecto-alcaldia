// ─────────────────────────────────────────────
// ForgotPasswordForm.jsx
// Formulario para solicitar el código de recuperación
// Envía un código de 6 dígitos al email del usuario
// ─────────────────────────────────────────────

import { useState } from "react";
import { Button, Input } from "@/shared/components";
import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Por favor ingresa tu correo electrónico");
      return;
    }

    setLoading(true);

    try {
      // Enviamos el email a Django para que genere y envíe el código
      await axios.post(`${API_URL}/auth/solicitar-codigo/`, { email });

      // Guardamos el email en sessionStorage para usarlo en el siguiente paso
      sessionStorage.setItem('reset_email', email);

      // Navegamos a la página donde ingresa el código
      navigate("/reset-password");

    } catch (err) {
      setError(err.response?.data?.error || "Error al enviar el código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="bg-white w-102 p-6 rounded-lg shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="grid text-main justify-items-center text-main">
            <LockKeyhole className="flex items-center h-12 w-12 stroke-brand-hover" />
            <h1 className="text-brand-hover font-extrabold text-general-title">
              Recuperar contraseña
            </h1>
            <p className="text-secondary text-info-general text-center font-semibold py-6">
              Por favor ingrese el correo electrónico registrado para
              restablecer la contraseña.
            </p>
          </div>

          <div className="grid justify-items-center gap-6">
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Mensaje de error */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button variant="secondary" size="md" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar código"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}