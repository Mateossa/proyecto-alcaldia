from rest_framework import viewsets, permissions
from .models import Ausentismo
from .serializers import AusentismoSerializer
from login.models import Usuario


class EsDocenteOSoloLectura(permissions.BasePermission):
    """
    - Docente: puede crear y ver solo sus propios ausentismos.
    - Rector/Coordinador/Talento Humano/Técnico TH: solo lectura, ven todo.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.rol == Usuario.Rol.DOCENTE

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.docente_id == request.user.id


class AusentismoViewSet(viewsets.ModelViewSet):
    serializer_class = AusentismoSerializer
    permission_classes = [EsDocenteOSoloLectura]

    def get_queryset(self):
        user = self.request.user
        qs = Ausentismo.objects.select_related("docente", "institucion_educativa")

        if user.rol == Usuario.Rol.DOCENTE:
            return qs.filter(docente=user)

        # Rector/Coordinador/TH ven todo (ajustamos filtros por IE más adelante si aplica)
        return qs