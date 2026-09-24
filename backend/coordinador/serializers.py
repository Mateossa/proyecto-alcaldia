from datetime import datetime, timedelta, time
from rest_framework import serializers
from .models import SolicitudHorasExtras


CORTE_DIURNO_INICIO = time(6, 0)   # 6:00 a.m.
CORTE_DIURNO_FIN = time(21, 0)     # 9:00 p.m.


def calcular_horas_diurnas_nocturnas(hora_inicio, hora_fin):
    """
    Divide un rango horaInicio-horaFin en horas diurnas (6:00-21:00)
    y nocturnas (21:00-6:00), manejando el caso de que el rango cruce
    la medianoche.
    """
    base = datetime(2000, 1, 1)
    inicio = datetime.combine(base, hora_inicio)
    fin = datetime.combine(base, hora_fin)
    if fin <= inicio:
        fin += timedelta(days=1)  # el rango cruza la medianoche

    diurnas = timedelta()
    nocturnas = timedelta()
    actual = inicio

    while actual < fin:
        hora_actual = actual.time()
        es_diurno = CORTE_DIURNO_INICIO <= hora_actual < CORTE_DIURNO_FIN

        if es_diurno:
            limite = datetime.combine(actual.date(), CORTE_DIURNO_FIN)
        elif hora_actual >= CORTE_DIURNO_FIN:
            limite = datetime.combine(actual.date() + timedelta(days=1), CORTE_DIURNO_INICIO)
        else:
            limite = datetime.combine(actual.date(), CORTE_DIURNO_INICIO)

        siguiente = min(fin, limite)
        duracion = siguiente - actual

        if es_diurno:
            diurnas += duracion
        else:
            nocturnas += duracion

        actual = siguiente

    return (
        round(diurnas.total_seconds() / 3600, 2),
        round(nocturnas.total_seconds() / 3600, 2),
    )


class SolicitudHorasExtrasSerializer(serializers.ModelSerializer):
    docente_nombre = serializers.CharField(source="docente.nombre_completo", read_only=True)
    docente_numero_documento = serializers.CharField(source="docente.numero_documento", read_only=True)
    institucion_educativa_nombre = serializers.CharField(
        source="institucion_educativa.nombre", read_only=True
    )
    registrado_por_nombre = serializers.CharField(
        source="registrado_por.nombre_completo", read_only=True
    )

    class Meta:
        model = SolicitudHorasExtras
        fields = [
            "id", "docente", "docente_nombre", "docente_numero_documento",
            "institucion_educativa", "institucion_educativa_nombre",
            "horas_diurnas", "horas_nocturnas", "horas_situacion_administrativa",
            "fecha", "fecha_fin", "hora_inicio", "hora_fin", "descripcion",
            "anexo", "estado", "registrado_por", "registrado_por_nombre",
            "fecha_registro", "fecha_actualizacion",
        ]
        read_only_fields = [
            "horas_diurnas", "horas_nocturnas", "estado", "registrado_por",
            "fecha_registro", "fecha_actualizacion",
        ]

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["registrado_por"] = request.user

        hora_inicio = validated_data.get("hora_inicio")
        hora_fin = validated_data.get("hora_fin")

        if hora_inicio and hora_fin:
            diurnas, nocturnas = calcular_horas_diurnas_nocturnas(hora_inicio, hora_fin)

            fecha = validated_data.get("fecha")
            fecha_fin = validated_data.get("fecha_fin")
            dias = (fecha_fin - fecha).days + 1 if fecha_fin and fecha_fin >= fecha else 1

            validated_data["horas_diurnas"] = diurnas * dias
            validated_data["horas_nocturnas"] = nocturnas * dias

        return super().create(validated_data)