
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
  ChevronRight
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

  const { state } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex justify-center p-2">
          <img 
            src="https://cdn.prod.website-files.com/65bb58bd9feeda1fd2e1b551/65bb58bd9feeda1fd2e1b5ad_logo-header.svg" 
            alt="Onepos Logo" 
            className={state === "expanded" ? "h-8 w-auto" : "h-6 w-6"}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                {item.type === 'single' ? (
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <button onClick={() => navigate(item.path!)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                ) : (
                  <>
                    <SidebarMenuButton
                      onClick={() => toggleSection(item.id)}
                      tooltip={state === "collapsed" ? item.title : undefined}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {state === "expanded" && (
                        item.expanded ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )
                      )}
                    </SidebarMenuButton>
                    
                    {item.expanded && state === "expanded" && (
                      <SidebarMenuSub>
                        {item.children?.map((child, index) => (
                          <SidebarMenuSubItem key={index}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={child.active}
                            >
                              <button 
                                onClick={() => navigate(child.path)}
                                disabled={child.disabled}
                              >
                                <span>{child.title}</span>
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

      <SidebarFooter className="border-t">
        <AdminProfile />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
