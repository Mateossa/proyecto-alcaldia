from rest_framework import viewsets, permissions
from .models import SolicitudHorasExtras
from .serializers import SolicitudHorasExtrasSerializer
from login.models import Usuario


class EsCoordinadorOSoloLectura(permissions.BasePermission):
    """
    - Coordinador: puede crear y editar solo las solicitudes que él mismo registró.
    - Rector/Talento Humano/Técnico TH: solo lectura, ven todo.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.rol == Usuario.Rol.COORDINADOR

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.registrado_por_id == request.user.id


class SolicitudHorasExtrasViewSet(viewsets.ModelViewSet):
    serializer_class = SolicitudHorasExtrasSerializer
    permission_classes = [EsCoordinadorOSoloLectura]

    def get_queryset(self):
        user = self.request.user
        qs = SolicitudHorasExtras.objects.select_related(
            "docente", "institucion_educativa", "registrado_por"
        )

        if user.rol == Usuario.Rol.COORDINADOR:
            return qs.filter(registrado_por=user)

        # Rector/TH/Técnico TH ven todo
        return qs