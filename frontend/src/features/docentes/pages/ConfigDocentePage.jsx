import { useState } from "react";
import { StatusSwitch } from "@/shared/components/";

export default function ConfigDocentePage() {

  // Estado que controla el switch
  const [isActive, setIsActive] = useState(true);

  // Maneja el cambio enviado desde el switch
  const handleStatusChange = (value) => {
    setIsActive(value);

    // aquí normalmente iría una llamada a API para actualizar estado del docente
    console.log("Nuevo estado del docente:", value);
  };

  return (
    <div className="p-6 max-w-md space-y-4">

      <h2 className="text-lg font-semibold">
        Configuración de docente
      </h2>

      {/* Fila de configuración */}
      <div className="flex items-center justify-between border p-4 rounded-lg">

        <div>
          <p className="font-medium">Docente activo</p>
          <p className="text-sm text-gray-500">
            Permite que el docente pueda registrar solicitudes
          </p>
        </div>

        {/* Switch reutilizable */}
        <StatusSwitch
          checked={isActive}
          onChange={handleStatusChange}
          size="md"
        />

      </div>
    </div>
  );
}
