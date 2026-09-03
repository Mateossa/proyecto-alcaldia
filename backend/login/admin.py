from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, InstitucionEducativa, Sede


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario
    list_display = (
        "numero_documento", "nombres", "apellidos", "rol",
        "institucion_educativa", "activo", "is_staff",
    )
    list_filter = ("rol", "activo", "institucion_educativa")
    search_fields = ("numero_documento", "nombres", "apellidos", "email")
    ordering = ("apellidos", "nombres")

    fieldsets = (
        (None, {"fields": ("numero_documento", "password")}),
        ("Información personal", {
            "fields": (
                "tipo_documento", "nombres", "apellidos", "email",
                "telefono", "foto",
            )
        }),
        ("Rol y ubicación", {
            "fields": ("rol", "institucion_educativa", "cargo")
        }),
        ("Estado", {
            "fields": (
                "activo", "debe_cambiar_contrasena", "is_active",
                "is_staff", "is_superuser", "groups", "user_permissions",
            )
        }),
        ("Fechas", {"fields": ("last_login", "fecha_creacion", "fecha_actualizacion")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "numero_documento", "nombres", "apellidos", "rol",
                "password1", "password2",
            ),
        }),
    )
    readonly_fields = ("fecha_creacion", "fecha_actualizacion", "last_login")


@admin.register(InstitucionEducativa)
class InstitucionEducativaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "codigo_dane", "activo")
    search_fields = ("nombre", "codigo_dane")
    list_filter = ("activo",)


@admin.register(Sede)
class SedeAdmin(admin.ModelAdmin):
    list_display = ("nombre", "institucion_educativa", "activo")
    list_filter = ("institucion_educativa", "activo")
    search_fields = ("nombre",)