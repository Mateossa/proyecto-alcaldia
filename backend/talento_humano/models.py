from django.db import models
from login.models import InstitucionEducativa, Usuario

TIPOS_HORA_EXTRA = [
    "COMPLEMENTO ASIGN ACADEMICA",
    "JORNADA UNICA",
    "EDUCACION DE ADULTOS / DOCENTES",
    "APOYO CORD JOR. NOC",
    "METODOLOGIA GEMPA",
    "VALIDACIONES",
    "OTROS PROG AUTORIZADOS POR LA SE",
]


class TopeHorasExtras(models.Model):
    """
    institucion_educativa = None -> tope masivo (AjustarTopesDocentesPage)
    institucion_educativa = <IE> -> tope de una sola IE (Ajustar topes por IE)
    fecha_inicio / fecha_fin    -> periodo en que rigen esas horas
    tipo_hora_extra             -> tipo de hora extra del tope por IE
    """
    institucion_educativa = models.ForeignKey(
        InstitucionEducativa,
        on_delete=models.CASCADE,
        related_name="topes_horas_extras",
        null=True,
        blank=True,
        help_text="Vacío = aplica de forma masiva a todas las instituciones",
    )
    tipo_hora_extra = models.CharField(
        max_length=60,
        choices=[(tipo, tipo) for tipo in TIPOS_HORA_EXTRA],
        blank=True,
        default="",
    )
    horas_diurnas = models.DecimalField(max_digits=5, decimal_places=2)
    horas_nocturnas = models.DecimalField(max_digits=5, decimal_places=2)
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)
    vigente_desde = models.DateField(auto_now_add=True)
    actualizado_por = models.ForeignKey(
        Usuario, on_delete=models.SET_NULL, null=True, related_name="topes_ajustados"
    )

    class Meta:
        db_table = "topes_horas_extras"
        ordering = ["-vigente_desde"]

    def __str__(self):
        ie = self.institucion_educativa.nombre if self.institucion_educativa else "Todas las IE"
        return f"Tope {ie}: {self.horas_diurnas}h diurnas / {self.horas_nocturnas}h nocturnas"