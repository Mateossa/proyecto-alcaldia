
// import { Button, Input, Modal } from "@/shared/components";
// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";

// export default function LoginForm() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     numero_documento: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     if (!formData.numero_documento) newErrors.numero_documento = "El número de documento es obligatorio";
//     if (!formData.password) newErrors.password = "La contraseña es obligatoria";
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     navigate("/docentes");
//   };

//   return (
//     <div>
//       <form
//         onSubmit={handleSubmit}
//         className="relative px-6 py-12 grid grid-cols-1 gap-2 bg-white shadow-2xl ring-1 ring-brand-soft/80 rounded-xl font-main w-94 h-auto"
//       >
//         <h1
//           className="text-general-title font-extrabold text-center"
//           style={{ color: "var(--color-brand-fort)" }}
//         >
//           Iniciar sesión
//         </h1>

//         <Input
//           label="Número de documento"
//           placeholder="Ingresa tu número de documento"
//           name="numero_documento"
//           value={formData.numero_documento}
//           onChange={handleChange}
//           error={errors.numero_documento}
//         />

//         <Input
//           label="Contraseña"
//           type="password"
//           placeholder="Ingresa tu contraseña"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           error={errors.password}
//         />

//         <Link
//           to="/forgot-password"
//           className="text-info-regular text-center underline text-brand-hover hover:font-extrabold"
//         >
//           ¿Olvidaste tu contraseña?
//         </Link>

//         <div className="flex items-center justify-center mt-4">
//           <Button variant="secondary" size="md" type="submit">
//             Ingresar
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
import { Button, Input, Modal } from "@/shared/components";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// 🔧 Usuarios de prueba mientras no hay backend.
// Cuando conectes la API, esto se reemplaza por la respuesta real del login.
const MOCK_USERS = {
  "1000000001": { password: "1234", rol: 1, nombre: "Docente Demo" },
  "1000000002": { password: "1234", rol: 2, nombre: "Rector Demo" },
  "1000000003": { password: "1234", rol: 3, nombre: "Coordinador Demo" },
};

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    numero_documento: "",
    password: "",
  });

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

    // 🔧 Cuando tengas backend, reemplaza este bloque por el fetch/POST real de login
    const user = MOCK_USERS[formData.numero_documento];
    if (!user || user.password !== formData.password) {
      setErrors({ password: "Credenciales inválidas" });
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    if (user.rol === 2) {
      navigate("/rector");
    } else if (user.rol === 3) {
      navigate("/coordinador");
    } else {
      navigate("/docentes");
    }
  };

  return (
    <div>
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
          <Button variant="secondary" size="md" type="submit">
            Ingresar
          </Button>
        </div>
      </form>
    </div>
  );
}