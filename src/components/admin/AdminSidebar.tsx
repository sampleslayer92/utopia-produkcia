
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  FileText, 
  FileQuestion,
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
  BarChart3,
  Bell,
  Package,
  Palette,
  ShoppingCart,
  MapPin,
  BarChart2,
  User
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
    if (pathname.startsWith('/admin/deals') || pathname.startsWith('/admin/requests') || pathname.startsWith('/admin/contracts')) return 'business';
    if (pathname.startsWith('/admin/merchants')) return 'clients';
    if (pathname.startsWith('/admin/warehouse')) return 'products';
    if (pathname.startsWith('/admin/reporting')) return 'analytics';
    if (pathname.startsWith('/admin/organizations') || pathname.startsWith('/admin/team')) return 'system';
    if (pathname.startsWith('/admin/notifications') || pathname.startsWith('/admin/settings')) return 'personal';
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
    // 1. HLAVNÝ DASHBOARD
    {
      id: 'dashboard',
      title: getDashboardTitle(),
      icon: LayoutDashboard,
      path: getDashboardPath(),
      active: location.pathname === getDashboardPath(),
      type: 'single'
    },

    // 2. OBCHODNÉ PROCESY - Only for admin and partner
    ...(userRole?.role === 'admin' || userRole?.role === 'partner' ? [{
      id: 'business',
      title: '📊 Obchodné Procesy',
      icon: Handshake,
      type: 'expandable' as const,
      expanded: isExpanded('business'),
      children: [
        {
          title: t('navigation.overview'),
          path: "/admin/deals",
          active: location.pathname.startsWith("/admin/deals")
        },
        {
          title: t('navigation.requests'),
          path: "/admin/requests",
          active: location.pathname.startsWith("/admin/requests")
        },
        {
          title: t('navigation.contracts'),
          path: "/admin/contracts",
          active: location.pathname.startsWith("/admin/contracts")
        }
      ]
    }] : []),

    // 3. SPRÁVA KLIENTOV - Only for admin and partner
    ...(userRole?.role === 'admin' || userRole?.role === 'partner' ? [{
      id: 'clients',
      title: '🏢 Správa Klientov',
      icon: Building2,
      type: 'expandable' as const,
      expanded: isExpanded('clients'),
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
          title: userRole?.role === 'partner' ? t('navigation.myOldContracts') : t('navigation.oldContracts'),
          path: "/admin/merchants/contracts",
          active: isActive("/admin/merchants/contracts")
        }
      ]
    }] : []),

    // 4. PRODUKTOVÝ KATALÓG - Only for admin and partner
    ...(userRole?.role === 'admin' || userRole?.role === 'partner' ? [{
      id: 'products',
      title: '📦 Produktový Katalóg',
      icon: Package,
      type: 'expandable' as const,
      expanded: isExpanded('products'),
      children: [
        // Solutions & Products subsection
        {
          title: "🎯 " + t('navigation.solutions'),
          path: "/admin/warehouse/solutions",
          active: isActive("/admin/warehouse/solutions")
        },
        {
          title: "📦 " + t('navigation.allItems'),
          path: "/admin/warehouse",
          active: isActive("/admin/warehouse")
        },
        {
          title: "🎨 Visual Builder",
          path: "/admin/warehouse/visual-builder",
          active: isActive("/admin/warehouse/visual-builder")
        },
        // Configuration subsection
        {
          title: "📁 " + t('navigation.categories'),
          path: "/admin/warehouse/categories",
          active: isActive("/admin/warehouse/categories")
        },
        {
          title: "🏷️ " + t('navigation.itemTypes'),
          path: "/admin/warehouse/item-types",
          active: isActive("/admin/warehouse/item-types")
        },
        {
          title: "🔄 " + t('navigation.bulkOperations'),
          path: "/admin/warehouse/bulk",
          active: isActive("/admin/warehouse/bulk")
        },
        // Sales subsection
        {
          title: "💰 Rýchly predaj",
          path: "/admin/warehouse/quick-sale",
          active: isActive("/admin/warehouse/quick-sale")
        },
        {
          title: "➕ " + t('navigation.addItem'),
          path: "/admin/warehouse/add-item",
          active: isActive("/admin/warehouse/add-item")
        }
      ]
    }] : []),

    // 5. ANALÝZY & REPORTING - Only for admin and partner
    ...(userRole?.role === 'admin' || userRole?.role === 'partner' ? [{
      id: 'analytics',
      title: '📈 Analýzy & Reporting',
      icon: BarChart2,
      type: 'expandable' as const,
      expanded: isExpanded('analytics'),
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

    // 6. SPRÁVA SYSTÉMU - Only for admin
    ...(userRole?.role === 'admin' ? [{
      id: 'system',
      title: '⚙️ Správa Systému',
      icon: Settings,
      type: 'expandable' as const,
      expanded: isExpanded('system'),
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
          title: t('navigation.teamMembers'),
          path: "/admin/team",
          active: location.pathname === "/admin/team"
        },
        {
          title: t('navigation.organizationalStructure'),
          path: "/admin/organizations/structure",
          active: isActive("/admin/organizations/structure")
        }
      ]
    }] : []),

    // 7. OSOBNÉ - For all roles
    {
      id: 'personal',
      title: '👤 Osobné',
      icon: User,
      type: 'expandable' as const,
      expanded: isExpanded('personal'),
      children: [
        {
          title: t('navigation.notifications'),
          path: "/admin/notifications",
          active: location.pathname.startsWith("/admin/notifications")
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
                               }`}
                            >
                              <button 
                                onClick={() => navigate(child.path)}
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
