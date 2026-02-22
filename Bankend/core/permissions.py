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
            
            # 0. Check ModulePermission (Relational RBAC)
            module_name = getattr(view, 'module_name', None)
            if module_name:
                perm = profile.module_permissions.filter(module_name=module_name).first()
                if perm:
                    if request.method in permissions.SAFE_METHODS:
                        if not perm.can_view: return False
                    elif request.method == 'POST':
                        if not perm.can_create: return False
                    elif request.method in ['PUT', 'PATCH']:
                        if not perm.can_edit: return False
                    elif request.method == 'DELETE':
                        if not perm.can_delete: return False
                    # If specific permission is granted (or not denied above), we permit. 
                    # Actually, if record exists, we should probably return True if check passed.
                    # But the logic above only returns False on failure. 
                    # Let's trust the granular permission:
                    return True

            # 1. Dynamic Override Check (Legacy JSON Config)
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

class HasModulePermission(permissions.BasePermission):
    """
    Granular RBAC based on ModulePermission model.
    Requires view to have a 'module_name' attribute.
    """
    def has_permission(self, request, view):
        # Superusers and Elite users bypass
        if is_elite_user(request.user):
            return True
            
        module_name = getattr(view, 'module_name', None)
        if not module_name:
            # If no module name is defined on the view, fall back to existing legacy permissions or deny
            # For safety, we deny unless it matches IsAdminOrOwner logic which is usually comprised
            return False 
            
        try:
            profile = request.user.hr_profile
            # Check for ModulePermission entry
            # Note: We use .filter().first() to avoid errors if multiple or none exist
            perm = profile.module_permissions.filter(module_name=module_name).first()
            
            if not perm:
                # If no explicit permission record exists, deny access
                # (Unless we want a default open policy, but security dictates default closed)
                return False
                
            if request.method in permissions.SAFE_METHODS:
                return perm.can_view
            
            if request.method == 'POST':
                return perm.can_create
                
            if request.method in ['PUT', 'PATCH']:
                return perm.can_edit
                
            if request.method == 'DELETE':
                return perm.can_delete
                
            return False
        except Exception as e:
            # Log error if needed
            print(f"RBAC Error: {e}")
            return False
