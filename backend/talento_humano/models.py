from django.db import models
from login.models import InstitucionEducativa, Usuario


class TopeHorasExtras(models.Model):
    """
    institucion_educativa = None -> tope masivo (AjustarTopesDocentesPage)
    institucion_educativa = <IE> -> tope de una sola IE (base del reporte de Coordinador)
    """
    institucion_educativa = models.ForeignKey(
        InstitucionEducativa,
        on_delete=models.CASCADE,
        related_name="topes_horas_extras",
        null=True,
        blank=True,
        help_text="Vacío = aplica de forma masiva a todas las instituciones",
    )
    horas_diurnas = models.DecimalField(max_digits=5, decimal_places=2)
    horas_nocturnas = models.DecimalField(max_digits=5, decimal_places=2)
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