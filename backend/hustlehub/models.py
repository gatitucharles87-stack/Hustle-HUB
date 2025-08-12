from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.conf import settings
from django.utils import timezone
from django.utils.text import slugify
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import secrets
import string

# Define the XP thresholds for each level
LEVEL_THRESHOLDS = [0, 100, 250, 400, 600, 850, 1100, 1400, 1800, 2250, 2750, 3300, 3900, 4550, 5250, 6000, 6800, 7650, 8550, 9500]
BADGE_NAMES = [
    'Rookie', 'Hustle Initiate', 'Skill Sprinter', 'Task Tackler', 'Smart Hustler', 
    'Certified Doer', 'Work Warrior', 'Pro Performer', 'Local Legend', 'Trusted Hustler',
    'Efficiency Expert', 'Skill Barter Champ', 'Client Magnet', 'Consistency King/Queen',
    '5-Star Streak', 'Hustle Architect', 'Elite Hustler', 'Hustler Royalty',
    'Hustle Guardian', 'Hustle Legend'
]


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(('The Email must be set'))
        email = self.normalize_email(email)

        username = extra_fields.get('username')
        if not username:
            raise ValueError('The username must be set')

        # Generate referral_code based on username and a random hex string
        base_referral_code = slugify(username).replace('-', '') # Remove hyphens for cleaner URL
        referral_code = f"{base_referral_code}-{secrets.token_hex(3)}"
        while self.model.objects.filter(referral_code=referral_code).exists():
            referral_code = f"{base_referral_code}-{secrets.token_hex(3)}"
        extra_fields['referral_code'] = referral_code

        user = self.model(email=email, **extra_fields)
        user.set_password(password) # Ensure password is set and hashed here
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError(('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    ROLE_CHOICES = (('freelancer', 'Freelancer'), ('employer', 'Employer'), ('admin', 'Admin'))
    PREFERRED_JOB_TYPE_CHOICES = [('PAID', 'Paid'), ('BARTER', 'Barter')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_remote_available = models.BooleanField(default=True)
    service_areas = models.TextField(blank=True)
    skills = models.JSONField(default=list, blank=True)
    username = models.CharField(max_length=150, unique=True)
    referral_code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    xp_points = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    bio = models.TextField(blank=True, null=True)
    preferred_job_type = models.CharField(max_length=10, choices=PREFERRED_JOB_TYPE_CHOICES, default='PAID')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'role', 'username']
    objects = CustomUserManager()

    def add_xp(self, points):
        self.xp_points += points
        self.check_level_up()
        self.save()

    def check_level_up(self):
        new_level = self.level
        while new_level < len(LEVEL_THRESHOLDS) and self.xp_points >= LEVEL_THRESHOLDS[new_level]:
            new_level += 1

        if new_level > self.level:
            self.level = new_level
            self.unlock_level_badge()

    def unlock_level_badge(self):
        badge_name = BADGE_NAMES[self.level - 1]
        badge, created = Badge.objects.get_or_create(name=badge_name, badge_type='level')
        if created:
            Notification.objects.create(
                user=self,
                title="Level Up!",
                message=f"Congratulations! You've reached level {self.level} and unlocked the {badge_name} badge.",
                type='level_up',
                related_object=badge
            )
        UserBadge.objects.get_or_create(user=self, badge=badge)


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')

    def __str__(self):
        return f"Profile of {self.user.full_name}"

class JobCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Job Categories"

class Job(models.Model):
    JOB_TYPE_CHOICES = (('remote', 'Remote'), ('local', 'Local'))
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, null=True, blank=True)
    skills = models.JSONField(default=list, blank=True)
    job_type = models.CharField(max_length=10, choices=JOB_TYPE_CHOICES)
    location = models.CharField(max_length=255, blank=True, null=True)
    county = models.ForeignKey('County', on_delete=models.SET_NULL, null=True, blank=True)
    sub_county = models.ForeignKey('SubCounty', on_delete=models.SET_NULL, null=True, blank=True)
    ward = models.ForeignKey('Ward', on_delete=models.SET_NULL, null=True, blank=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    deadline = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='open')

    def __str__(self):
        return self.title

class JobApplication(models.Model):
    STATUS_CHOICES = (('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected'))
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job', 'freelancer')

    def __str__(self):
        return f"Application for {self.job.title} by {self.freelancer.email}"

class SkillBarterPost(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='barter_posts')
    title = models.CharField(max_length=255)
    description = models.TextField()
    skills_offered = models.JSONField(default=list)
    skills_wanted = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class SkillBarterApplication(models.Model):
    STATUS_CHOICES = (('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected'))
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(SkillBarterPost, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='barter_applications')
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'applicant')

    def __str__(self):
        return f"Application by {self.applicant.email} for {self.post.title}"

class SkillBarterOffer(models.Model):
    STATUS_CHOICES = (('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected'), ('cancelled', 'Cancelled'))
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(SkillBarterPost, on_delete=models.CASCADE, related_name='offers')
    offered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_barter_offers')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Offer by {self.offered_by.email} on {self.post.title}"

class PortfolioItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='portfolio_items')
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='portfolio_images/', null=True, blank=True)
    document = models.FileField(upload_to='portfolio_documents/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class CommissionLog(models.Model):
    STATUS_CHOICES = (('paid', 'Paid'), ('due', 'Due'))
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.OneToOneField(Job, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=20.0)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2)
    freelancer_earning = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='due')
    due_date = models.DateField(blank=True, null=True)
    completion_date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    has_excuse = models.BooleanField(default=False)

    def __str__(self):
        return f"Commission for {self.job.title}"

class CommissionExcuse(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="excuses")
    commission = models.ForeignKey(CommissionLog, on_delete=models.CASCADE, related_name="excuses", null=True, blank=True)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_excuses')

    def __str__(self):
        return f"Excuse by {self.user.email} for commission {self.commission.id if self.commission else 'N/A'}"


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("job_update", "Job Update"),
        ("skill_barter", "Skill Barter"),
        ("commission", "Commission"),
        ("system", "System"),
        ("review", "Review"),
        ("badge_unlock", "Badge Unlock"),
        ("level_up", "Level Up"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES, default='system')
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Generic foreign key to link to any object
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.CharField(max_length=36, null=True, blank=True)
    related_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]

    def __str__(self):
        return f"Notification for {self.user.email}: {self.title}"


class Badge(models.Model):
    BADGE_TYPES = (('level', 'Level'), ('achievement', 'Achievement'))
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    icon = models.CharField(max_length=10, blank=True, null=True)
    badge_type = models.CharField(max_length=20, choices=BADGE_TYPES, default='achievement')

    def __str__(self):
        return self.name

class UserBadge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')

    def __str__(self):
        return f"{self.user.email} - {self.badge.name}"

class XPLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='xp_logs')
    points = models.IntegerField()
    source_job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.points} XP"

class Referral(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    referrer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='referrals_made')
    referred_user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name='referred_by', null=True, blank=True)
    referred_user_email = models.EmailField(max_length=255, null=True, blank=True, help_text="Email of the user being referred")
    is_successful = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.referred_user:
            return f"{self.referrer.email} referred {self.referred_user.email}"
        return f"{self.referrer.email} referred {self.referred_user_email or 'an unknown user'} (pending)"

class LoyaltyPointLog(models.Model):
    SOURCE_CHOICES = (('job', 'Job Completion'), ('referral', 'Successful Referral'))
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='loyalty_logs')
    points = models.IntegerField()
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.points} Loyalty Points ({self.source})"

class NotificationSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True, related_name='notification_settings')
    job_alerts = models.BooleanField(default=True)
    application_updates = models.BooleanField(default=True)
    new_message_notifications = models.BooleanField(default=True)

    def __str__(self):
        return f"Notification settings for {self.user.email}"

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='reviews', help_text="The completed job this review is for.")
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews_given')
    reviewee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews_received', help_text="The user being reviewed (freelancer or employer).", null=True)
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)], help_text="Rating out of 5 stars.")
    comment = models.TextField(blank=True, null=True)
    proof_image = models.ImageField(upload_to='reviews/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job', 'reviewer')

    def __str__(self):
        return f"Review for {self.reviewee.full_name} on {self.job.title} by {self.reviewer.full_name}"

class AboutUs(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='about_us/', blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "About Us"

    def __str__(self):
        return self.title

class County(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class SubCounty(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    county = models.ForeignKey(County, on_delete=models.CASCADE, related_name='sub_counties')

    class Meta:
        unique_together = ('name', 'county')

    def __str__(self):
        return f"{self.name}, {self.county.name}"

class Ward(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    sub_county = models.ForeignKey(SubCounty, on_delete=models.CASCADE, related_name='wards')

    class Meta:
        unique_together = ('name', 'sub_county')

    def __str__(self):
        return f"{self.name}, {self.sub_county.name}"

class NeighborhoodTag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
