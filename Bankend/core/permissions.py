from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow Owners and Admins to edit.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            role = request.user.hr_profile.role.lower()
            return 'owner' in role or 'admin' in role or 'managing director' in role
        except:
            return False

class IsManager(permissions.BasePermission):
    """
    Allows Managers, HODs, and Executives.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
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
        if not request.user.is_authenticated:
            return False
        
        elite_usernames = ['radhir', 'ruchika', 'afsar']
        is_elite = request.user.username.lower() in elite_usernames or request.user.is_superuser
        
        # Read-only access for others, or specific view logic
        if request.method in permissions.SAFE_METHODS:
            return True
            
        return is_elite

class IsAttendanceOnly(permissions.BasePermission):
    """
    Allows any authenticated user to create records (clock-in) but restricted CRUD otherwise.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        elite_usernames = ['radhir', 'ruchika', 'afsar']
        if request.user.username.lower() in elite_usernames or request.user.is_superuser:
            return True
            
        # Attendance specific: allow POST/GET for self
        return True # We'll filter the queryset in the viewset for privacy

class IsTechnician(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated
