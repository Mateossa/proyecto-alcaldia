from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, CambiarContrasenaView, UsuarioActualView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("login/refresh/", TokenRefreshView.as_view(), name="login-refresh"),
    path("login/cambiar-contrasena/", CambiarContrasenaView.as_view(), name="cambiar-contrasena"),
    path("login/me/", UsuarioActualView.as_view(), name="usuario-actual"),
]