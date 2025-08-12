from rest_framework import serializers
from .models import (
    User, JobCategory, Job, JobApplication, SkillBarterPost,
    SkillBarterApplication, SkillBarterOffer, PortfolioItem, CommissionLog,
    CommissionExcuse, Notification, Badge, UserBadge, XPLog, Referral,
    LoyaltyPointLog, NotificationSettings, Review, AboutUs, County,
    SubCounty, Ward, NeighborhoodTag
)
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.db.models import Avg


class UserSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'date_joined', 'last_login', 'username', 'referral_code', 'xp_points', 'bio', 'skills', 'service_areas', 'is_remote_available', 'avatar', 'average_rating']
        read_only_fields = ['id', 'full_name', 'role', 'date_joined', 'last_login', 'referral_code', 'xp_points', 'average_rating']

    def get_average_rating(self, obj):
        return obj.received_reviews.aggregate(Avg('rating'))['rating__avg']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    referral_code = serializers.CharField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'role', 'username', 'referral_code']
        extra_kwargs = {'username': {'required': True}}

    def create(self, validated_data):
        referral_code = validated_data.pop('referral_code', None)
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            role=validated_data['role'],
            username=validated_data['username']
        )

        if referral_code:
            try:
                referrer = User.objects.get(referral_code=referral_code)
                Referral.objects.create(referrer=referrer, referred_user=user, is_successful=True)
                LoyaltyPointLog.objects.create(user=referrer, points=100, source='referral')
            except User.DoesNotExist:
                print(f"Warning: Invalid referral code '{referral_code}' provided during signup.")
        return user


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['user']

class MarkNotificationsAsReadSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.IntegerField())

class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    employer = UserSerializer(read_only=True)

    class Meta:
        model = Job
        fields = '__all__'

class JobApplicationSerializer(serializers.ModelSerializer):
    freelancer = UserSerializer(read_only=True)
    job = JobSerializer(read_only=True)

    class Meta:
        model = JobApplication
        fields = '__all__'

class SkillBarterPostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = SkillBarterPost
        fields = '__all__'

class SkillBarterApplicationSerializer(serializers.ModelSerializer):
    applicant = UserSerializer(read_only=True)
    post = SkillBarterPostSerializer(read_only=True)

    class Meta:
        model = SkillBarterApplication
        fields = '__all__'

class SkillBarterOfferSerializer(serializers.ModelSerializer):
    offered_by = UserSerializer(read_only=True)
    post = SkillBarterPostSerializer(read_only=True)
    skill_barter_post = serializers.PrimaryKeyRelatedField(
        queryset=SkillBarterPost.objects.all(),
        source='post', # This maps the input field 'skill_barter_post' to the model field 'post'
        write_only=True
    )

    class Meta:
        model = SkillBarterOffer
        fields = ['id', 'post', 'skill_barter_post', 'offered_by', 'message', 'status', 'created_at']
        read_only_fields = ['id', 'offered_by', 'status', 'created_at', 'post']

class PortfolioItemSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = PortfolioItem
        fields = '__all__'

class CommissionLogSerializer(serializers.ModelSerializer):
    job_title = serializers.SerializerMethodField()

    class Meta:
        model = CommissionLog
        fields = (
            'id', 'job', 'total_amount', 'commission_percentage', 
            'commission_amount', 'freelancer_earning', 'status', 
            'due_date', 'completion_date', 'created_at', 'has_excuse',
            'job_title'
        )

    def get_job_title(self, obj):
        return obj.job.title if obj.job else None

class CommissionExcuseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionExcuse
        fields = '__all__'

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = '__all__'

class XPLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = XPLog
        fields = '__all__'

class ReferralSerializer(serializers.ModelSerializer):
    referred_user = UserSerializer(read_only=True)

    class Meta:
        model = Referral
        fields = ['id', 'referrer', 'referred_user', 'is_successful', 'created_at']
        read_only_fields = ['id', 'referrer', 'referred_user', 'is_successful', 'created_at']

class LoyaltyPointLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyPointLog
        fields = '__all__'

class NotificationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationSettings
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    reviewee = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'

class AboutUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutUs
        fields = '__all__'

class CountySerializer(serializers.ModelSerializer):
    class Meta:
        model = County
        fields = '__all__'

class SubCountySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCounty
        fields = '__all__'

class WardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ward
        fields = '__all__'

class NeighborhoodTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = NeighborhoodTag
        fields = '__all__'


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uidb64']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid token or user ID.")

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError("Invalid token.")
            
        attrs['user'] = user
        return attrs

class DashboardStatsBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['title', 'icon']

class DashboardStatsSerializer(serializers.Serializer):
    recommended_jobs_count = serializers.IntegerField()
    active_applications_count = serializers.IntegerField()
    completed_jobs_count = serializers.IntegerField()
    level = serializers.IntegerField()
    current_xp = serializers.IntegerField()
    xp_needed_for_next_level = serializers.IntegerField()
    latest_badges = DashboardStatsBadgeSerializer(many=True)
    leaderboard_rank = serializers.IntegerField()
    commission_due_amount = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)
    commission_days_left = serializers.IntegerField(allow_null=True)
    commission_is_suspended = serializers.BooleanField()
    can_submit_excuse = serializers.BooleanField()
    has_portfolio = serializers.BooleanField()
