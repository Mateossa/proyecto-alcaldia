import { Button, Input } from "@/shared/components";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const MOCK_USERS = {
  "1000000001": { password: "1234", rol: 1, nombre: "Docente Demo" },
  "1000000002": { password: "1234", rol: 2, nombre: "Rector Demo" },
  "1000000003": { password: "1234", rol: 3, nombre: "Coordinador Demo" },
  "1000000004": { password: "1234", rol: 4, nombre: "Talento Humano Demo" },
  "1000000005": { password: "1234", rol: 5, nombre: "Técnico Talento Humano Demo" },
};

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ numero_documento: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.numero_documento) newErrors.numero_documento = "El número de documento es obligatorio";
    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const user = MOCK_USERS[formData.numero_documento];
    if (!user || user.password !== formData.password) {
      setErrors({ password: "Credenciales inválidas" });
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    if (user.rol === 2) navigate("/rector");
    else if (user.rol === 3) navigate("/coordinador");
    else if (user.rol === 4) navigate("/talento-humano");
    else if (user.rol === 5) navigate("/tecnico-talento-humano");
    else navigate("/docentes");
  };

  return (
    <div className="relative flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="relative px-6 py-12 grid grid-cols-1 gap-2 bg-white shadow-2xl ring-1 ring-brand-soft/80 rounded-xl font-main w-94 h-auto"
      >
        {/* Logo arriba a la izquierda */}
        <div className="flex justify-start mb-4">
          <img
            src="/images/logo_azul_alcaldia.png"
            alt="Logo GOV.CO"
            className="h-10"
          />
        </div>

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
          <Button variant="secondary" size="md" type="submit">
            Ingresar
          </Button>
        </div>
      </form>
    </div>
  );
}
