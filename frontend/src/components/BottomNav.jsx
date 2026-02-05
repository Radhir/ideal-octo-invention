import React from 'react';
import { Home, ClipboardList, Settings, Users, FileText, User, Activity, MessageSquare, DollarSign, LayoutDashboard, Truck } from 'lucide-react';
import FloatingDock from './FloatingDock';
import { usePermissions } from '../context/PermissionContext';

const BottomNav = () => {
    const { hasPermission } = usePermissions();

    const navItems = [
        { title: "Home", icon: <Home className="h-full w-full" />, href: "/", permission: 'dashboard' },
        { title: "Advisor", icon: <LayoutDashboard className="h-full w-full" />, href: "/advisor-dashboard", permission: 'job_cards' },
        { title: "Forms", icon: <FileText className="h-full w-full text-blue-400" />, href: "/forms", permission: 'job_cards' },
        { title: "Jobs", icon: <ClipboardList className="h-full w-full" />, href: "/job-cards", permission: 'job_cards' },
        { title: "Media", icon: <Activity className="h-full w-full text-purple-400" />, href: "/media", permission: 'marketing' },
        { title: "Finance", icon: <DollarSign className="h-full w-full" />, href: "/finance", permission: 'finance' },
        { title: "Reports", icon: <Activity className="h-full w-full text-emerald-400" />, href: "/reports", permission: 'reports' },
        { title: "HR", icon: <Users className="h-full w-full" />, href: "/hr/hub", permission: 'hr' },
        { title: "Workshop", icon: <Settings className="h-full w-full text-orange-400" />, href: "/workshop", permission: 'job_cards' },
        { title: "Schedule", icon: <ClipboardList className="h-full w-full text-yellow-500" />, href: "/scheduling", permission: 'calendar' },
        { title: "Logistics", icon: <Truck className="h-full w-full" />, href: "/pick-drop", permission: 'logistics' },
    ];

    // Filter items based on permissions
    const filteredItems = navItems.filter(item => {
        if (!item.permission) return true;
        // Exception: Regular employees can see Home even if dashboard permission is missing (as it redirects to their limited view)
        if (item.title === 'Home') return true;
        return hasPermission(item.permission);
    });

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            width: 'auto'
        }}>
            <FloatingDock
                items={filteredItems}
                desktopStyle={{}}
                mobileStyle={{}}
            />
        </div>
    );
};

export default BottomNav;
