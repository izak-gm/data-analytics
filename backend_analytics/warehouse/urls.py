from rest_framework.routers import DefaultRouter

from .views import WarehouseAnalyticsViewSet, ValidateTransactions, GenerateAllRecordsForTransactions

router=DefaultRouter()
router.register('hfc',WarehouseAnalyticsViewSet,basename='hfc')
router.register('validate',ValidateTransactions,basename='validate')
router.register('all-records',GenerateAllRecordsForTransactions,basename='all-records')

urlpatterns = router.urls
