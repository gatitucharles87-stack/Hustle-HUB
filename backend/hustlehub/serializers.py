from rest_framework import serializers
from .models import (
    User, Profile, JobCategory, Job, JobApplication, SkillBarterPost,
    SkillBarterApplication, SkillBarterOffer, PortfolioItem, CommissionLog,
    CommissionExcuse, Notification, Badge, UserBadge, XPLog, Referral,
    LoyaltyPointLog, NotificationSettings, Review, AboutUs, County,
    SubCounty, Ward, NeighborhoodTag
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'fullName', 'role', 'date_joined', 'last_login']
        read_only_fields = ['id', 'date_joined', 'last_login']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['fullName', 'email', 'password', 'role'] # availability will be handled separately if needed for registration

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            fullName=validated_data['fullName'],
            role=validated_data['role']
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

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

    class Meta:
        model = SkillBarterOffer
        fields = '__all__'

class PortfolioItemSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = PortfolioItem
        fields = '__all__'

class CommissionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionLog
        fields = '__all__'

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
    class Meta:
        model = Referral
        fields = '__all__'

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
