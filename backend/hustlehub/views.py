from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import (
    UserSerializer, UserRegistrationSerializer, NotificationSerializer, MarkNotificationsAsReadSerializer,
    JobCategorySerializer, JobSerializer, JobApplicationSerializer, SkillBarterPostSerializer,
    SkillBarterApplicationSerializer, SkillBarterOfferSerializer, PortfolioItemSerializer, CommissionLogSerializer,
    CommissionExcuseSerializer, BadgeSerializer, UserBadgeSerializer, XPLogSerializer, ReferralSerializer,
    LoyaltyPointLogSerializer, NotificationSettingsSerializer, ReviewSerializer, AboutUsSerializer,
    CountySerializer, SubCountySerializer, WardSerializer, NeighborhoodTagSerializer, PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer, DashboardStatsSerializer, DashboardStatsBadgeSerializer
)
from .models import (
    User, Notification, JobCategory, Job, JobApplication, SkillBarterPost,
    SkillBarterApplication, SkillBarterOffer, PortfolioItem, CommissionLog,
    CommissionExcuse, Badge, UserBadge, XPLog, Referral, LoyaltyPointLog,
    NotificationSettings, Review, AboutUs, County, SubCounty, Ward, NeighborhoodTag, LEVEL_THRESHOLDS
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q, Sum
from django.shortcuts import get_object_or_404
from .permissions import IsOwnerOrReadOnly, IsAdminUserOrReadOnly, IsEmployerOrAdmin, IsFreelancerOrAdmin
from .services.matching_service import get_ai_job_matches # Import the matching service
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from datetime import date
from django.db.models import Avg
from rest_framework import filters


class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def signup(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Login successful.",
                "user": UserSerializer(user).data,
                "token": token.key
            }, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        try:
            request.user.auth_token.delete()
        except:
            pass # Token might already be deleted or not exist
        logout(request)
        return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            serializer = UserSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif request.method == 'PATCH':
            # Allow updating specific fields like bio and skills
            serializer = UserSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name', 'username', 'email', 'skills', 'service_areas']

    def get_queryset(self):
        queryset = super().get_queryset().filter(role='freelancer')
        
        # Filter by skills (comma-separated)
        skills_param = self.request.query_params.get('skills')
        if skills_param:
            skills = [s.strip() for s in skills_param.split(',') if s.strip()]
            for skill in skills:
                queryset = queryset.filter(skills__icontains=skill) # Case-insensitive contains

        # Filter by service_areas (comma-separated) - Existing logic
        service_areas_param = self.request.query_params.get('service_areas')
        if service_areas_param:
            areas = [a.strip() for a in service_areas_param.split(',') if a.strip()]
            for area in areas:
                queryset = queryset.filter(service_areas__icontains=area)

        # New: Filter by specific location IDs
        county_id = self.request.query_params.get('county_id')
        sub_county_id = self.request.query_params.get('sub_county_id')
        ward_id = self.request.query_params.get('ward_id')
        neighborhood_tag_id = self.request.query_params.get('neighborhood_tag_id')

        if county_id:
            try:
                county = County.objects.get(id=county_id)
                queryset = queryset.filter(service_areas__icontains=county.name)
            except County.DoesNotExist:
                queryset = queryset.none() # No results if county ID is invalid
        
        if sub_county_id:
            try:
                sub_county = SubCounty.objects.get(id=sub_county_id)
                queryset = queryset.filter(service_areas__icontains=sub_county.name)
            except SubCounty.DoesNotExist:
                queryset = queryset.none()

        if ward_id:
            try:
                ward = Ward.objects.get(id=ward_id)
                queryset = queryset.filter(service_areas__icontains=ward.name)
            except Ward.DoesNotExist:
                queryset = queryset.none()

        if neighborhood_tag_id:
            try:
                neighborhood_tag = NeighborhoodTag.objects.get(id=neighborhood_tag_id)
                queryset = queryset.filter(service_areas__icontains=neighborhood_tag.name)
            except NeighborhoodTag.DoesNotExist:
                queryset = queryset.none()

        # Filter by is_remote
        is_remote_param = self.request.query_params.get('is_remote')
        if is_remote_param is not None:
            is_remote = is_remote_param.lower() == 'true'
            queryset = queryset.filter(is_remote=is_remote)

        # Order by average_rating (descending) and then date_joined (descending)
        queryset = queryset.annotate(avg_rating=Avg('received_reviews__rating')).order_by('-avg_rating', '-date_joined')
        
        return queryset
    
    def get_permissions(self):
        if self.action in ['retrieve', 'list']:
            return [AllowAny()]
        return [IsAdminUserOrReadOnly()]


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='mark-as-read')
    def mark_as_read(self, request):
        serializer = MarkNotificationsAsReadSerializer(data=request.data)
        if serializer.is_valid():
            notification_ids = serializer.validated_data['ids']
            # Ensure user can only mark their own notifications as read
            notifications_to_update = self.get_queryset().filter(id__in=notification_ids)
            count = notifications_to_update.update(is_read=True)
            return Response({'message': f'{count} notifications marked as read.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'unread_count': count}, status=status.HTTP_200_OK)


class JobCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer
    permission_classes = [AllowAny]


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        
        employer_id = self.request.query_params.get('employer')
        if employer_id:
            queryset = queryset.filter(employer__id=employer_id)

        search_query = self.request.query_params.get('search', '')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(skills__icontains=search_query)
            )

        county_id = self.request.query_params.get('county')
        if county_id:
            queryset = queryset.filter(county__id=county_id)

        sub_county_id = self.request.query_params.get('subCounty')
        if sub_county_id:
            queryset = queryset.filter(sub_county__id=sub_county_id)

        ward_id = self.request.query_params.get('area') # Map 'area' to ward for Job filtering
        if ward_id:
            queryset = queryset.filter(ward__id=ward_id)
        
        return queryset.filter(status='open') # Only show open jobs by default, unless specific employer filter is applied


    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrReadOnly()]


class RecommendedJobsView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role != 'freelancer':
            return Job.objects.none()

        all_open_jobs = Job.objects.filter(status='open')

        if not user.bio or not user.skills:
            return Job.objects.none()

        recommended_jobs_with_scores = get_ai_job_matches(user, all_open_jobs)
        
        # We return a list of jobs, so we extract just the job objects
        return [item["job"] for item in recommended_jobs_with_scores]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        # A user can see applications they made or applications to their jobs
        if self.request.user.is_authenticated:
            return self.queryset.filter(Q(freelancer=self.request.user) | Q(job__employer=self.request.user))
        return self.queryset.none() # No applications for unauthenticated users

    def perform_create(self, serializer):
        # Ensure the applicant is the current user
        serializer.save(freelancer=self.request.user)


class SkillBarterPostViewSet(viewsets.ModelViewSet):
    queryset = SkillBarterPost.objects.all()
    serializer_class = SkillBarterPostSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrReadOnly()]


class SkillBarterApplicationViewSet(viewsets.ModelViewSet):
    queryset = SkillBarterApplication.objects.all()
    serializer_class = SkillBarterApplicationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        # User can see applications they sent OR applications to their posts
        if self.request.user.is_authenticated:
            return self.queryset.filter(Q(applicant=self.request.user) | Q(post__user=self.request.user)).order_by('-created_at')
        return self.queryset.none()

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)


class SkillBarterOfferViewSet(viewsets.ModelViewSet):
    queryset = SkillBarterOffer.objects.all()
    serializer_class = SkillBarterOfferSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        # User can see offers they made OR offers on their posts
        if self.request.user.is_authenticated:
            return self.queryset.filter(Q(offered_by=self.request.user) | Q(post__user=self.request.user)).order_by('-created_at')
        return self.queryset.none()

    def perform_create(self, serializer):
        serializer.save(offered_by=self.request.user)


class PortfolioItemViewSet(viewsets.ModelViewSet):
    queryset = PortfolioItem.objects.all()
    serializer_class = PortfolioItemSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        # Allow anyone to view, but only owner to edit/delete
        if self.action in ['list', 'retrieve']:
            return self.queryset.all()
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrReadOnly()]


class CommissionLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CommissionLog.objects.all()
    serializer_class = CommissionLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'employer':
                return self.queryset.filter(job__employer=user)
            elif user.role == 'freelancer':
                # Freelancers can see commission logs for jobs they applied to and were accepted
                return self.queryset.filter(job__applications__freelancer=user, job__applications__status='accepted')
            elif user.role == 'admin':
                return self.queryset.all()
        return self.queryset.none()


class CommissionExcuseViewSet(viewsets.ModelViewSet):
    queryset = CommissionExcuse.objects.all()
    serializer_class = CommissionExcuseSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return self.queryset.all()
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [AllowAny]


class UserBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserBadge.objects.all()
    serializer_class = UserBadgeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class XPLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = XPLog.objects.all()
    serializer_class = XPLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class ReferralViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Referral.objects.all()
    serializer_class = ReferralSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(referrer=self.request.user).order_by('-created_at')


class LoyaltyPointLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LoyaltyPointLog.objects.all()
    serializer_class = LoyaltyPointLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('-created_at')


class NotificationSettingsViewSet(viewsets.ModelViewSet):
    queryset = NotificationSettings.objects.all()
    serializer_class = NotificationSettingsSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        # Ensure the reviewer is the current user
        serializer.save(reviewer=self.request.user)

    def get_queryset(self):
        # Users can see reviews they gave or reviews they received
        if self.request.user.is_authenticated:
            return self.queryset.filter(Q(reviewer=self.request.user) | Q(reviewee=self.request.user))
        return self.queryset.none()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrReadOnly()]


class AboutUsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AboutUs.objects.all()
    serializer_class = AboutUsSerializer
    permission_classes = [AllowAny]


class CountyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = County.objects.all()
    serializer_class = CountySerializer
    permission_classes = [AllowAny]

class SubCountyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubCounty.objects.all()
    serializer_class = SubCountySerializer
    permission_classes = [AllowAny]

class WardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ward.objects.all()
    serializer_class = WardSerializer
    permission_classes = [AllowAny]
    
class NeighborhoodTagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NeighborhoodTag.objects.all()
    serializer_class = NeighborhoodTagSerializer
    permission_classes = [AllowAny]

class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=serializer.validated_data['email'])
        
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        # In a real app, you would send an email with the reset link
        print(f"Password reset link for {user.email}: /password-reset-confirm/{uidb64}/{token}/")
        
        return Response({"message": "Password reset link sent."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        password = serializer.validated_data['password']
        
        user.set_password(password)
        user.save()
        
        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)


class LocationListView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        counties = County.objects.prefetch_related('subcounties__wards').all()
        
        data = []
        for county in counties:
            county_data = {
                "id": county.id,
                "name": county.name,
                "sub_counties": []
            }
            for sub_county in county.subcounties.all():
                sub_county_data = {
                    "id": sub_county.id,
                    "name": sub_county.name,
                    "wards": []
                }
                for ward in sub_county.wards.all():
                    ward_data = {
                        "id": ward.id,
                        "name": ward.name
                    }
                    sub_county_data["wards"].append(ward_data)
                county_data["sub_counties"].append(sub_county_data)
            data.append(county_data)
            
        return Response(data, status=status.HTTP_200_OK)

class DashboardStatsView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsFreelancerOrAdmin]
    serializer_class = DashboardStatsSerializer

    def get_object(self):
        user = self.request.user

        # 1. Recommended Jobs Count
        recommended_jobs = []
        if user.bio and user.skills and user.role == 'freelancer':
            all_open_jobs = Job.objects.filter(status='open')
            recommended_jobs_with_scores = get_ai_job_matches(user, all_open_jobs)
            recommended_jobs = [item["job"] for item in recommended_jobs_with_scores]
        recommended_jobs_count = len(recommended_jobs)

        # 2. Active Applications Count
        active_applications_count = JobApplication.objects.filter(
            freelancer=user, 
            status='pending'
        ).count()

        # 3. Completed Jobs Count (assuming a job is completed if the application is accepted and job is closed)
        completed_jobs_count = JobApplication.objects.filter(
            freelancer=user,
            status='accepted',
            job__status='closed'
        ).count()

        # 4. XP and Level
        level = user.level
        current_xp = user.xp_points
        xp_needed_for_next_level = 0
        if user.level < len(LEVEL_THRESHOLDS):
            xp_needed_for_next_level = LEVEL_THRESHOLDS[user.level]

        # 5. Latest Badges
        latest_badges_queryset = UserBadge.objects.filter(user=user).order_by('-awarded_at')[:3]
        latest_badges_data = DashboardStatsBadgeSerializer([ub.badge for ub in latest_badges_queryset], many=True).data

        # 6. Leaderboard Rank (placeholder - requires a proper ranking system)
        # For simplicity, let's rank by XP points. This could be slow for many users.
        higher_xp_users_count = User.objects.filter(xp_points__gt=user.xp_points).count()
        leaderboard_rank = higher_xp_users_count + 1

        # 7. Commission Details
        # Assuming commission_is_suspended is a field on User or determined by an active excuse
        commission_due = CommissionLog.objects.filter(
            job__freelancer=user, 
            status='due',
            due_date__lte=date.today() # Only consider overdue commissions
        ).aggregate(Sum('commission_amount'))['commission_amount__sum'] or 0

        commission_days_left = None
        commission_is_suspended = False # Placeholder logic
        can_submit_excuse = False # Placeholder logic

        # Determine if commission is suspended or can submit excuse
        # This logic needs to be more robust based on your business rules
        # For now, a simple check if there's an overdue commission
        if commission_due > 0:
            # Check for existing pending excuse for the user (not necessarily per commission)
            has_pending_excuse = CommissionExcuse.objects.filter(user=user, status='pending').exists()
            can_submit_excuse = not has_pending_excuse
            
            # Example: Suspend if commission is overdue by more than X days and no approved excuse
            # This would typically be more complex, involving a background task or specific rules
            # For now, let's say if commission_due > 0 and no excuse, it's 'suspended' for demo
            commission_is_suspended = (commission_due > 0 and not has_pending_excuse)

            # Calculate days left for the soonest overdue commission, if any
            soonest_overdue = CommissionLog.objects.filter(
                job__freelancer=user, 
                status='due',
                due_date__lte=date.today()
            ).order_by('due_date').first()

            if soonest_overdue and soonest_overdue.due_date:
                days_diff = (soonest_overdue.due_date - date.today()).days
                commission_days_left = max(0, days_diff) # Days remaining until due date, or 0 if overdue
                # If it's already overdue, maybe show how many days *past* due
                if days_diff < 0: # If negative, it means days overdue
                    commission_days_left = days_diff # Store as negative to indicate overdue


        # 8. Has Portfolio
        has_portfolio = PortfolioItem.objects.filter(user=user).exists()


        dashboard_data = {
            'recommended_jobs_count': recommended_jobs_count,
            'active_applications_count': active_applications_count,
            'completed_jobs_count': completed_jobs_count,
            'level': level,
            'current_xp': current_xp,
            'xp_needed_for_next_level': xp_needed_for_next_level,
            'latest_badges': latest_badges_data,
            'leaderboard_rank': leaderboard_rank,
            'commission_due_amount': commission_due,
            'commission_days_left': commission_days_left,
            'commission_is_suspended': commission_is_suspended,
            'can_submit_excuse': can_submit_excuse,
            'has_portfolio': has_portfolio,
        }
        return dashboard_data