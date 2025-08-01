import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";

interface ArchitectureSidebarProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
  pluginCounts: Record<string, number>;
}

const ArchitectureSidebar = ({ selectedSection, onSectionChange, pluginCounts }: ArchitectureSidebarProps) => {
  const { t } = useTranslation('admin');
  const location = useLocation();
  
  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

  // Accordion behavior - only one section expanded at a time
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? [] // Close if already open
        : [sectionId] // Open only this section, close others
    );
  };

  // Auto-expand current section
  useEffect(() => {
    if (selectedSection) {
      setExpandedSections([selectedSection]);
    }
  }, [selectedSection]);

  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId);
  const isActive = (sectionId: string) => selectedSection === sectionId;

  const menuItems = [
    // 1. PREHĽAD ARCHITEKTÚRY
    {
      id: 'overview',
      title: '🏠 Prehľad Architektúry',
      type: 'single' as const,
      description: 'Celkový pohľad na systém',
      count: Object.values(pluginCounts).reduce((sum, count) => sum + count, 0)
    },

    // 2. OBCHODNÉ PROCESY
    {
      id: 'business',
      title: '💼 Obchodné Procesy',
      type: 'expandable' as const,
      expanded: isExpanded('business'),
      count: pluginCounts.business || 0,
      children: [
        { title: 'Contract Management', key: 'contracts' },
        { title: 'Deal Processing', key: 'deals' },
        { title: 'Request Handling', key: 'requests' },
        { title: 'Business Logic', key: 'business-logic' },
        { title: 'Workflow Engine', key: 'workflows' }
      ]
    },

    // 3. SPRÁVA KLIENTOV
    {
      id: 'clients',
      title: '👥 Správa Klientov',
      type: 'expandable' as const,
      expanded: isExpanded('clients'),
      count: pluginCounts.clients || 0,
      children: [
        { title: 'Merchant Management', key: 'merchants' },
        { title: 'Customer Onboarding', key: 'customer-onboarding' },
        { title: 'Client Interfaces', key: 'client-interfaces' },
        { title: 'Location Management', key: 'locations' },
        { title: 'Authentication System', key: 'auth' }
      ]
    },

    // 4. PRODUKTOVÝ KATALÓG
    {
      id: 'products',
      title: '📦 Produktový Katalóg',
      type: 'expandable' as const,
      expanded: isExpanded('products'),
      count: pluginCounts.products || 0,
      children: [
        { title: 'Warehouse Management', key: 'warehouse' },
        { title: 'Item Management', key: 'items' },
        { title: 'Category System', key: 'categories' },
        { title: 'Visual Builder', key: 'visual-builder' },
        { title: 'Inventory System', key: 'inventory' }
      ]
    },

    // 5. ANALÝZY & REPORTING
    {
      id: 'analytics',
      title: '📊 Analýzy & Reporting',
      type: 'expandable' as const,
      expanded: isExpanded('analytics'),
      count: pluginCounts.analytics || 0,
      children: [
        { title: 'Analytics Components', key: 'analytics-components' },
        { title: 'Reporting Modules', key: 'reporting' },
        { title: 'Dashboard System', key: 'dashboards' },
        { title: 'Data Visualization', key: 'charts' },
        { title: 'Business Intelligence', key: 'bi' }
      ]
    },

    // 6. SPRÁVA ONBOARDINGU
    {
      id: 'onboarding',
      title: '📋 Správa Onboardingu',
      type: 'expandable' as const,
      expanded: isExpanded('onboarding'),
      count: pluginCounts.onboarding || 0,
      children: [
        { title: 'Dynamic Flow Engine', key: 'dynamic-onboarding' },
        { title: 'Step Configuration', key: 'step-config' },
        { title: 'Form Templates', key: 'templates' },
        { title: 'Validation System', key: 'validation' },
        { title: 'Progress Tracking', key: 'progress' }
      ]
    },

    // 7. SPRÁVA SYSTÉMU
    {
      id: 'system',
      title: '⚙️ Správa Systému',
      type: 'expandable' as const,
      expanded: isExpanded('system'),
      count: pluginCounts.system || 0,
      children: [
        { title: 'System Settings', key: 'settings' },
        { title: 'Translation System', key: 'i18n' },
        { title: 'Template Engine', key: 'template-engine' },
        { title: 'Organization Management', key: 'organizations' },
        { title: 'Security & Permissions', key: 'security' }
      ]
    },

    // 8. OSOBNÉ
    {
      id: 'personal',
      title: '👤 Osobné',
      type: 'expandable' as const,
      expanded: isExpanded('personal'),
      count: pluginCounts.personal || 0,
      children: [
        { title: 'User Management', key: 'users' },
        { title: 'Notification System', key: 'notifications' },
        { title: 'Profile Settings', key: 'profiles' },
        { title: 'Personal Dashboard', key: 'personal-dashboard' },
        { title: 'User Preferences', key: 'preferences' }
      ]
    }
  ];

  const { state } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r-0 shadow-lg">
      <SidebarHeader className="border-b border-slate-200/50">
        <div className="flex items-center justify-center px-4 h-16">
          <div className={`flex items-center gap-2 ${state === "collapsed" ? "justify-center" : ""}`}>
            <span className="text-2xl">🏗️</span>
            {state === "expanded" && (
              <span className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Architektúra
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-white to-slate-50/50 backdrop-blur-sm">
        <SidebarGroup className="px-3 py-4">
          <SidebarMenu className={state === "collapsed" ? "space-y-4" : "space-y-3 px-1"}>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                {item.type === 'single' ? (
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    isActive={isActive(item.id)}
                    tooltip={state === "collapsed" ? item.title : undefined}
                    className={`rounded-xl transition-all duration-200 ${state === "collapsed" ? "w-full flex justify-center items-center p-3 mx-auto" : ""} ${
                      isActive(item.id)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 !text-white shadow-lg hover:shadow-xl' 
                        : 'hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                    }`}
                  >
                    <span className="text-lg">{item.title.split(' ')[0]}</span>
                    {state === "expanded" && (
                      <>
                        <span className="font-medium ml-2">{item.title.split(' ').slice(1).join(' ')}</span>
                        <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                          {item.count}
                        </span>
                      </>
                    )}
                  </SidebarMenuButton>
                ) : (
                  <>
                    <SidebarMenuButton
                      onClick={() => {
                        if (state === "collapsed") {
                          onSectionChange(item.id);
                        } else {
                          toggleSection(item.id);
                        }
                      }}
                      tooltip={state === "collapsed" ? `${item.title} - ${item.count} pluginov` : undefined}
                      className={`rounded-xl transition-all duration-200 ${state === "collapsed" ? "w-full flex justify-center items-center p-3 mx-auto" : ""} ${
                        item.expanded || isActive(item.id)
                          ? 'bg-blue-50 text-blue-700 shadow-sm' 
                          : 'hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                      }`}
                    >
                      <span className="text-lg">{item.title.split(' ')[0]}</span>
                      {state === "expanded" && (
                        <>
                          <span className="font-medium ml-2">{item.title.split(' ').slice(1).join(' ')}</span>
                          <span className="ml-auto flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                              {item.count}
                            </span>
                            {item.expanded ? (
                              <ChevronDown className="h-4 w-4 text-blue-500 transition-transform duration-200" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-blue-500 transition-transform duration-200" />
                            )}
                          </span>
                        </>
                      )}
                    </SidebarMenuButton>
                    
                    {item.expanded && state === "expanded" && (
                      <SidebarMenuSub className="ml-4 mt-2 space-y-1 border-l-2 border-blue-100 pl-4">
                        {item.children?.map((child, index) => (
                          <SidebarMenuSubItem key={index}>
                            <SidebarMenuSubButton
                              onClick={() => onSectionChange(item.id)}
                              className="rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <span className="text-sm font-medium">{child.title}</span>
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
    </Sidebar>
  );
};

export default ArchitectureSidebar;