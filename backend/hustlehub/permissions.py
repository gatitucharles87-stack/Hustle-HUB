from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return obj.user == request.user # Assuming the object has a 'user' field

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit or delete.
    Others can only read.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff # is_staff check for admin access

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Admins can edit/delete any object
        if request.user and request.user.is_staff:
            return True
        # For other methods, only the owner can modify (if applicable and user is not admin)
        # This assumes objects will have a 'user' field for ownership checks beyond admin
        return obj.user == request.user if hasattr(obj, 'user') else False


class IsEmployerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow employers or admins to access.
    """
    def has_permission(self, request, view):
        return request.user and (request.user.role == 'employer' or request.user.is_staff)

class IsFreelancerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow freelancers or admins to access.
    """
    def has_permission(self, request, view):
        return request.user and (request.user.role == 'freelancer' or request.user.is_staff)
