from rest_framework.routers import DefaultRouter
from .views import TopeHorasExtrasViewSet

router = DefaultRouter()
router.register("topes-horas-extras", TopeHorasExtrasViewSet, basename="topes-horas-extras")

urlpatterns = router.urls