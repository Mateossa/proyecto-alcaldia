import { useState } from "react";
import { Input, Button } from "@/shared/components";

export default function CambiarContraForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "La nueva contraseña es obligatoria";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Debes confirmar la contraseña";
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData.password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <Input
        label="Nueva contraseña"
        type="password"
        name="password"
        placeholder="Ingresa tu nueva contraseña"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />

      <Input
        label="Confirmar contraseña"
        type="password"
        name="confirmPassword"
        placeholder="Confirma tu contraseña"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />

      <div className="flex justify-center pt-2">
        <Button
          variant="primary"
          size="sm"
          type="submit"
        >
          Confirmar
        </Button>
      </div>

    </form>
  );
}