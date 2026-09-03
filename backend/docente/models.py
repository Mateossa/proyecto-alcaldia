from django.db import models
from django.core.validators import FileExtensionValidator
from login.models import Usuario, InstitucionEducativa


class Ausentismo(models.Model):
    class Estado(models.TextChoices):
        PENDIENTE = "PENDIENTE", "Pendiente"
        APROBADO = "APROBADO", "Aprobado"
        RECHAZADO = "RECHAZADO", "Rechazado"

    docente = models.ForeignKey(
        Usuario, on_delete=models.PROTECT, related_name="ausentismos",
        limit_choices_to={"rol": Usuario.Rol.DOCENTE},
    )
    institucion_educativa = models.ForeignKey(
        InstitucionEducativa, on_delete=models.PROTECT, related_name="ausentismos"
    )
    sede = models.ForeignKey(
        "login.Sede", on_delete=models.SET_NULL, null=True, blank=True, related_name="ausentismos"
    )
    motivo = models.CharField(max_length=255)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    hora_inicio = models.TimeField(null=True, blank=True)
    hora_fin = models.TimeField(null=True, blank=True)
    descripcion = models.TextField(blank=True)
    anexo = models.FileField(
        upload_to="ausentismos/anexos/%Y/%m/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["pdf", "jpg", "jpeg", "png"])],
    )
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PENDIENTE)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    revisado_por = models.ForeignKey(
        Usuario, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="ausentismos_revisados",
    )

    class Meta:
        db_table = "ausentismos"
        ordering = ["-fecha_registro"]

    def __str__(self):
        return f"Ausentismo {self.docente.nombre_completo} — {self.fecha_inicio} a {self.fecha_fin}"