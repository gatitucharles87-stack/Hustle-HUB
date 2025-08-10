from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Sum
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    User, Profile, JobCategory, Job, JobApplication, SkillBarterPost,
    SkillBarterApplication, SkillBarterOffer, PortfolioItem, CommissionLog,
    CommissionExcuse, Notification, Badge, UserBadge, XPLog, Referral,
    LoyaltyPointLog, NotificationSettings, Review, AboutUs, County,
    SubCounty, Ward, NeighborhoodTag
)
from .serializers import (
    UserSerializer, NotificationSerializer, MarkNotificationsAsReadSerializer, JobCategorySerializer,
    JobSerializer, JobApplicationSerializer, SkillBarterPostSerializer,
    SkillBarterApplicationSerializer, SkillBarterOfferSerializer, PortfolioItemSerializer,
    CommissionLogSerializer, CommissionExcuseSerializer, BadgeSerializer,
    UserBadgeSerializer, XPLogSerializer, ReferralSerializer,
    LoyaltyPointLogSerializer, NotificationSettingsSerializer, ReviewSerializer,
    AboutUsSerializer, CountySerializer, SubCountySerializer, WardSerializer,
    NeighborhoodTagSerializer, UserRegistrationSerializer
)
from .permissions import IsOwnerOrReadOnly, IsAdminUser

# Define XP required for each level (example, adjust as needed)
XP_LEVEL_REQUIREMENTS = {
    1: 0,
    2: 100,
    3: 250,
    4: 500,
    5: 1000,
    # Add more levels as needed
}

class AuthViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'], url_path='signup')
    def signup(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='logout', permission_classes=[permissions.IsAuthenticated])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if 'freelancers' in self.request.resolver_match.url_name: # This is a hacky way to check for /api/freelancers
            return queryset.filter(role='freelancer')
        return queryset

    @action(detail=False, methods=['put'], url_path='me', permission_classes=[permissions.IsAuthenticated])
    def update_me(self, request):
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['put'], url_path='me/availability', permission_classes=[permissions.IsAuthenticated])
    def update_availability(self, request):
        user = request.user
        if user.role != 'freelancer':
            return Response({"detail": "Only freelancers can update availability."}, status=status.HTTP_403_FORBIDDEN)
        
        profile = user.profile 
        profile.isRemote = request.data.get('isRemote', profile.isRemote)
        profile.serviceAreas = request.data.get('serviceAreas', profile.serviceAreas) 
        profile.save()

        return Response({"message": "Availability updated"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['put'], url_path='me/password', permission_classes=[permissions.IsAuthenticated])
    def set_password(self, request):
        user = request.user
        current_password = request.data.get('currentPassword')
        new_password = request.data.get('newPassword')

        if not user.check_password(current_password):
            return Response({"currentPassword": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(user=user)

        is_read_param = self.request.query_params.get('is_read')
        if is_read_param is not None:
            is_read = is_read_param.lower() in ['true', '1']
            queryset = queryset.filter(is_read=is_read)
        
        type_param = self.request.query_params.get('type')
        if type_param:
            queryset = queryset.filter(type=type_param)
            
        return queryset

    @action(detail=False, methods=['post'], url_path='mark-as-read')
    def mark_as_read(self, request):
        serializer = MarkNotificationsAsReadSerializer(data=request.data)
        if serializer.is_valid():
            ids = serializer.validated_data['ids']
            Notification.objects.filter(user=request.user, id__in=ids).update(is_read=True)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='mark-all-as-read')
    def mark_all_as_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'unread_count': count})

class JobCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)

    @action(detail=True, methods=['post'], url_path='apply', permission_classes=[permissions.IsAuthenticated])
    def apply(self, request, pk=None):
        job = self.get_object()
        if request.user.role != 'freelancer':
            return Response({"detail": "Only freelancers can apply for jobs."}, status=status.HTTP_403_FORBIDDEN)
        
        if JobApplication.objects.filter(job=job, freelancer=request.user).exists():
            return Response({"detail": "You have already applied for this job."}, status=status.HTTP_400_BAD_REQUEST)
        
        JobApplication.objects.create(job=job, freelancer=request.user)
        return Response({"message": "Application submitted successfully"}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='my-listings', permission_classes=[permissions.IsAuthenticated])
    def my_listings(self, request):
        if request.user.role != 'employer':
            return Response({"detail": "Only employers can view their job listings."}, status=status.HTTP_403_FORBIDDEN)
        
        jobs = Job.objects.filter(employer=request.user)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='my-applications', permission_classes=[permissions.IsAuthenticated])
    def my_applications(self, request):
        if request.user.role != 'freelancer':
            return Response({"detail": "Only freelancers can view their job applications."}, status=status.HTTP_403_FORBIDDEN)
        
        applications = JobApplication.objects.filter(freelancer=request.user)
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='applicants', permission_classes=[permissions.IsAuthenticated])
    def applicants(self, request, pk=None):
        job = self.get_object()
        if request.user != job.employer:
            return Response({"detail": "You do not have permission to view applicants for this job."}, status=status.HTTP_403_FORBIDDEN)
        
        applications = JobApplication.objects.filter(job=job)
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['put'], url_path='applicants/(?P<applicant_id>[^/.]+)', permission_classes=[permissions.IsAuthenticated])
    def update_applicant_status(self, request, pk=None, applicant_id=None):
        job = self.get_object()
        if request.user != job.employer:
            return Response({"detail": "You do not have permission to update applicant status for this job."}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            application = JobApplication.objects.get(job=job, id=applicant_id)
        except JobApplication.DoesNotExist:
            return Response({"detail": "Applicant not found for this job."}, status=status.HTTP_404_NOT_FOUND)
        
        status_param = request.data.get('status')
        if status_param not in ['accepted', 'rejected']:
            return Response({"detail": "Invalid status. Must be 'accepted' or 'rejected'."}, status=status.HTTP_400_BAD_REQUEST)
        
        application.status = status_param
        application.save()
        return Response({"message": "Applicant status updated"}, status=status.HTTP_200_OK)


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'freelancer':
            return JobApplication.objects.filter(freelancer=user)
        elif user.role == 'employer':
            return JobApplication.objects.filter(job__employer=user)
        return JobApplication.objects.none()

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)

class SkillBarterPostViewSet(viewsets.ModelViewSet):
    queryset = SkillBarterPost.objects.all()
    serializer_class = SkillBarterPostSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='offer', permission_classes=[permissions.IsAuthenticated])
    def make_offer(self, request, pk=None):
        post = self.get_object()
        if SkillBarterOffer.objects.filter(post=post, offered_by=request.user).exists():
            return Response({"detail": "You have already made an offer on this post."}, status=status.HTTP_400_BAD_REQUEST)
        
        SkillBarterOffer.objects.create(post=post, offered_by=request.user) # You might want to add offer details here
        return Response({"message": "Offer sent"}, status=status.HTTP_201_CREATED)


class SkillBarterApplicationViewSet(viewsets.ModelViewSet):
    queryset = SkillBarterApplication.objects.all()
    serializer_class = SkillBarterApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return SkillBarterApplication.objects.filter(Q(applicant=user) | Q(post__user=user))
    
    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)

class SkillBarterOfferViewSet(viewsets.ModelViewSet):
    queryset = SkillBarterOffer.objects.all()
    serializer_class = SkillBarterOfferSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return SkillBarterOffer.objects.filter(Q(offered_by=user) | Q(post__user=user))

    def perform_create(self, serializer):
        serializer.save(offered_by=self.request.user)

class PortfolioItemViewSet(viewsets.ModelViewSet):
    queryset = PortfolioItem.objects.all()
    serializer_class = PortfolioItemSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        # Allow fetching portfolio items for a specific user
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return PortfolioItem.objects.filter(user__id=user_id)
        return PortfolioItem.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommissionLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CommissionLog.objects.all()
    serializer_class = CommissionLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'freelancer':
            return CommissionLog.objects.filter(job__applications__freelancer=user, job__applications__status='accepted')
        elif user.role == 'employer':
            return CommissionLog.objects.filter(job__employer=user)
        return CommissionLog.objects.none()

class CommissionExcuseViewSet(viewsets.ModelViewSet):
    queryset = CommissionExcuse.objects.all()
    serializer_class = CommissionExcuseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CommissionExcuse.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer

class UserBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserBadge.objects.all()
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return UserBadge.objects.filter(user__id=user_id)
        return UserBadge.objects.filter(user=self.request.user)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        reviewee_id = self.request.query_params.get('reviewee_id')
        if reviewee_id:
            return Review.objects.filter(reviewee__id=reviewee_id)
        return Review.objects.all()

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)

class CountyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = County.objects.all()
    serializer_class = CountySerializer

class SubCountyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubCounty.objects.all()
    serializer_class = SubCountySerializer
    
    def get_queryset(self):
        county_id = self.request.query_params.get('county_id')
        if county_id:
            return SubCounty.objects.filter(county__id=county_id)
        return SubCounty.objects.all()

class WardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ward.objects.all()
    serializer_class = WardSerializer
    
    def get_queryset(self):
        sub_county_id = self.request.query_params.get('sub_county_id')
        if sub_county_id:
            return Ward.objects.filter(sub_county__id=sub_county_id)
        return Ward.objects.all()

class XPLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = XPLog.objects.all()
    serializer_class = XPLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return XPLog.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='me')
    def get_my_xp_progress(self, request):
        if request.user.role != 'freelancer':
            return Response({"detail": "Only freelancers have XP progress."},
                            status=status.HTTP_403_FORBIDDEN)

        current_xp = XPLog.objects.filter(user=request.user).aggregate(Sum('xp_gained'))['xp_gained__sum'] or 0

        current_level = 1
        next_level_xp = XP_LEVEL_REQUIREMENTS.get(2, 0) # Default for level 2

        for level, xp_needed in sorted(XP_LEVEL_REQUIREMENTS.items()):
            if current_xp >= xp_needed:
                current_level = level
            else:
                next_level_xp = xp_needed
                break
        else:
            # If current_xp exceeds all defined levels, assume next level is just current_xp + some arbitrary value
            next_level_xp = current_xp + 100 # Or a more sophisticated calculation

        return Response({
            'currentXp': current_xp,
            'nextLevelXp': next_level_xp,
            'currentLevel': current_level
        }, status=status.HTTP_200_OK)

class ReferralViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Referral.objects.all()
    serializer_class = ReferralSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Referral.objects.filter(referrer=self.request.user)

class LoyaltyPointLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LoyaltyPointLog.objects.all()
    serializer_class = LoyaltyPointLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LoyaltyPointLog.objects.filter(user=self.request.user)

class NotificationSettingsViewSet(viewsets.ModelViewSet):
    queryset = NotificationSettings.objects.all()
    serializer_class = NotificationSettingsSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_object(self):
        obj, created = NotificationSettings.objects.get_or_create(user=self.request.user)
        return obj

class AboutUsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AboutUs.objects.all()
    serializer_class = AboutUsSerializer

class NeighborhoodTagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NeighborhoodTag.objects.all()
    serializer_class = NeighborhoodTagSerializer