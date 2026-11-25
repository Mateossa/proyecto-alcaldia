import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../../shared/layout/MainLayout";
import AuthLayout from "../../shared/layout/AuthLayout";
// import ProtectedRoute from "../../shared/components/ProtectedRoute";

// ================= DOCENTES =================
import DocentePage from "../../features/docentes/pages/DocentePage";
import ConfigDocentePage from "../../features/docentes/pages/ConfigDocentePage";
import ConsultasyReportesPage from "../../features/docentes/pages/ConsultasyReportesPage";
import CambiarContraPage from "../../features/docentes/pages/CambiarContraPage";

// ================= RECTOR =================
import RectorPage from "../../features/rector/pages/RectorPage";
import SolicitudesComputadasPage from "../../features/rector/pages/SolicitudesComputadasPage";

// ================= COORDINADOR =================
import CoordinadorPage from "../../features/coordinador/pages/CoordinadorPage";
import RegistrarHorasExtrasPage from "../../features/coordinador/pages/RegistrarHorasExtrasPage";
import CoordinadorReportesPage from "../../features/coordinador/pages/CoordinadorReportesPage";

// ================= TALENTO HUMANO =================
import TalentoHumanoPage from "../../features/talento-humano/pages/TalentoHumanoPage";
import ConfiguracionPage from "../../features/talento-humano/pages/ConfiguracionPage";
import CrearUsuarioPage from "../../features/talento-humano/pages/CrearUsuarioPage";
import AjustarTopesPage from "../../features/talento-humano/pages/AjustarTopesPage";
import AjustarTopesDocentesPage from "../../features/talento-humano/pages/AjustarTopesDocentesPage";

// ================= TÉCNICO TH =================
import TecnicoTalentoHumanoPage from "../../features/tecnico-talento-humano/pages/TecnicoTalentoHumanoPage";

// ================= AUTH =================
import LoginPage from "../../features/auth/pages/LoginPage";
import ForgotPasswordForm from "../../features/auth/components/ForgotPasswordForm";
import ResetPasswordForm from "../../features/auth/components/ResetPasswordForm";
import Loading from "../../shared/components/Loading";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      // ================= DOCENTES =================
      {
        path: "docentes",
        element: <DocentePage />,
      },
      {
        path: "config-docentes",
        element: <ConfigDocentePage />,
      },
      {
        path: "consultas-y-reportes",
        element: <ConsultasyReportesPage />,
      },
      {
        path: "docentes/cambiar-contrasena",
        element: <CambiarContraPage />,
      },

      // ================= RECTOR =================
      {
        path: "rector",
        element: <RectorPage />,
      },
      {
        path: "rector/reportes",
        element: <SolicitudesComputadasPage />,
      },

      // ================= COORDINADOR =================
      {
        path: "coordinador",
        element: <CoordinadorPage />,
      },
      {
        path: "coordinador/registrar-horas-extras",
        element: <RegistrarHorasExtrasPage />,
      },
      {
        path: "coordinador/reportes",
        element: <CoordinadorReportesPage />,
      },

      // ================= TALENTO HUMANO =================
      {
        path: "talento-humano",
        element: <TalentoHumanoPage />,
      },
      {
        path: "talento-humano/configuracion",
        element: <ConfiguracionPage />,
      },
      {
        path: "talento-humano/configuracion/crear-usuario",
        element: <CrearUsuarioPage />,
      },
      {
        path: "talento-humano/configuracion/ajustar-topes",
        element: <AjustarTopesPage />,
      },
      {
        path: "talento-humano/configuracion/ajustar-topes-docentes",
        element: <AjustarTopesDocentesPage />,
      },

      // ================= TÉCNICO TH =================
      {
        path: "tecnico-talento-humano",
        element: <TecnicoTalentoHumanoPage />,
      },
    ],
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordForm />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordForm />,
      },
      {
        path: "validation",
        element: <Loading />,
      },
    ],
  },
]);

export default router;