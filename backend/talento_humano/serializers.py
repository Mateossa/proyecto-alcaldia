from rest_framework import serializers
from .models import TopeHorasExtras


class TopeHorasExtrasSerializer(serializers.ModelSerializer):
    institucion_educativa_nombre = serializers.SerializerMethodField()
    actualizado_por_nombre = serializers.SerializerMethodField()
    es_masivo = serializers.SerializerMethodField()

    class Meta:
        model = TopeHorasExtras
        fields = [
            "id", "institucion_educativa", "institucion_educativa_nombre",
            "es_masivo", "tipo_hora_extra", "horas_diurnas", "horas_nocturnas",
            "fecha_inicio", "fecha_fin", "vigente_desde",
            "actualizado_por", "actualizado_por_nombre",
        ]
        read_only_fields = ["vigente_desde", "actualizado_por"]
        extra_kwargs = {
            "horas_diurnas": {"min_value": 0},
            "horas_nocturnas": {"min_value": 0},
        }

    def get_institucion_educativa_nombre(self, obj):
        return obj.institucion_educativa.nombre if obj.institucion_educativa else None

    def get_actualizado_por_nombre(self, obj):
        return obj.actualizado_por.nombre_completo if obj.actualizado_por else None

    def get_es_masivo(self, obj):
        return obj.institucion_educativa_id is None

    def validate(self, attrs):
        inicio = attrs.get("fecha_inicio", getattr(self.instance, "fecha_inicio", None))
        fin = attrs.get("fecha_fin", getattr(self.instance, "fecha_fin", None))
        if inicio and fin and fin < inicio:
            raise serializers.ValidationError(
                {"fecha_fin": "La fecha fin no puede ser anterior a la fecha inicio."}
            )
        return attrs