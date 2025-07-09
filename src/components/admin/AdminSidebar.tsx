
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
  Network,
  Settings,
  Warehouse,
  BarChart3
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
  
  // Helper function to determine which section should be expanded based on current path
  const getActiveSectionId = (pathname: string): string | null => {
    if (pathname.startsWith('/admin/merchants')) return 'merchants';
    if (pathname.startsWith('/admin/warehouse')) return 'warehouse';
    if (pathname.startsWith('/admin/reporting')) return 'reporting';
    if (pathname.startsWith('/admin/organizations')) return 'organizations';
    if (pathname.startsWith('/admin/team')) return 'team';
    if (pathname.startsWith('/admin/tasks')) return 'tasks';
    if (pathname.startsWith('/admin/settings')) return 'settings';
    return null;
  };

  // State for expandable sections - initialize with current active section
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const activeSection = getActiveSectionId(location.pathname);
    return activeSection ? [activeSection] : [];
  });

  // Accordion behavior - only one section expanded at a time
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? [] // Close if already open
        : [sectionId] // Open only this section, close others
    );
  };

  // Auto-expand section when route changes
  useEffect(() => {
    const activeSection = getActiveSectionId(location.pathname);
    if (activeSection) {
      setExpandedSections([activeSection]);
    }
  }, [location.pathname]);

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
    // Only show warehouse for admin and partner
    ...(userRole?.role === 'admin' || userRole?.role === 'partner' ? [{
      id: 'warehouse',
      title: t('navigation.warehouse'),
      icon: Warehouse,
      type: 'expandable' as const,
      expanded: isExpanded('warehouse'),
      children: [
        {
          title: t('navigation.allItems'),
          path: "/admin/warehouse",
          active: isActive("/admin/warehouse")
        },
        {
          title: t('navigation.devices'),
          path: "/admin/warehouse/devices",
          active: isActive("/admin/warehouse/devices")
        },
        {
          title: t('navigation.services'),
          path: "/admin/warehouse/services",
          active: isActive("/admin/warehouse/services")
        }
      ]
    }] : []),
    // Only show reporting for admin and partner
    ...(userRole?.role === 'admin' || userRole?.role === 'partner' ? [{
      id: 'reporting',
      title: t('navigation.reporting'),
      icon: BarChart3,
      type: 'expandable' as const,
      expanded: isExpanded('reporting'),
      children: [
        {
          title: t('navigation.reportsDashboard'),
          path: "/admin/reporting",
          active: isActive("/admin/reporting")
        },
        {
          title: t('navigation.businessReports'),
          path: "/admin/reporting/business",
          active: isActive("/admin/reporting/business")
        },
        {
          title: t('navigation.technicalReports'),
          path: "/admin/reporting/technical",
          active: isActive("/admin/reporting/technical")
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
    }] : []),
    // Settings for all roles
    {
      id: 'settings',
      title: t('navigation.settings'),
      icon: Settings,
      type: 'expandable' as const,
      expanded: isExpanded('settings'),
      children: [
        {
          title: t('navigation.applicationSettings'),
          path: "/admin/settings/application",
          active: isActive("/admin/settings/application")
        },
        {
          title: t('navigation.profileSettings'),
          path: "/admin/settings/profile",
          active: isActive("/admin/settings/profile")
        }
      ]
    }
  ];

  const { state } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r-0 shadow-lg bg-card-dark">
      <SidebarHeader className="border-b border-white/10 bg-card-dark">
        <div className="flex justify-center p-6">
          <div className="p-2">
            <img 
              src="https://cdn.prod.website-files.com/65bb58bd9feeda1fd2e1b551/65bb58bd9feeda1fd2e1b5ad_logo-header.svg" 
              alt="Onepos Logo" 
              className={state === "expanded" ? "h-6 w-auto" : "h-5 w-5"}
              style={{ filter: 'invert(1)' }}
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-card-dark">
        <SidebarGroup className="px-4 py-6">
          <SidebarMenu className="space-y-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                {item.type === 'single' ? (
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    tooltip={state === "collapsed" ? item.title : undefined}
                     className={`rounded-lg transition-colors duration-200 font-medium ${
                      item.active 
                        ? 'bg-primary text-black shadow-sm' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <button onClick={() => navigate(item.path!)}>
                      <item.icon className={`h-4 w-4 ${item.active ? 'text-black' : 'text-white/70'}`} />
                      <span className="text-sm font-medium">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                ) : (
                  <>
                    <SidebarMenuButton
                      onClick={() => toggleSection(item.id)}
                      tooltip={state === "collapsed" ? item.title : undefined}
                      className={`rounded-lg transition-colors duration-200 font-medium ${
                        item.expanded 
                          ? 'bg-white/10 text-white' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-4 w-4 text-white/70" />
                      <span className="text-sm font-medium">{item.title}</span>
                      {state === "expanded" && (
                        item.expanded ? (
                          <ChevronDown className="ml-auto h-3 w-3 text-white/70 transition-transform duration-200" />
                        ) : (
                          <ChevronRight className="ml-auto h-3 w-3 text-white/70 transition-transform duration-200" />
                        )
                      )}
                    </SidebarMenuButton>
                    
                    {item.expanded && state === "expanded" && (
                      <SidebarMenuSub className="ml-6 mt-2 space-y-1 border-l-2 border-white/20 pl-4">
                        {item.children?.map((child, index) => (
                          <SidebarMenuSubItem key={index}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={child.active}
                               className={`rounded-lg transition-colors duration-200 font-medium ${
                                 child.active 
                                   ? 'bg-primary text-black shadow-sm' 
                                   : 'text-white/60 hover:bg-white/5 hover:text-white'
                               } ${child.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <button 
                                onClick={() => navigate(child.path)}
                                disabled={child.disabled}
                              >
                                <span className="text-sm">{child.title}</span>
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

      <SidebarFooter className="border-t border-white/10 bg-card-dark p-4">
        <AdminProfile />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
