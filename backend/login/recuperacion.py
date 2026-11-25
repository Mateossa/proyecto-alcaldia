import secrets
from datetime import timedelta

from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import send_mail
from django.utils import timezone

from .models import CodigoRecuperacion, Usuario

MINUTOS_VIGENCIA = 15
MAX_INTENTOS = 5
SEGUNDOS_ENTRE_CODIGOS = 60

MENSAJE_CODIGO_INVALIDO = "El código es incorrecto o ya venció. Solicita uno nuevo."


class CodigoInvalido(Exception):
    """El código no sirve. El mensaje es el que ve la persona en pantalla."""


def buscar_usuario_por_email(email):
    """
    Devuelve el usuario activo con ese correo.
    Devuelve None si no existe o si hay más de un usuario con el mismo correo
    (en ese caso no se sabría a quién pertenece el código).
    """
    usuarios = list(
        Usuario.objects.filter(
            email__iexact=email.strip(), is_active=True, activo=True
        )[:2]
    )
    return usuarios[0] if len(usuarios) == 1 else None


def generar_y_enviar_codigo(usuario):
    """Crea un código nuevo y lo manda al correo. Devuelve False si se pidió muy seguido."""
    ahora = timezone.now()

    pidio_hace_poco = usuario.codigos_recuperacion.filter(
        creado__gte=ahora - timedelta(seconds=SEGUNDOS_ENTRE_CODIGOS)
    ).exists()
    if pidio_hace_poco:
        return False

    # Los códigos anteriores dejan de servir
    usuario.codigos_recuperacion.filter(usado=False).update(usado=True)

    codigo = f"{secrets.randbelow(1_000_000):06d}"
    CodigoRecuperacion.objects.create(
        usuario=usuario,
        codigo_hash=make_password(codigo),
        expira=ahora + timedelta(minutes=MINUTOS_VIGENCIA),
    )

    send_mail(
        subject="Código para restablecer tu contraseña",
        message=(
            f"Hola {usuario.nombres},\n\n"
            f"Tu código para restablecer la contraseña es: {codigo}\n\n"
            f"El código vence en {MINUTOS_VIGENCIA} minutos. "
            "Si no lo solicitaste, ignora este mensaje.\n\n"
            "Secretaría de Educación de Dosquebradas"
        ),
        from_email=None,  # usa DEFAULT_FROM_EMAIL de settings.py
        recipient_list=[usuario.email],
        fail_silently=False,
    )
    return True


def validar_codigo(usuario, codigo):
    """
    Revisa el código del usuario. Si es correcto devuelve el registro.
    Si no, lanza CodigoInvalido con el mensaje para mostrar.
    """
    registro = (
        usuario.codigos_recuperacion.filter(usado=False, expira__gt=timezone.now())
        .order_by("-creado")
        .first()
    )
    if registro is None:
        raise CodigoInvalido(MENSAJE_CODIGO_INVALIDO)

    if registro.intentos >= MAX_INTENTOS:
        registro.usado = True
        registro.save(update_fields=["usado"])
        raise CodigoInvalido("Demasiados intentos. Solicita un código nuevo.")

    if not check_password(codigo, registro.codigo_hash):
        registro.intentos += 1
        registro.save(update_fields=["intentos"])
        raise CodigoInvalido(MENSAJE_CODIGO_INVALIDO)

    return registro