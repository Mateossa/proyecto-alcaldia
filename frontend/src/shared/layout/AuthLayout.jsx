import { Outlet, useLocation } from "react-router-dom";

export default function AuthLayout() {
  const blurPages = [
    "/forgot-password",
    "/reset-password",
    "/validation",
    "/confirmationPassword",
    "/validationPassword",
  ];

  const location = useLocation();
  const isBlur = blurPages.includes(location.pathname);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      
      {/* Fondo institucional a pantalla completa */}
      <div
        className={`absolute inset-0 bg-cover bg-center ${isBlur ? "blur-sm" : ""}`}
        style={{ backgroundImage: `url('/images/background.webp')` }}
      />

      {/* Overlay oscuro suave */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Logo GOV.CO arriba a la izquierda */}
      <div className="absolute top-4 left-4 z-10">
        <img src="/images/logo_footer_alcaldia.png" alt="GOV.CO" className="h-10" />
      </div>

      {/* Contenido centrado */}
      <main className="relative z-10 h-full flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}