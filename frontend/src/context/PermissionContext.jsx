import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';

/**
 * Permission System for Elite Shine ERP
 * 
 * ROLES:
 * - OWNER: Ruchika - Full access to everything
 * - ADMIN: Radhir and other admins - Full access
 * - EMPLOYEE: Regular employees - Only Calendar + Clock In
 * 
 * PERMISSIONS:
 * - dashboard: View main dashboard
 * - leads: Manage leads
 * - bookings: Manage bookings
 * - job_cards: Manage job cards
 * - invoices: Manage invoices
 * - customers: Manage customers
 * - hr: HR management
 * - finance: Finance management
 * - marketing: Marketing management
 * - settings: System settings
 * - calendar: View calendar (everyone)
 * - attendance: Clock in/out (everyone)
 */

const PermissionContext = createContext(null);

// Define role hierarchy
const ROLES = {
    OWNER: 'owner',       // Ruchika - MD/Owner
    ADMIN: 'admin',       // Administrators
    MANAGER: 'manager',   // Department managers
    EMPLOYEE: 'employee', // Regular employees
};

// Define what each role can access
const ROLE_PERMISSIONS = {
    [ROLES.OWNER]: [
        'dashboard', 'leads', 'bookings', 'job_cards', 'invoices',
        'customers', 'hr', 'finance', 'marketing', 'logistics',
        'settings', 'calendar', 'attendance', 'reports', 'all'
    ],
    [ROLES.ADMIN]: [
        'dashboard', 'leads', 'bookings', 'job_cards', 'invoices',
        'customers', 'hr', 'marketing', 'logistics',
        'calendar', 'attendance', 'reports'
    ],
    [ROLES.MANAGER]: [
        'dashboard', 'leads', 'bookings', 'job_cards', 'invoices',
        'customers', 'calendar', 'attendance', 'reports'
    ],
    [ROLES.EMPLOYEE]: [
        'calendar', 'attendance'
    ],
};

// Users with special roles (username -> role)
const SPECIAL_USERS = {
    'ruchika': ROLES.OWNER,
    'radhir': ROLES.ADMIN,
};

export const PermissionProvider = ({ children }) => {
    const { user } = useAuth();

    // Determine user's role
    const role = useMemo(() => {
        if (!user) return ROLES.EMPLOYEE;

        const username = user.username?.toLowerCase();

        // Check special users first
        if (SPECIAL_USERS[username]) {
            return SPECIAL_USERS[username];
        }

        // Check if user is staff/superuser
        if (user.is_superuser || user.is_staff) {
            return ROLES.ADMIN;
        }

        // Check role from backend
        const userRole = user.role?.toLowerCase();
        if (userRole?.includes('owner') || userRole?.includes('director')) return ROLES.OWNER;
        if (userRole?.includes('admin') || userRole?.includes('manager')) return ROLES.ADMIN;

        return ROLES.EMPLOYEE;
    }, [user]);

    const permissions = useMemo(() => {
        // 1. Role-based defaults
        let perms = [...(ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.EMPLOYEE])];

        // 2. Elite user bypass
        if (perms.includes('all')) return perms;

        // 3. Dynamic Module Permissions from Backend
        if (user?.hr_profile?.permissions) {
            user.hr_profile.permissions.forEach(p => {
                const moduleName = p.module_name.toLowerCase().replace(' ', '_');
                if (p.can_view) {
                    if (!perms.includes(moduleName)) perms.push(moduleName);
                } else {
                    // Explicitly remove if denied (strict enforcement)
                    perms = perms.filter(item => item !== moduleName);
                }
            });
        }

        return perms;
    }, [role, user]);

    // Check if user has a specific permission
    const hasPermission = useMemo(() => (permission) => {
        if (permissions.includes('all')) return true;
        return permissions.includes(permission);
    }, [permissions]);

    // Check if user has any of the given permissions
    const hasAnyPermission = useMemo(() => (perms) => {
        if (permissions.includes('all')) return true;
        return perms.some(p => permissions.includes(p));
    }, [permissions]);

    // Check if user is owner
    const isOwner = useMemo(() => () => role === ROLES.OWNER, [role]);

    // Check if user is admin or higher
    const isAdmin = useMemo(() => () => [ROLES.OWNER, ROLES.ADMIN].includes(role), [role]);

    // Check if user is at least a manager
    const isManager = useMemo(() => () => [ROLES.OWNER, ROLES.ADMIN, ROLES.MANAGER].includes(role), [role]);

    const value = useMemo(() => ({
        role,
        permissions,
        hasPermission,
        hasAnyPermission,
        isOwner,
        isAdmin,
        isManager,
        ROLES,
    }), [role, permissions, hasPermission, hasAnyPermission, isOwner, isAdmin, isManager]);

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('usePermissions must be used within a PermissionProvider');
    }
    return context;
};

// HOC for protecting routes/components
export const withPermission = (WrappedComponent, requiredPermission) => {
    return function ProtectedComponent(props) {
        const { hasPermission } = usePermissions();

        if (!hasPermission(requiredPermission)) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '60vh',
                    color: '#fff',
                    fontFamily: 'Outfit, sans-serif',
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
                    <h2 style={{ margin: '0 0 10px 0' }}>Access Restricted</h2>
                    <p style={{ color: '#94a3b8' }}>
                        Contact Ruchika (MD) for permission to access this feature.
                    </p>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};

export default PermissionContext;
