import { Button, Input } from "@/shared/components";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = "http://127.0.0.1:8000/api";

const ROL_ROUTES = {
  DOCENTE: "/docentes",
  RECTOR: "/rector",
  COORDINADOR: "/coordinador",
  TALENTO_HUMANO: "/talento-humano",
  TECNICO_TALENTO_HUMANO: "/tecnico-talento-humano",
};

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    numero_documento: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.numero_documento) {
      newErrors.numero_documento = "El número de documento es obligatorio";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero_documento: formData.numero_documento,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        setErrors({ password: "Credenciales inválidas" });
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Guardamos tokens y usuario logueado
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      const { rol, debe_cambiar_contrasena } = data.usuario;

      // DOCENTE con contraseña por cambiar tiene su propia ruta
      if (rol === "DOCENTE" && debe_cambiar_contrasena) {
        navigate("/docentes/cambiar-contrasena");
        return;
      }

      navigate(ROL_ROUTES[rol] ?? "/");
    } catch (err) {
      setErrors({ password: "No se pudo conectar con el servidor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="relative px-6 py-12 grid grid-cols-1 gap-2 bg-white shadow-2xl ring-1 ring-brand-soft/80 rounded-xl font-main w-94 h-auto"
      >
        <h1
          className="text-general-title font-extrabold text-center"
          style={{ color: "var(--color-brand-fort)" }}
        >
          Iniciar sesión
        </h1>

        <Input
          label="Número de documento"
          placeholder="Ingresa tu número de documento"
          name="numero_documento"
          value={formData.numero_documento}
          onChange={handleChange}
          error={errors.numero_documento}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="Ingresa tu contraseña"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Link
          to="/forgot-password"
          className="text-info-regular text-center underline text-brand-hover hover:font-extrabold"
        >
          ¿Olvidaste tu contraseña?
        </Link>

        <div className="flex items-center justify-center mt-4">
          <Button variant="secondary" size="md" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </div>
      </form>
    </div>
  );
}