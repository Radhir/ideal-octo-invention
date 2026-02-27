import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRouter = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    // 1. Check explicitly assigned superuser dashboard in permissions_config
    const configDashboard = user.hr_profile?.config?.dashboard;

    if (configDashboard) {
        switch (configDashboard) {
            case 'AdvisorDashboard': return <Navigate to="/dashboard/advisor" replace />;
            case 'OperationsDashboard': return <Navigate to="/dashboard/operations" replace />;
            case 'DriverDashboard': return <Navigate to="/pick-drop" replace />;
            case 'SalesDashboard': return <Navigate to="/dashboard/sales" replace />;
            case 'TradingDashboard': return <Navigate to="/dashboard/trading" replace />;
            case 'ManagementDashboard': return <Navigate to="/dashboard/management" replace />;
            case 'CEOConsole': return <Navigate to="/ceo/command" replace />;
            case 'EmployeeDashboard': return <Navigate to="/dashboard/employee" replace />;
            default: break;
        }
    }

    // 2. Fallback to Role-based logic
    const role = (user.role || '').toLowerCase();

    if (role.includes('ceo') || role.includes('general manager') || role.includes('director')) {
        return <Navigate to="/ceo/command" replace />;
    }
    if (role.includes('manager')) {
        return <Navigate to="/dashboard/management" replace />;
    }
    if (role.includes('operations') || role.includes('ops')) {
        return <Navigate to="/dashboard/operations" replace />;
    }
    if (role.includes('advisor')) {
        return <Navigate to="/dashboard/advisor" replace />;
    }
    if (role.includes('sales')) {
        return <Navigate to="/dashboard/sales" replace />;
    }
    if (role.includes('inventory') || role.includes('store') || role.includes('procurement')) {
        return <Navigate to="/dashboard/trading" replace />;
    }
    if (role.includes('driver') || role.includes('logistics')) {
        return <Navigate to="/pick-drop" replace />;
    }

    // Default fallback point
    return <Navigate to="/dashboard/employee" replace />;
};

export default RoleBasedRouter;
