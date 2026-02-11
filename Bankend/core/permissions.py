from rest_framework import permissions

ELITE_USERNAMES = ['radhir', 'ruchika', 'afsar', 'ravit', 'ankit']

def is_elite_user(user):
    if not user or not user.is_authenticated:
        return False
    return user.username.lower() in ELITE_USERNAMES or user.is_superuser

class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow Owners, Admins, Service Advisors, and Managers to edit.
    """
    def has_permission(self, request, view):
        if is_elite_user(request.user):
            return True
        try:
            role = request.user.hr_profile.role.lower()
            allowed = ['owner', 'admin', 'managing director', 'manager', 'advisor', 'reception', 'supervisor']
            return any(r in role for r in allowed)
        except:
            return False

class IsManager(permissions.BasePermission):
    """
    Allows Managers, HODs, and Executives.
    """
    def has_permission(self, request, view):
        if is_elite_user(request.user):
            return True
        try:
            role = request.user.hr_profile.role.lower()
            allowed = ['manager', 'head', 'lead', 'incharge', 'director', 'admin', 'owner']
            return any(r in role for r in allowed)
        except:
            return False

class IsEliteAdmin(permissions.BasePermission):
    """
    Strict access for Radhir, Ruchika, and Afsar.
    """
    def has_permission(self, request, view):
        if is_elite_user(request.user):
            return True
            
        # Read-only access for others, or specific view logic
        if request.method in permissions.SAFE_METHODS:
            return True
            
        return False

class IsAttendanceOnly(permissions.BasePermission):
    """
    Allows any authenticated user to create records (clock-in) but restricted CRUD otherwise.
    """
    def has_permission(self, request, view):
        if is_elite_user(request.user):
            return True
            
        # Attendance specific: allow POST/GET for self
        return True # We'll filter the queryset in the viewset for privacy

class IsTechnician(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

class IsFinanceUser(permissions.BasePermission):
    """
    Access for Finance, Owner, and Admin roles.
    """
    def has_permission(self, request, view):
        if is_elite_user(request.user):
            return True
        try:
            role = request.user.hr_profile.role.lower()
            allowed = ['finance', 'accountant', 'owner', 'admin']
            return any(r in role for r in allowed)
        except:
            return False
