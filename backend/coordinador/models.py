from django.db import models
from login.models import Usuario, InstitucionEducativa


class SolicitudHorasExtras(models.Model):
    class Estado(models.TextChoices):
        PENDIENTE = "PENDIENTE", "Pendiente"
        APROBADO = "APROBADO", "Aprobado"
        RECHAZADO = "RECHAZADO", "Rechazado"

    docente = models.ForeignKey(
        Usuario, on_delete=models.PROTECT, related_name="solicitudes_horas_extras",
        limit_choices_to={"rol": Usuario.Rol.DOCENTE},
    )
    institucion_educativa = models.ForeignKey(
        InstitucionEducativa, on_delete=models.PROTECT, related_name="solicitudes_horas_extras"
    )
    horas_diurnas = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    horas_nocturnas = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    horas_situacion_administrativa = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    fecha = models.DateField()
    anexo = models.FileField(upload_to="horas_extras/anexos/%Y/%m/", blank=True, null=True)
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PENDIENTE)
    registrado_por = models.ForeignKey(
        Usuario, on_delete=models.SET_NULL, null=True, related_name="solicitudes_registradas",
        limit_choices_to={"rol": Usuario.Rol.COORDINADOR},
    )
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "solicitudes_horas_extras"
        ordering = ["-fecha_registro"]

    def __str__(self):
        return f"Horas extras {self.docente.nombre_completo} — {self.fecha}"