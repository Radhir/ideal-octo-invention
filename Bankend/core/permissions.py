from rest_framework import permissions

ELITE_USERNAMES = ['radhir', 'ruchika', 'afsar', 'ravit', 'ankit']

def is_elite_user(user):
    if not user or not user.is_authenticated:
        return False
    return user.username.lower() in ELITE_USERNAMES or user.is_superuser

class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow Owners, Admins, Service Advisors, and Managers to edit.
    Now supports dynamic module-level overrides via Employee.permissions_config.
    """
    def has_permission(self, request, view):
        user = request.user
        if is_elite_user(user):
            return True

        try:
            profile = user.hr_profile
            
            # 1. Dynamic Override Check (MongoDB-style)
            # Example: permissions_config = {"Inventory": {"can_view": True, "can_edit": False}}
            module_name = getattr(view, 'module_name', None)
            if module_name and profile.permissions_config:
                module_cfg = profile.permissions_config.get(module_name)
                if module_cfg:
                    # If explicitly denied, return False
                    if module_cfg.get('denied'): return False
                    
                    # Logic for specific methods
                    if request.method in permissions.SAFE_METHODS and module_cfg.get('can_view'):
                        return True
                    if request.method in ['POST', 'PUT', 'PATCH'] and module_cfg.get('can_edit'):
                        return True
                    if request.method == 'DELETE' and module_cfg.get('can_delete'):
                        return True

            # 2. Legacy Role-based Fallback
            role = profile.role.lower()
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
