from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django import forms
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import path

from .models import (
    User, Job, JobApplication, SkillBarterPost, SkillBarterOffer,
    CommissionLog, Badge, UserBadge, XPLog, Referral, LoyaltyPointLog, NotificationSettings, Review, CommissionExcuse, Notification,
    PortfolioItem, SkillBarterApplication
)
from django.utils import timezone

# Custom User Admin
class NotificationForm(forms.Form):
    _selected_action = forms.CharField(widget=forms.MultipleHiddenInput)
    title = forms.CharField(max_length=255)
    message = forms.CharField(widget=forms.Textarea, label="Notification Message")

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'full_name', 'role', 'is_staff', 'is_active')
    search_fields = ('email', 'full_name')
    ordering = ('email',)
    filter_horizontal = ()
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('full_name', 'role', 'is_remote_available', 'service_areas', 'username', 'referral_code', 'xp_points', 'level')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Admin Actions
    actions = ['suspend_users', 'unsuspend_users', 'credit_loyalty_points', 'send_notification']

    def suspend_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, "Selected users have been suspended.")
    suspend_users.short_description = "Suspend selected users"

    def unsuspend_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, "Selected users have been unsuspended.")
    unsuspend_users.short_description = "Unsuspend selected users"

    def credit_loyalty_points(self, request, queryset):
        for user in queryset:
            # Example: Credit 100 loyalty points for selected users
            LoyaltyPointLog.objects.create(user=user, points=100, source='admin_credit')
        self.message_user(request, "Loyalty points credited to selected users.")
    credit_loyalty_points.short_description = "Credit 100 loyalty points to selected users"

    def send_notification(self, request, queryset):
        form = NotificationForm(request.POST or None)

        if 'apply' in request.POST:
            if form.is_valid():
                title = form.cleaned_data['title']
                message = form.cleaned_data['message']
                for user in queryset:
                    Notification.objects.create(user=user, title=title, message=message, type="system")
                self.message_user(request, f"Notification sent to {queryset.count()} users.")
                return HttpResponseRedirect(request.get_full_path())

        context = {
            'title': "Send Notification",
            'queryset': queryset,
            'form': form,
            'action_name': 'send_notification'
        }
        return render(request, 'admin/send_notification_intermediate.html', context)
    send_notification.short_description = "Send notification to selected users"


admin.site.register(User, UserAdmin)

# Job Admin
@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'employer', 'status', 'created_at', 'budget', 'job_type')
    list_filter = ('status', 'job_type', 'category')
    search_fields = ('title', 'description', 'employer__full_name')
    date_hierarchy = 'created_at'
    raw_id_fields = ('employer',)

# Register other models
@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('job', 'freelancer', 'status', 'applied_at')
    list_filter = ('status',)
    search_fields = ('job__title', 'freelancer__full_name')

@admin.register(SkillBarterPost)
class SkillBarterPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'skills_offered', 'skills_wanted', 'user__full_name')

@admin.register(SkillBarterApplication)
class SkillBarterApplicationAdmin(admin.ModelAdmin):
    list_display = ('post', 'applicant', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('post__title', 'applicant__full_name')

@admin.register(SkillBarterOffer)
class SkillBarterOfferAdmin(admin.ModelAdmin):
    list_display = ('post', 'offered_by', 'created_at', 'status')
    list_filter = ('status',)
    search_fields = ('post__title', 'offered_by__full_name', 'message')

@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at')
    search_fields = ('title', 'description', 'user__full_name')

@admin.register(CommissionLog)
class CommissionLogAdmin(admin.ModelAdmin):
    list_display = ('job', 'total_amount', 'commission_amount', 'freelancer_earning', 'created_at', 'has_excuse')
    search_fields = ('job__title',)
    list_filter = ('status', 'has_excuse')

@admin.register(CommissionExcuse)
class CommissionExcuseAdmin(admin.ModelAdmin):
    list_display = ('user', 'commission', 'reason', 'status', 'created_at', 'reviewed_at', 'reviewed_by')
    list_filter = ('status', 'created_at', 'reviewed_at')
    search_fields = ('user__full_name', 'reason', 'commission__job__title')
    raw_id_fields = ('user', 'commission', 'reviewed_by')
    actions = ['approve_excuses', 'reject_excuses']

    def approve_excuses(self, request, queryset):
        queryset.update(status='approved', reviewed_at=timezone.now(), reviewed_by=request.user)
        for excuse in queryset:
            Notification.objects.create(
                user=excuse.user,
                title="Commission Excuse Approved",
                message=f"Your excuse for commission on job '{excuse.commission.job.title}' has been approved.",
                type="commission"
            )
        self.message_user(request, "Selected excuses have been approved.")
    approve_excuses.short_description = "Approve selected commission excuses"

    def reject_excuses(self, request, queryset):
        queryset.update(status='rejected', reviewed_at=timezone.now(), reviewed_by=request.user)
        for excuse in queryset:
            Notification.objects.create(
                user=excuse.user,
                title="Commission Excuse Rejected",
                message=f"Your excuse for commission on job '{excuse.commission.job.title}' has been rejected.",
                type="commission"
            )
        self.message_user(request, "Selected excuses have been rejected.")
    reject_excuses.short_description = "Reject selected commission excuses"

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'type', 'is_read', 'created_at')
    list_filter = ('is_read', 'type')
    search_fields = ('user__email', 'title', 'message')
    raw_id_fields = ('user',)
    date_hierarchy = 'created_at'
    actions = ['mark_as_read', 'mark_as_unread']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
        self.message_user(request, "Selected notifications have been marked as read.")
    mark_as_read.short_description = "Mark selected as read"

    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
        self.message_user(request, "Selected notifications have been marked as unread.")
    mark_as_unread.short_description = "Mark selected as unread"

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')

@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'awarded_at')
    search_fields = ('user__full_name', 'badge__name')

@admin.register(XPLog)
class XPLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'points', 'source_job', 'created_at')
    list_filter = ('source_job__status',)
    search_fields = ('user__full_name', 'source_job__title')

@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ('referrer', 'referred_user', 'is_successful', 'created_at')
    list_filter = ('is_successful',)
    search_fields = ('referrer__full_name', 'referred_user__full_name')

@admin.register(LoyaltyPointLog)
class LoyaltyPointLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'points', 'source', 'created_at')
    list_filter = ('source',)
    search_fields = ('user__full_name',)

@admin.register(NotificationSettings)
class NotificationSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'job_alerts', 'application_updates', 'new_message_notifications')
    search_fields = ('user__full_name',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('job', 'reviewer', 'reviewee', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('job__title', 'reviewer__full_name', 'reviewee__full_name', 'comment')
    raw_id_fields = ('job', 'reviewer', 'reviewee')
