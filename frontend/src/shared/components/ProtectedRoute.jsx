// ─────────────────────────────────────────────
// ProtectedRoute.jsx
// Componente que protege las rutas del sistema
// Verifica autenticación, roles y permisos
// ─────────────────────────────────────────────

import { Navigate } from "react-router-dom";
import { estaAutenticado, getUsuarioActual, tienePermiso } from "../../features/auth/services/authService";

export default function ProtectedRoute ({ children, rolesPermitidos, permisosRequeridos }) {

    const autenticado = estaAutenticado();
    const usuario = getUsuarioActual();
    const ES_ADMIN = usuario?.id_rol === 1;

    // Si no está autenticado lo mandamos al login
    if (!autenticado) {
        return <Navigate to="/login" replace/>;
    }

    // Si se especificaron roles permitidos verificamos el rol
    if (rolesPermitidos && !rolesPermitidos.includes(usuario?.id_rol)) {
        return <Navigate to="/DashboardMain" replace />;
    }

    //El admin siempre pasa - no necesita verificar permisos
    if (ES_ADMIN) return children

    // Si se especificaron permisos requeridos verificamos cada uno
    // El admin siempre pasa — tienePermiso ya lo maneja internamente
    if (permisosRequeridos) {
        const tieneAcceso = permisosRequeridos.some(permiso => tienePermiso(permiso));
        if (!tieneAcceso) {
            return <Navigate to="/DashboardMain" replace />;
        }
    }

    return children;
}