from django.core.management.base import BaseCommand
from login.models import Usuario


class Command(BaseCommand):
    help = "Crea usuarios de prueba para cada rol (Docente, Rector, Coordinador, Técnico TH)."

    def handle(self, *args, **options):
        usuarios_prueba = [
            {
                "numero_documento": "1000000002",
                "nombres": "Docente",
                "apellidos": "Demo",
                "rol": Usuario.Rol.DOCENTE,
            },
            {
                "numero_documento": "1000000003",
                "nombres": "Rector",
                "apellidos": "Demo",
                "rol": Usuario.Rol.RECTOR,
            },
            {
                "numero_documento": "1000000004",
                "nombres": "Coordinador",
                "apellidos": "Demo",
                "rol": Usuario.Rol.COORDINADOR,
            },
            {
                "numero_documento": "1000000005",
                "nombres": "Tecnico",
                "apellidos": "Talento Humano Demo",
                "rol": Usuario.Rol.TECNICO_TALENTO_HUMANO,
            },
        ]

        for datos in usuarios_prueba:
            if Usuario.objects.filter(numero_documento=datos["numero_documento"]).exists():
                self.stdout.write(self.style.WARNING(
                    f"Ya existe: {datos['numero_documento']} ({datos['rol']}) — se omite."
                ))
                continue

            Usuario.objects.create_user(
                numero_documento=datos["numero_documento"],
                password="Demo2026*",
                nombres=datos["nombres"],
                apellidos=datos["apellidos"],
                rol=datos["rol"],
                debe_cambiar_contrasena=False,
            )
            self.stdout.write(self.style.SUCCESS(
                f"Creado: {datos['numero_documento']} — {datos['rol']}"
            ))