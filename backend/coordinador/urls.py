from rest_framework.routers import DefaultRouter
from .views import SolicitudHorasExtrasViewSet

router = DefaultRouter()
router.register("horas-extras", SolicitudHorasExtrasViewSet, basename="horas-extras")

urlpatterns = router.urls