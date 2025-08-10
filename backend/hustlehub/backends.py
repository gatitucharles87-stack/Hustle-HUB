from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        print(f"[DEBUG] EmailBackend - Authenticating. Username (email): {username}, Password: {password}")
        try:
            user = UserModel.objects.get(email=username)
            print(f"[DEBUG] EmailBackend - User found: {user.email}")
        except UserModel.DoesNotExist:
            print(f"[DEBUG] EmailBackend - User with email {username} does not exist.")
            return None
        
        if user.check_password(password):
            print(f"[DEBUG] EmailBackend - Password check successful for {user.email}")
            return user
        else:
            print(f"[DEBUG] EmailBackend - Password check failed for {user.email}")
            return None

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None