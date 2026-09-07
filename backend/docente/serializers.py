from rest_framework import serializers
from .models import Ausentismo
from login.models import Usuario, InstitucionEducativa


class AusentismoSerializer(serializers.ModelSerializer):
    docente_nombre = serializers.CharField(source="docente.nombre_completo", read_only=True)
    institucion_educativa_nombre = serializers.CharField(
        source="institucion_educativa.nombre", read_only=True
    )

    class Meta:
        model = Ausentismo
        fields = [
            "id", "docente", "docente_nombre", "institucion_educativa",
            "institucion_educativa_nombre", "sede", "motivo", "fecha_inicio",
            "fecha_fin", "hora_inicio", "hora_fin", "descripcion", "anexo",
            "estado", "fecha_registro", "fecha_actualizacion", "revisado_por",
        ]
        read_only_fields = ["docente", "estado", "revisado_por", "fecha_registro", "fecha_actualizacion"]

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["docente"] = request.user
        return super().create(validated_data)