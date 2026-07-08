// ─────────────────────────────────────────────
// ResetPasswordForm.jsx
// Formulario para verificar el código y cambiar la contraseña
// Recibe el código de 6 dígitos y la nueva contraseña
// ─────────────────────────────────────────────

import { useState } from "react";
import { UserRoundKey } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TokenValidation from "./TokenValidation";
import { Button, Input } from "@/shared/components";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  // Array de 6 dígitos para el código
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Paso actual — 1: verificar código, 2: nueva contraseña
  const [paso, setPaso] = useState(1);

  // Obtenemos el email guardado en el paso anterior
  const email = sessionStorage.getItem('reset_email');

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    setError(null);

    const codigoCompleto = codigo.join('');
    if (codigoCompleto.length < 6) {
      setError("Por favor ingresa el código completo");
      return;
    }

    setLoading(true);
    try {
      // Verificamos el código con Django
      await axios.post(`${API_URL}/auth/verificar-codigo/`, {
        email,
        codigo: codigoCompleto
      });

      // Si el código es correcto pasamos al paso 2
      setPaso(2);
    } catch (err) {
      setError(err.response?.data?.error || "Código incorrecto");
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarContrasena = async (e) => {
    e.preventDefault();
    setError(null);

    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (nuevaContrasena.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      // Cambiamos la contraseña en Django
      await axios.post(`${API_URL}/auth/cambiar-contrasena/`, {
        email,
        codigo: codigo.join(''),
        nueva_contrasena: nuevaContrasena
      });

      // Limpiamos el email del sessionStorage
      sessionStorage.removeItem('reset_email');

      // Redirigimos al login
      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.error || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="bg-white w-102 p-6 rounded-lg shadow-2xl">

        {/* Paso 1 — Verificar código */}
        {paso === 1 && (
          <form onSubmit={handleVerificarCodigo}>
            <div className="grid text-main justify-items-center">
              <UserRoundKey className="flex items-center h-12 w-12 stroke-brand-hover" />
              <h1 className="text-brand-hover font-extrabold text-info-general">
                Restablecimiento de contraseña
              </h1>
              <p className="text-secondary text-info-general text-center font-light py-6">
                Ingresa el <strong className="font-bold">código</strong> enviado a
                tu correo electrónico
              </p>
            </div>
            <div className="grid justify-items-center gap-6">
              <TokenValidation codigo={codigo} setCodigo={setCodigo} />

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button variant="secondary" size="md" type="submit" disabled={loading}>
                {loading ? "Verificando..." : "Validar código"}
              </Button>
            </div>
          </form>
        )}

        {/* Paso 2 — Nueva contraseña */}
        {paso === 2 && (
          <form onSubmit={handleCambiarContrasena}>
            <div className="grid text-main justify-items-center">
              <UserRoundKey className="flex items-center h-12 w-12 stroke-brand-hover" />
              <h1 className="text-brand-hover font-extrabold text-info-general">
                Nueva contraseña
              </h1>
              <p className="text-secondary text-info-general text-center font-light py-6">
                Ingresa tu nueva contraseña
              </p>
            </div>
            <div className="grid justify-items-center gap-4 w-full">
              <Input
                type="password"
                placeholder="Nueva contraseña"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
              />

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button variant="secondary" size="md" type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Cambiar contraseña"}
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}