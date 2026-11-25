from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import RegexValidator


class InstitucionEducativa(models.Model):
    nombre = models.CharField(max_length=200, unique=True)
    codigo_dane = models.CharField(max_length=20, blank=True, null=True, unique=True)
    direccion = models.CharField(max_length=255, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = "instituciones_educativas"
        verbose_name = "Institución Educativa"
        verbose_name_plural = "Instituciones Educativas"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Sede(models.Model):
    institucion_educativa = models.ForeignKey(
        InstitucionEducativa, on_delete=models.CASCADE, related_name="sedes"
    )
    nombre = models.CharField(max_length=150)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = "sedes"
        unique_together = ("institucion_educativa", "nombre")
        ordering = ["nombre"]

    def __str__(self):
        return f"{self.nombre} ({self.institucion_educativa.nombre})"


class UsuarioManager(BaseUserManager):
    def create_user(self, numero_documento, password=None, **extra_fields):
        if not numero_documento:
            raise ValueError("El número de documento es obligatorio")
        usuario = self.model(numero_documento=numero_documento, **extra_fields)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, numero_documento, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("rol", Usuario.Rol.TALENTO_HUMANO)
        extra_fields.setdefault("nombres", "Admin")
        extra_fields.setdefault("apellidos", "Sistema")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("El superusuario debe tener is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("El superusuario debe tener is_superuser=True")

        return self.create_user(numero_documento, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    class Rol(models.TextChoices):
        DOCENTE = "DOCENTE", "Docente"
        RECTOR = "RECTOR", "Rector"
        COORDINADOR = "COORDINADOR", "Coordinador"
        TALENTO_HUMANO = "TALENTO_HUMANO", "Talento Humano"
        TECNICO_TALENTO_HUMANO = "TECNICO_TALENTO_HUMANO", "Técnico Talento Humano"

    class TipoDocumento(models.TextChoices):
        CC = "CC", "Cédula de Ciudadanía"
        CE = "CE", "Cédula de Extranjería"
        TI = "TI", "Tarjeta de Identidad"

    documento_validator = RegexValidator(
        regex=r"^\d{5,15}$",
        message="El número de documento debe contener solo dígitos (5 a 15 caracteres)",
    )

    numero_documento = models.CharField(
        max_length=15,
        unique=True,
        validators=[documento_validator],
        db_index=True,
    )
    tipo_documento = models.CharField(
        max_length=2, choices=TipoDocumento.choices, default=TipoDocumento.CC
    )
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True)
    foto = models.ImageField(upload_to="usuarios/fotos/", blank=True, null=True)

    rol = models.CharField(max_length=30, choices=Rol.choices)
    institucion_educativa = models.ForeignKey(
        InstitucionEducativa,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="usuarios",
    )
    cargo = models.CharField(max_length=100, blank=True)

    debe_cambiar_contrasena = models.BooleanField(default=True)
    activo = models.BooleanField(default=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    creado_por = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="usuarios_creados"
    )

    objects = UsuarioManager()

    USERNAME_FIELD = "numero_documento"
    REQUIRED_FIELDS = ["nombres", "apellidos", "rol"]

    class Meta:
        db_table = "usuarios"
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ["apellidos", "nombres"]

    def __str__(self):
        return f"{self.nombres} {self.apellidos} ({self.get_rol_display()})"

    @property
    def nombre_completo(self):
        return f"{self.nombres} {self.apellidos}"


class CodigoRecuperacion(models.Model):
    """Código de 6 dígitos para restablecer la contraseña (se guarda cifrado)."""

    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="codigos_recuperacion"
    )
    codigo_hash = models.CharField(max_length=255,null=True,blank=True)
    creado = models.DateTimeField(auto_now_add=True)
    expira = models.DateTimeField(null=True,blank=True)
    intentos = models.PositiveSmallIntegerField(default=0)
    usado = models.BooleanField(default=False)

    class Meta:
        db_table = "codigos_recuperacion"
        ordering = ["-creado"]

    def __str__(self):
        return f"Código de {self.usuario.numero_documento} ({self.creado:%Y-%m-%d %H:%M})"