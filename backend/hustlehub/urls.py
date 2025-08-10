from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthViewSet, UserViewSet, NotificationViewSet, JobCategoryViewSet, JobViewSet,
    PortfolioItemViewSet, CommissionLogViewSet, CommissionExcuseViewSet, BadgeViewSet,
    UserBadgeViewSet, XPLogViewSet, ReferralViewSet, LoyaltyPointLogViewSet,
    NotificationSettingsViewSet, ReviewViewSet, AboutUsViewSet, CountyViewSet,
    SubCountyViewSet, WardViewSet, NeighborhoodTagViewSet, SkillBarterPostViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'job-categories', JobCategoryViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'skill-barter-posts', SkillBarterPostViewSet)
router.register(r'portfolio-items', PortfolioItemViewSet)
router.register(r'commission-logs', CommissionLogViewSet)
router.register(r'commission-excuses', CommissionExcuseViewSet)
router.register(r'badges', BadgeViewSet)
router.register(r'user-badges', UserBadgeViewSet)
router.register(r'xp-logs', XPLogViewSet)
router.register(r'referrals', ReferralViewSet)
router.register(r'loyalty-point-logs', LoyaltyPointLogViewSet)
router.register(r'notification-settings', NotificationSettingsViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'about-us', AboutUsViewSet)
router.register(r'counties', CountyViewSet)
router.register(r'sub-counties', SubCountyViewSet)
router.register(r'wards', WardViewSet)
router.register(r'neighborhood-tags', NeighborhoodTagViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('auth/signup', AuthViewSet.as_view({'post': 'signup'}), name='auth-signup'),
    path('auth/logout', AuthViewSet.as_view({'post': 'logout'}), name='auth-logout'),
    path('auth/me', AuthViewSet.as_view({'get': 'me'}), name='auth-me'),
    path('freelancers/', UserViewSet.as_view({'get': 'list'}), {'role': 'freelancer'}, name='freelancer-list'),

]
