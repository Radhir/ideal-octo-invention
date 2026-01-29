import React from 'react';
import { Home, ClipboardList, Settings, Users, FileText, User, Activity, MessageSquare, DollarSign, LayoutDashboard, Truck } from 'lucide-react';
import FloatingDock from './FloatingDock';

const BottomNav = () => {
    const navItems = [
        { title: "Home", icon: <Home className="h-full w-full" />, href: "/" },
        { title: "Advisor", icon: <LayoutDashboard className="h-full w-full" />, href: "/advisor-dashboard" },
        { title: "Forms", icon: <FileText className="h-full w-full text-blue-400" />, href: "/forms" },
        { title: "Jobs", icon: <ClipboardList className="h-full w-full" />, href: "/job-cards" },
        { title: "Media", icon: <Activity className="h-full w-full text-purple-400" />, href: "/media" },
        { title: "Finance", icon: <DollarSign className="h-full w-full" />, href: "/finance" },
        { title: "Reports", icon: <Activity className="h-full w-full text-emerald-400" />, href: "/reports" },
        { title: "HR", icon: <Users className="h-full w-full" />, href: "/hr/hub" },
        { title: "Workshop", icon: <Settings className="h-full w-full text-orange-400" />, href: "/workshop" },
        { title: "Schedule", icon: <ClipboardList className="h-full w-full text-yellow-500" />, href: "/scheduling" },
        { title: "Logistics", icon: <Truck className="h-full w-full" />, href: "/pick-drop" },
    ];

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
                items={navItems}
                desktopStyle={{}}
                mobileStyle={{}}
            />
        </div>
    );
};

export default BottomNav;
