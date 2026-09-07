from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Usuario, InstitucionEducativa, Sede


class InstitucionEducativaSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstitucionEducativa
        fields = ["id", "nombre", "codigo_dane"]

class SedeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sede
        fields = ["id", "nombre", "institucion_educativa"]

class UsuarioSerializer(serializers.ModelSerializer):
    institucion_educativa = InstitucionEducativaSerializer(read_only=True)

    class Meta:
        model = Usuario
        fields = [
            "id", "numero_documento", "tipo_documento", "nombres", "apellidos",
            "email", "telefono", "foto", "rol", "institucion_educativa",
            "cargo", "debe_cambiar_contrasena", "activo",
        ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = Usuario.USERNAME_FIELD

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["rol"] = user.rol
        token["nombre_completo"] = user.nombre_completo
        token["debe_cambiar_contrasena"] = user.debe_cambiar_contrasena
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["usuario"] = UsuarioSerializer(self.user).data
        return data


class CambiarContrasenaSerializer(serializers.Serializer):
    contrasena_actual = serializers.CharField(write_only=True)
    contrasena_nueva = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        user = self.context["request"].user
        if not user.check_password(attrs["contrasena_actual"]):
            raise serializers.ValidationError({"contrasena_actual": "La contraseña actual es incorrecta."})
        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["contrasena_nueva"])
        user.debe_cambiar_contrasena = False
        user.save(update_fields=["password", "debe_cambiar_contrasena"])
        return user