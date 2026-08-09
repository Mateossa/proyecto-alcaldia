// import Navbar from "./Navbar";
// import { Outlet } from "react-router-dom";

// export default function MainLayout() {
//     return (
//     <div className="min-h-screen flex flex-col">
//       {/* Barra superior institucional */}
//         <Navbar variant="solid" />

//       {/* Contenido externo que se inyecta */}
//     <main className="relative flex-1 flex items-start justify-center overflow-y-auto">
//         <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{ backgroundImage: `url('/images/background.webp')` }}
//         />
//         <div className="absolute inset-0 bg-white/30" />
//         <div className="relative z-10 flex flex-col items-center w-full">
//             <Outlet />
//         </div>
//         </main>
//     </div>
//     );
// }
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen h-screen flex flex-col overflow-hidden">

      {/* Barra superior institucional */}
      <Navbar variant="solid" />

      {/* Contenido */}
      <main className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden">

        {/* Fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/background.webp')`,
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-white/30" />

        {/* Página */}
        <div className="relative z-10 w-full h-full flex items-center justify-center overflow-y-auto">
          <Outlet />
        </div>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}