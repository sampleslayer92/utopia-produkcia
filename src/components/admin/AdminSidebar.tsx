import { useTranslation } from 'react-i18next';
import { 
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { BarChart3, FileText, Users, Package, Settings, Briefcase, Bell, Building, UserCheck, TrendingUp, Archive, PlusCircle, GitBranch, Eye, Tags, ShoppingBag, Users2, MapPin, Layers3, ShoppingCart, Languages } from 'lucide-react';
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
    if (pathname.startsWith('/admin/onboarding-config')) return 'onboarding';
    if (pathname.startsWith('/admin/organizations') || pathname.startsWith('/admin/team') || pathname.startsWith('/admin/templates')) return 'system';
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

  // Helper function to get default route for expandable sections
  const getDefaultRoute = (sectionId: string): string => {
    switch (sectionId) {
      case 'business': return '/admin/deals';
      case 'clients': return '/admin/merchants';
      case 'products': return '/admin/warehouse';
      case 'analytics': return '/admin/reporting';
      case 'onboarding': return '/admin/onboarding-config';
      case 'system': return '/admin/organizations';
      case 'personal': return '/admin/notifications';
      default: return '/admin';
    }
  };

  const menuItems = [
    // 1. HLAVNÝ DASHBOARD
    {
      id: 'dashboard',
      title: '🏠 ' + getDashboardTitle(),
      path: getDashboardPath(),
      active: location.pathname === getDashboardPath(),
      type: 'single'
    },

    // 2. OBCHODNÉ PROCESY - Only for admin and partner
    ...(userRole?.role === 'admin' || userRole?.role === 'partner' ? [{
      id: 'business',
      title: '💼 Obchodné Procesy',
      type: 'expandable' as const,
      expanded: isExpanded('business'),
      defaultRoute: '/admin/deals',
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
      title: '👥 Správa Klientov',
      type: 'expandable' as const,
      expanded: isExpanded('clients'),
      defaultRoute: '/admin/merchants',
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
      type: 'expandable' as const,
      expanded: isExpanded('products'),
      defaultRoute: '/admin/warehouse',
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
      title: '📊 Analýzy & Reporting',
      type: 'expandable' as const,
      expanded: isExpanded('analytics'),
      defaultRoute: '/admin/reporting',
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

    // 6. ONBOARDING SPRÁVA - Only for admin
    ...(userRole?.role === 'admin' ? [{
      id: 'onboarding',
      title: '📋 Správa Onboardingu',
      type: 'expandable' as const,
      expanded: isExpanded('onboarding'),
      defaultRoute: '/admin/onboarding-config',
      children: [
        {
          title: "📝 Konfigurácia krokov",
          path: "/admin/onboarding-config",
          active: location.pathname.startsWith("/admin/onboarding-config")
        },
        {
          title: "🎯 Šablóny formulárov",
          path: "/admin/onboarding-config/templates",
          active: isActive("/admin/onboarding-config/templates")
        },
        {
          title: "👁️ Náhľad onboardingu",
          path: "/admin/onboarding",
          active: isActive("/admin/onboarding")
        }
      ]
    }] : []),

    // 7. SPRÁVA SYSTÉMU - Only for admin
    ...(userRole?.role === 'admin' ? [{
      id: 'system',
      title: '⚙️ Správa Systému',
      type: 'expandable' as const,
      expanded: isExpanded('system'),
      defaultRoute: '/admin/organizations',
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
          title: "🌐 Preklady",
          path: "/admin/translations",
          active: location.pathname === "/admin/translations"
        },
        {
          title: "📄 Šablóny Zmlúv",
          path: "/admin/templates",
          active: location.pathname.startsWith("/admin/templates")
        },
        {
          title: t('navigation.organizationalStructure'),
          path: "/admin/organizations/structure",
          active: isActive("/admin/organizations/structure")
        }
      ]
    }] : []),

    // 8. OSOBNÉ - For all roles
    {
      id: 'personal',
      title: '👤 Osobné',
      type: 'expandable' as const,
      expanded: isExpanded('personal'),
      defaultRoute: '/admin/notifications',
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
        <div className="flex items-center justify-center px-4 h-16">
          <img 
            src="https://cdn.prod.website-files.com/65bb58bd9feeda1fd2e1b551/65bb58bd9feeda1fd2e1b5ad_logo-header.svg" 
            alt="Onepos Logo" 
            className={state === "expanded" ? "h-6 w-auto" : "h-5 w-5"}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-white to-slate-50/50 backdrop-blur-sm">
        <SidebarGroup className="px-3 py-4">
          <SidebarMenu className={state === "collapsed" ? "space-y-4" : "space-y-3 px-1"}>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                {item.type === 'single' ? (
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    tooltip={state === "collapsed" ? item.title : undefined}
                      className={`rounded-xl transition-all duration-200 ${state === "collapsed" ? "w-full flex justify-center items-center p-3 mx-auto" : ""} ${
                       item.active 
                         ? 'bg-gradient-to-r from-blue-500 to-indigo-500 !text-white shadow-lg hover:shadow-xl' 
                         : 'hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                     }`}
                  >
                    <button onClick={() => navigate(item.path!)}>
                      <span className="text-lg">{item.title.split(' ')[0]}</span>
                      <span className="font-medium ml-2">{item.title.split(' ').slice(1).join(' ')}</span>
                    </button>
                  </SidebarMenuButton>
                ) : (
                  <>
                    <SidebarMenuButton
                      onClick={() => {
                        if (state === "collapsed") {
                          // In mini mode, navigate to default route
                          navigate(item.defaultRoute || getDefaultRoute(item.id));
                        } else {
                          // In expanded mode, toggle section
                          toggleSection(item.id);
                        }
                      }}
                      tooltip={state === "collapsed" ? `${item.title} - Kliknite pre navigáciu` : undefined}
                      className={`rounded-xl transition-all duration-200 ${state === "collapsed" ? "w-full flex justify-center items-center p-3 mx-auto" : ""} ${
                        item.expanded 
                          ? 'bg-blue-50 text-blue-700 shadow-sm' 
                          : 'hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                      }`}
                    >
                      <span className="text-lg">{item.title.split(' ')[0]}</span>
                      <span className="font-medium ml-2">{item.title.split(' ').slice(1).join(' ')}</span>
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

      {/* E-shop Section */}
      <div className="mt-auto p-3 border-t border-slate-200/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 h-12">
              <NavLink to="/admin/eshop" className="flex items-center gap-3 p-3 rounded-lg">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-medium">E-shop</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      <SidebarFooter className="border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50/30 p-3">
        <AdminProfile />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
