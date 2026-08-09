import { useState } from "react";
import { Button, Input } from "@/shared/components";

export default function AjustarTopesDocentesForm({ onSubmit }) {

  const [formData, setFormData] = useState({
    horas_diurnas: "",
    horas_nocturnas: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = {};

    if (!formData.horas_diurnas)
      nuevosErrores.horas_diurnas = "Campo obligatorio";

    if (!formData.horas_nocturnas)
      nuevosErrores.horas_nocturnas = "Campo obligatorio";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      <Input
        label="Horas extras diurnas"
        name="horas_diurnas"
        type="number"
        value={formData.horas_diurnas}
        onChange={handleChange}
        error={errors.horas_diurnas}
      />

      <Input
        label="Horas extras nocturnas"
        name="horas_nocturnas"
        type="number"
        value={formData.horas_nocturnas}
        onChange={handleChange}
        error={errors.horas_nocturnas}
      />

      <div className="flex justify-center pt-2">
        <Button
          variant="primary"
          size="sm"
          type="submit"
        >
          Guardar
        </Button>
      </div>

    </form>
  );
}