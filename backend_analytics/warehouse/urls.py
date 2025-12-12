from rest_framework.routers import DefaultRouter

from .views import WarehouseAnalyticsViewSet, ValidateTransactions

router=DefaultRouter()
router.register('hfc',WarehouseAnalyticsViewSet,basename='hfc')
router.register('validate',ValidateTransactions,basename='validate')

urlpatterns = router.urls
