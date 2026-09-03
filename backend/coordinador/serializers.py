from rest_framework import serializers
from .models import SolicitudHorasExtras


class SolicitudHorasExtrasSerializer(serializers.ModelSerializer):
    docente_nombre = serializers.CharField(source="docente.nombre_completo", read_only=True)
    institucion_educativa_nombre = serializers.CharField(
        source="institucion_educativa.nombre", read_only=True
    )
    registrado_por_nombre = serializers.CharField(
        source="registrado_por.nombre_completo", read_only=True
    )

    class Meta:
        model = SolicitudHorasExtras
        fields = [
            "id", "docente", "docente_nombre", "institucion_educativa",
            "institucion_educativa_nombre", "horas_diurnas", "horas_nocturnas",
            "horas_situacion_administrativa", "fecha", "anexo", "estado",
            "registrado_por", "registrado_por_nombre", "fecha_registro",
            "fecha_actualizacion",
        ]
        read_only_fields = [
            "estado", "registrado_por", "fecha_registro", "fecha_actualizacion",
        ]

    def create(self, validated_data):
        # El coordinador logueado se asigna automáticamente como quien registró la solicitud
        request = self.context["request"]
        validated_data["registrado_por"] = request.user
        return super().create(validated_data)