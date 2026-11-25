from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView,
    CambiarContrasenaView,
    UsuarioActualView,
    InstitucionEducativaListView,
    SedeListView,
    BuscarDocenteView,
    SolicitarCodigoView,
    VerificarCodigoView,
    CambiarContrasenaConCodigoView,
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("login/refresh/", TokenRefreshView.as_view(), name="login-refresh"),
    path("login/cambiar-contrasena/", CambiarContrasenaView.as_view(), name="cambiar-contrasena"),
    path("login/me/", UsuarioActualView.as_view(), name="usuario-actual"),
    path("instituciones-educativas/", InstitucionEducativaListView.as_view(), name="instituciones-list"),
    path("sedes/", SedeListView.as_view(), name="sedes-list"),
    path("docentes/buscar/", BuscarDocenteView.as_view(), name="buscar-docente"),

    # Restablecer contraseña con código enviado al correo
    path("auth/solicitar-codigo/", SolicitarCodigoView.as_view(), name="solicitar-codigo"),
    path("auth/verificar-codigo/", VerificarCodigoView.as_view(), name="verificar-codigo"),
    path("auth/cambiar-contrasena/", CambiarContrasenaConCodigoView.as_view(), name="cambiar-contrasena-con-codigo"),
]