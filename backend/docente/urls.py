from rest_framework.routers import DefaultRouter
from .views import AusentismoViewSet

router = DefaultRouter()
router.register("ausentismos", AusentismoViewSet, basename="ausentismo")

urlpatterns = router.urls