// ─────────────────────────────────────────────
// axiosConfig.js
// Configura axios para enviar el token JWT
// en cada petición y detectar cuando expira
// ─────────────────────────────────────────────

import axios from "axios";

// Verifica si la sesión ha expirado según el tiempo del rol
const sesionExpirada = () => {
    const expiracion = localStorage.getItem('expiracion');
    if (!expiracion) return false;

    const ahora = new Date();
    const fechaExpiracion = new Date(expiracion);
    
    return ahora >= fechaExpiracion;
};

//Limpia el localStorage y redirege al login
const cerrarSesion = () => {
    const usuario = localStorage.getItem('usuario');
    const usuarioData = usuario ? JSON.parse(usuario) : null;
    const idRol = usuarioData?.id_rol;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('expiracion');
    localStorage.removeItem('horas_sesion');
    localStorage.removeItem('permisos');

    //Redirigir según el rol
    if (idRol === 1 || idRol === 3){
        window.location.href = '/auth/login';
    } else {
        window.location.href = '/';
    }
}

// Interceptor de peticiones - verifica la sesión antes de cada request
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        const esIntentLogin = config.url?.includes('/auth/login/');
        const esRutaPublica = config.url?.includes('/tipo-documento/') || 
                                config.url?.includes('/usuarios/') ||
                                esIntentLogin;

        if (token) {
            // Si la sesión expiró cerramos antes de hacer la petición
            // pero solo si no es una ruta pública
            if (sesionExpirada() && !esRutaPublica) {
                cerrarSesion();
                return Promise.reject(new Error('Sesion expirada'));
            }
            // Agregamos el token al header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de respuestas - detecta errores de autenticación
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si es 401 pero es un intento de login no redirigimos
        const esIntentLogin = error.config?.url?.includes('/auth/login/');

        if (error.response?.status === 401 && !esIntentLogin) {
            cerrarSesion();
        }
        return Promise.reject(error);
    }
);

export default axios;