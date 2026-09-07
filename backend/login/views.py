from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import InstitucionEducativa, Sede
from .serializers import (
    CustomTokenObtainPairSerializer,
    CambiarContrasenaSerializer,
    UsuarioSerializer,
    InstitucionEducativaSerializer,
    SedeSerializer,
)


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