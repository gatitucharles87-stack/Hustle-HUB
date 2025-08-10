from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import (
    JobApplication, SkillBarterApplication, CommissionExcuse, Review, UserBadge,
    Notification, User
)

@receiver(post_save, sender=JobApplication)
def create_job_application_notification(sender, instance, created, **kwargs):
    if instance.status in ['accepted', 'rejected']:
        Notification.objects.create(
            user=instance.freelancer,
            title=f"Application for {instance.job.title} {instance.status}",
            message=f"Your application for the job '{instance.job.title}' has been {instance.status}.",
            type='job_update',
            related_object=instance.job
        )

@receiver(post_save, sender=SkillBarterApplication)
def create_skill_barter_notification(sender, instance, created, **kwargs):
    if instance.status in ['accepted', 'rejected']:
        Notification.objects.create(
            user=instance.applicant,
            title=f"Skill Barter Proposal {instance.status.capitalize()}",
            message=f"Your proposal for '{instance.post.title}' has been {instance.status}.",
            type='skill_barter',
            related_object=instance.post
        )

@receiver(post_save, sender=CommissionExcuse)
def create_commission_excuse_notification(sender, instance, created, **kwargs):
    if instance.status in ['approved', 'rejected']:
        Notification.objects.create(
            user=instance.user,
            title=f"Commission Excuse {instance.status.capitalize()}",
            message=f"Your commission excuse has been {instance.status}.",
            type='commission',
            related_object=instance
        )

@receiver(post_save, sender=Review)
def create_review_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.reviewee,
            title="You have a new review!",
            message=f"{instance.reviewer.full_name} left a review for you on the job '{instance.job.title}'.",
            type='review',
            related_object=instance
        )

@receiver(post_save, sender=UserBadge)
def create_badge_unlock_notification(sender, instance, created, **kwargs):
    if created:
        # Avoid creating a duplicate notification for level-up badges
        if instance.badge.badge_type != 'level':
            Notification.objects.create(
                user=instance.user,
                title="New Badge Unlocked!",
                message=f"You've unlocked the '{instance.badge.name}' badge. Congratulations!",
                type='badge_unlock',
                related_object=instance.badge
            )
