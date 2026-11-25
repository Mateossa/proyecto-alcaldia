import logging

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status, generics, permissions
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import InstitucionEducativa, Sede, Usuario
from .recuperacion import (
    MENSAJE_CODIGO_INVALIDO,
    CodigoInvalido,
    buscar_usuario_por_email,
    generar_y_enviar_codigo,
    validar_codigo,
)
from .serializers import (
    CustomTokenObtainPairSerializer,
    CambiarContrasenaSerializer,
    UsuarioSerializer,
    InstitucionEducativaSerializer,
    SedeSerializer,
)

logger = logging.getLogger(__name__)


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CambiarContrasenaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CambiarContrasenaSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Contraseña actualizada correctamente."}, status=status.HTTP_200_OK)


class UsuarioActualView(generics.RetrieveAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class InstitucionEducativaListView(generics.ListAPIView):
    queryset = InstitucionEducativa.objects.filter(activo=True)
    serializer_class = InstitucionEducativaSerializer
    permission_classes = [permissions.IsAuthenticated]


class SedeListView(generics.ListAPIView):
    serializer_class = SedeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Sede.objects.filter(activo=True)
        institucion_id = self.request.query_params.get("institucion_educativa")
        if institucion_id:
            qs = qs.filter(institucion_educativa_id=institucion_id)
        return qs


class BuscarDocenteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        numero_documento = request.query_params.get("numero_documento")
        if not numero_documento:
            return Response({"detail": "Debe indicar numero_documento."}, status=400)

        try:
            docente = Usuario.objects.get(
                numero_documento=numero_documento, rol=Usuario.Rol.DOCENTE
            )
        except Usuario.DoesNotExist:
            raise NotFound("No se encontró un docente con ese número de documento.")

        return Response({
            "id": docente.id,
            "numero_documento": docente.numero_documento,
            "nombre_completo": docente.nombre_completo,
            "institucion_educativa": docente.institucion_educativa_id,
        })


# ===== Restablecer contraseña con código (sin sesión iniciada) =====

def _usuario_y_codigo(request):
    """Lee email y código del body. Devuelve (usuario, codigo); usuario es None si algo no es válido."""
    email = str(request.data.get("email", "")).strip()
    codigo = str(request.data.get("codigo", "")).strip()
    if not email or len(codigo) != 6 or not codigo.isdigit():
        return None, ""
    return buscar_usuario_por_email(email), codigo


class SolicitarCodigoView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        email = str(request.data.get("email", "")).strip()
        if not email:
            return Response(
                {"error": "Por favor ingresa tu correo electrónico."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        usuario = buscar_usuario_por_email(email)
        if usuario is not None:
            try:
                generar_y_enviar_codigo(usuario)
            except Exception:
                # El error queda en la terminal del backend, la persona no lo ve
                logger.exception("No se pudo enviar el código de recuperación")

        # Misma respuesta exista o no el correo, para no revelar quién está registrado
        return Response(
            {"detail": "Si el correo está registrado, te enviamos un código de 6 dígitos."}
        )


class VerificarCodigoView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        usuario, codigo = _usuario_y_codigo(request)
        if usuario is None:
            return Response(
                {"error": MENSAJE_CODIGO_INVALIDO}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validar_codigo(usuario, codigo)
        except CodigoInvalido as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Código válido."})


class CambiarContrasenaConCodigoView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        usuario, codigo = _usuario_y_codigo(request)
        nueva = str(request.data.get("nueva_contrasena", ""))

        if usuario is None:
            return Response(
                {"error": MENSAJE_CODIGO_INVALIDO}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validar_codigo(usuario, codigo)
        except CodigoInvalido as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(nueva, usuario)
        except DjangoValidationError as exc:
            return Response(
                {"error": " ".join(exc.messages)}, status=status.HTTP_400_BAD_REQUEST
            )

        usuario.set_password(nueva)
        usuario.debe_cambiar_contrasena = False
        usuario.save(update_fields=["password", "debe_cambiar_contrasena"])

        # El código ya se usó: ningún otro código pendiente sirve
        usuario.codigos_recuperacion.filter(usado=False).update(usado=True)

        return Response({"detail": "Contraseña actualizada correctamente."})