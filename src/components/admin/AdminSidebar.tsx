
import { useTranslation } from 'react-i18next';
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
  ChevronRight,
  Building,
  Network
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import AdminProfile from "./AdminProfile";
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";

const AdminSidebar = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();
  
  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState<string[]>(['merchants', 'team', 'organizations']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId);
  const isActive = (path: string) => location.pathname === path;
  const isChildActive = (path: string) => location.pathname.startsWith(path) && location.pathname !== path;

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
          title: t('navigation.locations'),
          path: "/admin/merchants/locations",
          active: isActive("/admin/merchants/locations")
        },
        {
          title: userRole?.role === 'partner' ? t('navigation.myContracts') : t('navigation.contracts'),
          path: "/admin/merchants/contracts",
          active: isActive("/admin/merchants/contracts")
        }
      ]
    }] : []),
    // Only show organizations for admins
    ...(userRole?.role === 'admin' ? [{
      id: 'organizations',
      title: t('navigation.organizations'),
      icon: Building,
      type: 'expandable' as const,
      expanded: isExpanded('organizations'),
      children: [
        {
          title: t('navigation.organizationManagement'),
          path: "/admin/organizations",
          active: isActive("/admin/organizations")
        },
        {
          title: t('navigation.teamManagement'),
          path: "/admin/organizations/teams",
          active: isActive("/admin/organizations/teams")
        },
        {
          title: t('navigation.organizationalStructure'),
          path: "/admin/organizations/structure",
          active: isActive("/admin/organizations/structure")
        }
      ]
    }] : []),
    // Only show team management for admins
    ...(userRole?.role === 'admin' ? [{
      id: 'team',
      title: t('navigation.teamManagement'),
      icon: Users,
      type: 'expandable' as const,
      expanded: isExpanded('team'),
      children: [
        {
          title: t('navigation.teamMembers'),
          path: "/admin/team",
          active: location.pathname === "/admin/team"
        },
        {
          title: t('navigation.teamPerformance'),
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

  const { state } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r-0 shadow-lg">
      <SidebarHeader className="border-b border-slate-200/50">
        <div className="flex justify-center p-4">
          <div className="p-2">
            <img 
              src="https://cdn.prod.website-files.com/65bb58bd9feeda1fd2e1b551/65bb58bd9feeda1fd2e1b5ad_logo-header.svg" 
              alt="Onepos Logo" 
              className={state === "expanded" ? "h-6 w-auto" : "h-5 w-5"}
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-white to-slate-50/50 backdrop-blur-sm">
        <SidebarGroup className="px-3 py-4">
          <SidebarMenu className="space-y-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                {item.type === 'single' ? (
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    tooltip={state === "collapsed" ? item.title : undefined}
                     className={`rounded-xl transition-all duration-200 ${
                      item.active 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 !text-white shadow-lg hover:shadow-xl' 
                        : 'hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                    }`}
                  >
                    <button onClick={() => navigate(item.path!)}>
                      <item.icon className={`h-4 w-4 ${item.active ? 'text-white' : 'text-blue-500'}`} />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                ) : (
                  <>
                    <SidebarMenuButton
                      onClick={() => toggleSection(item.id)}
                      tooltip={state === "collapsed" ? item.title : undefined}
                      className={`rounded-xl transition-all duration-200 ${
                        item.expanded 
                          ? 'bg-blue-50 text-blue-700 shadow-sm' 
                          : 'hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                      }`}
                    >
                      <item.icon className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{item.title}</span>
                      {state === "expanded" && (
                        item.expanded ? (
                          <ChevronDown className="ml-auto h-4 w-4 text-blue-500 transition-transform duration-200" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4 text-blue-500 transition-transform duration-200" />
                        )
                      )}
                    </SidebarMenuButton>
                    
                    {item.expanded && state === "expanded" && (
                      <SidebarMenuSub className="ml-4 mt-2 space-y-1 border-l-2 border-blue-100 pl-4">
                        {item.children?.map((child, index) => (
                          <SidebarMenuSubItem key={index}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={child.active}
                               className={`rounded-lg transition-all duration-200 ${
                                 child.active 
                                   ? 'bg-gradient-to-r from-blue-400 to-indigo-400 !text-white shadow-md' 
                                   : 'hover:bg-blue-50 hover:text-blue-600'
                               } ${child.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <button 
                                onClick={() => navigate(child.path)}
                                disabled={child.disabled}
                              >
                                <span className="text-sm font-medium">{child.title}</span>
                              </button>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50/30 p-3">
        <AdminProfile />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
