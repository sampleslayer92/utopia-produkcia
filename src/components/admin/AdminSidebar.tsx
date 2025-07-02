
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  CheckSquare, 
  Handshake,
  Users,
  UserCog,
  TrendingUp,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import AdminProfile from "./AdminProfile";
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebar = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();
  
  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState<string[]>(['merchants', 'team']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId);
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

  // Determine dashboard path based on role
  const getDashboardPath = () => {
    if (userRole?.role === 'partner') return '/partner';
    if (userRole?.role === 'merchant') return '/merchant';
    return '/admin';
  };

  const getDashboardTitle = () => {
    if (userRole?.role === 'partner') return 'Partner Dashboard';
    if (userRole?.role === 'merchant') return 'Merchant Dashboard';
    return t('navigation.dashboard');
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: getDashboardTitle(),
      icon: LayoutDashboard,
      path: getDashboardPath(),
      active: location.pathname === getDashboardPath(),
      type: 'single'
    },
    // Only show deals for admin and partner
    ...(userRole?.role === 'admin' || userRole?.role === 'partner' ? [{
      id: 'deals',
      title: 'Deals',
      icon: Handshake,
      path: "/admin/deals",
      active: location.pathname.startsWith("/admin/deals"),
      type: 'single' as const
    }] : []),
    // Only show merchants for admin and partner
    ...(userRole?.role === 'admin' || userRole?.role === 'partner' ? [{
      id: 'merchants',
      title: t('navigation.merchants'),
      icon: Building2,
      type: 'expandable' as const,
      expanded: isExpanded('merchants'),
      children: [
        {
          title: t('navigation.allMerchants'),
          path: "/admin/merchants",
          active: isActive("/admin/merchants")
        },
        {
          title: "Prevádzky",
          path: "/admin/merchants/locations",
          active: isActive("/admin/merchants/locations")
        },
        {
          title: userRole?.role === 'partner' ? 'Moje zmluvy' : t('navigation.contracts'),
          path: "/admin/merchants/contracts",
          active: isActive("/admin/merchants/contracts")
        }
      ]
    }] : []),
    // Only show team management for admins
    ...(userRole?.role === 'admin' ? [{
      id: 'team',
      title: 'Správa tímu',
      icon: Users,
      type: 'expandable' as const,
      expanded: isExpanded('team'),
      children: [
        {
          title: 'Správa členov',
          path: "/admin/team",
          active: location.pathname === "/admin/team"
        },
        {
          title: 'Výkonnosť tímu',
          path: "/admin/team/performance",
          active: location.pathname === "/admin/team/performance"
        }
      ]
    }] : []),
    // Only show tasks for admin and partner (but disabled for now)
    ...(userRole?.role === 'admin' || userRole?.role === 'partner' ? [{
      id: 'tasks',
      title: t('navigation.tasks'),
      icon: CheckSquare,
      type: 'expandable' as const,
      expanded: isExpanded('tasks'),
      children: [
        {
          title: t('navigation.ticketingSystem'),
          path: "/admin/tasks/tickets",
          active: isActive("/admin/tasks/tickets"),
          disabled: true
        },
        {
          title: t('navigation.allTasks'),
          path: "/admin/tasks",
          active: isActive("/admin/tasks"),
          disabled: true
        },
        {
          title: t('navigation.completedTasks'),
          path: "/admin/tasks/completed",
          active: isActive("/admin/tasks/completed"),
          disabled: true
        }
      ]
    }] : [])
  ];

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-slate-200 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 flex justify-center">
        <img 
          src="https://cdn.prod.website-files.com/65bb58bd9feeda1fd2e1b551/65bb58bd9feeda1fd2e1b5ad_logo-header.svg" 
          alt="Onepos Logo" 
          className="h-10 w-auto"
        />
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.type === 'single' ? (
              <Button
                variant={item.active ? "default" : "ghost"}
                onClick={() => navigate(item.path!)}
                className={`w-full justify-start ${
                  item.active 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.title}
              </Button>
            ) : (
              <div className="space-y-1">
                {/* Section Header */}
                <Button
                  variant="ghost"
                  onClick={() => toggleSection(item.id)}
                  className="w-full justify-between text-slate-700 hover:bg-slate-100"
                >
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.title}
                  </div>
                  {item.expanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                
                {/* Expandable Children */}
                {item.expanded && (
                  <div className="ml-6 space-y-1">
                    {item.children?.map((child, index) => (
                      <Button
                        key={index}
                        variant={child.active ? "default" : "ghost"}
                        size="sm"
                        onClick={() => navigate(child.path)}
                        className={`w-full justify-start ${
                          child.active 
                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                        disabled={child.disabled}
                      >
                        {child.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Profile at bottom */}
      <div className="p-4 border-t border-slate-200">
        <AdminProfile />
      </div>
    </div>
  );
};

export default AdminSidebar;
