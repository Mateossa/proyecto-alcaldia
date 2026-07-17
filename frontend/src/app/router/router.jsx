import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../../shared/layout/MainLayout";
import AuthLayout from "../../shared/layout/AuthLayout";
// import ProtectedRoute from "../../shared/components/ProtectedRoute";

// Páginas de docentes
import DocentePage from "../../features/docentes/pages/DocentePage";
import ConfigDocentePage from "../../features/docentes/pages/ConfigDocentePage";
import ConsultasyReportesPage from "../../features/docentes/pages/ConsultasyReportesPage";

// Página de Rectores
import SolicitudesComputadasPage from "../../features/rector/pages/SolicitudesComputadasPage";

// Página de Coordinadores
import CoordinadorPage from "../../features/coordinador/pages/CoordinadorPage";
import RegistrarHorasExtrasPage from "../../features/coordinador/pages/RegistrarHorasExtrasPage";
import CoordinadorReportesPage from "../../features/coordinador/pages/CoordinadorReportesPage";

// Página de Talento Humano
import TalentoHumanoPage from "../../features/talento-humano/pages/TalentoHumanoPage";
import ConfiguracionPage from "../../features/talento-humano/pages/ConfiguracionPage";
import CrearUsuarioPage from "../../features/talento-humano/pages/CrearUsuarioPage";

// Página de Técnico Talento Humano
import TecnicoTalentoHumanoPage from "../../features/tecnico-talento-humano/pages/TecnicoTalentoHumanoPage";

// Auth
import LoginPage from "../../features/auth/pages/LoginPage";
import ForgotPasswordForm from "../../features/auth/components/ForgotPasswordForm";
import ResetPasswordForm from "../../features/auth/components/ResetPasswordForm";
import Loading from "../../shared/components/Loading";
import ConfirmationPassword from "../../features/auth/components/ConfirmationPassword";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "docentes",
        element: (
          // <ProtectedRoute rolesPermitidos={[2]}>
            <DocentePage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "config-docentes",
        element: (
          // <ProtectedRoute rolesPermitidos={[2]}>
            <ConfigDocentePage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "consultas-y-reportes",
        element: (
          // <ProtectedRoute rolesPermitidos={[2]}>
            <ConsultasyReportesPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "rector",
        element: (
          // <ProtectedRoute rolesPermitidos={[2]}>
            <SolicitudesComputadasPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "coordinador",
        element: (
          // <ProtectedRoute rolesPermitidos={[3]}>
            <CoordinadorPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "coordinador/registrar-horas-extras",
        element: (
          // <ProtectedRoute rolesPermitidos={[3]}>
            <RegistrarHorasExtrasPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "coordinador/reportes",
        element: (
          // <ProtectedRoute rolesPermitidos={[3]}>
            <CoordinadorReportesPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "talento-humano",
        element: (
          // <ProtectedRoute rolesPermitidos={[4]}>
            <TalentoHumanoPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "talento-humano/configuracion",
        element: (
          // <ProtectedRoute rolesPermitidos={[4]}>
            <ConfiguracionPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "talento-humano/configuracion/crear-usuario",
        element: (
          // <ProtectedRoute rolesPermitidos={[4]}>
            <CrearUsuarioPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "tecnico-talento-humano",
        element: (
          // <ProtectedRoute rolesPermitidos={[5]}>
            <TecnicoTalentoHumanoPage />
          // </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/", // ruta inicial
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
      {
        path: "validationPassword",
        element: <ConfirmationPassword />,
      },
    ],
  },
]);

export default router;
