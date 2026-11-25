from rest_framework import viewsets, permissions
from login.models import Usuario
from .models import TopeHorasExtras
from .serializers import TopeHorasExtrasSerializer


class EsTalentoHumanoOSoloLectura(permissions.BasePermission):
    """
    - Talento Humano: puede crear y editar topes.
    - Cualquier otro rol autenticado: solo lectura.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.rol == Usuario.Rol.TALENTO_HUMANO


class TopeHorasExtrasViewSet(viewsets.ModelViewSet):
    serializer_class = TopeHorasExtrasSerializer
    permission_classes = [EsTalentoHumanoOSoloLectura]

    def get_queryset(self):
        qs = TopeHorasExtras.objects.select_related("institucion_educativa", "actualizado_por")

        institucion_id = self.request.query_params.get("institucion_educativa")
        if institucion_id:
            qs = qs.filter(institucion_educativa_id=institucion_id)

        masivo = self.request.query_params.get("masivo")
        if masivo in ("1", "true", "True"):
            qs = qs.filter(institucion_educativa__isnull=True)

        return qs

    def perform_create(self, serializer):
        serializer.save(actualizado_por=self.request.user)

    def perform_update(self, serializer):
        serializer.save(actualizado_por=self.request.user)