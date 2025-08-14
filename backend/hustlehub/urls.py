from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthViewSet, UserViewSet, NotificationViewSet, JobCategoryViewSet, JobViewSet,
    JobApplicationViewSet, SkillBarterPostViewSet, SkillBarterApplicationViewSet,
    SkillBarterOfferViewSet, PortfolioItemViewSet, CommissionLogViewSet, CommissionExcuseViewSet,
    BadgeViewSet, UserBadgeViewSet, XPLogViewSet, ReferralViewSet, LoyaltyPointLogViewSet,
    NotificationSettingsViewSet, ReviewViewSet, AboutUsViewSet, RecommendedJobsView,
    CountyViewSet, SubCountyViewSet, WardViewSet, NeighborhoodTagViewSet, LocationListView,
    PasswordResetRequestView, PasswordResetConfirmView, DashboardStatsView
)

router = DefaultRouter()
# Registering existing ViewSets
router.register(r'users', UserViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'job-categories', JobCategoryViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'job-applications', JobApplicationViewSet, basename='jobapplication')
router.register(r'skill-barter-posts', SkillBarterPostViewSet)
router.register(r'skill-barter-applications', SkillBarterApplicationViewSet, basename='skillbarterapplication')
router.register(r'skill-barter-offers', SkillBarterOfferViewSet, basename='skillbarteroffer')
router.register(r'portfolio-items', PortfolioItemViewSet)
router.register(r'commission-logs', CommissionLogViewSet)
router.register(r'commission-excuses', CommissionExcuseViewSet, basename='commissionexcuse')
router.register(r'badges', BadgeViewSet)
router.register(r'user-badges', UserBadgeViewSet, basename='userbadge')
router.register(r'xp-logs', XPLogViewSet, basename='xplog')
router.register(r'referrals', ReferralViewSet, basename='referral')
router.register(r'loyalty-point-logs', LoyaltyPointLogViewSet, basename='loyaltypointlog')
router.register(r'notification-settings', NotificationSettingsViewSet, basename='notificationsettings')
router.register(r'reviews', ReviewViewSet)
router.register(r'about-us', AboutUsViewSet)
router.register(r'counties', CountyViewSet)
router.register(r'sub-counties', SubCountyViewSet)
router.register(r'wards', WardViewSet)
router.register(r'neighborhood-tags', NeighborhoodTagViewSet)

# Base urlpatterns including the router
urlpatterns = [
    # Explicitly define /users/me/ before including the router to ensure it takes precedence
    path('users/me/', AuthViewSet.as_view({'get': 'me', 'patch': 'me'}), name='user-me'),
    path('', include(router.urls)),

    # Preserving existing non-router paths
    path('recommended-jobs/', RecommendedJobsView.as_view(), name='recommended-jobs'),
    path('locations/', LocationListView.as_view(), name='location-list'), 
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),

    # Adding the missing authentication paths
    path('auth/signup/', AuthViewSet.as_view({'post': 'signup'}), name='auth-signup'),
    path('auth/login/', AuthViewSet.as_view({'post': 'login'}), name='auth-login'),
    path('auth/logout/', AuthViewSet.as_view({'post': 'logout'}), name='auth-logout'),

    # New dashboard stats endpoint
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
