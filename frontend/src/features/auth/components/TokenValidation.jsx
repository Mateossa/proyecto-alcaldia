// ─────────────────────────────────────────────
// TokenValidation.jsx
// Inputs para ingresar el código de 6 dígitos
// Navega automáticamente al siguiente input
// ─────────────────────────────────────────────

import { useRef } from "react";

export default function TokenValidation({ codigo, setCodigo }) {

  // Referencias para cada input — permite enfocar el siguiente automáticamente
  const refs = [
    useRef(), useRef(), useRef(),
    useRef(), useRef(), useRef()
  ];

  const handleChange = (index, value) => {
    // Solo acepta un dígito numérico
    if (!/^\d*$/.test(value)) return;

    const nuevoCodigo = [...codigo];
    nuevoCodigo[index] = value.slice(-1); // Solo el último carácter
    setCodigo(nuevoCodigo);

    // Si ingresó un dígito, avanza al siguiente input
    if (value && index < 5) {
      refs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Si borra y el input está vacío, retrocede al anterior
    if (e.key === 'Backspace' && !codigo[index] && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  return (
    <div className="grid grid-rows-1">
      <div className="flex">
        <div className="grid grid-cols-6 gap-4">
          {codigo.map((digito, index) => (
            <input
              key={index}
              ref={refs[index]}
              type="text"
              value={digito}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              className="w-10 h-10 border-2 border-brand-hover rounded-sm p-3 text-main text-2xl text-center"
            />
          ))}
        </div>
      </div>
    </div>
  );
}