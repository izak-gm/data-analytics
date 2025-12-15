from rest_framework.routers import DefaultRouter

from .views import WarehouseAnalyticsViewSet, ValidateTransactions, GenerateAllRecordsForTransactions, \
    BranchPerformancePerTotals

router=DefaultRouter()
router.register('hfc',WarehouseAnalyticsViewSet,basename='hfc')
router.register('validate',ValidateTransactions,basename='validate')
router.register('all-records',GenerateAllRecordsForTransactions,basename='all-records')
router.register('all-records',BranchPerformancePerTotals,basename='records-per-branch')



urlpatterns = router.urls
