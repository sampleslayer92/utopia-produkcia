
import { useState } from 'react';
import { 
  Palette, 
  Type, 
  Layers, 
  Component, 
  Settings,
  FileText,
  Database,
  Brush,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DesignSystemSidebarProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
  searchTerm: string;
}

const navigationItems = [
  {
    id: 'foundations',
    title: 'Foundations',
    icon: Palette,
    children: [
      { id: 'colors', title: 'Colors', count: 12 },
      { id: 'typography', title: 'Typography', count: 8 },
      { id: 'spacing', title: 'Spacing', count: 6 },
      { id: 'shadows', title: 'Shadows', count: 5 },
      { id: 'animations', title: 'Animations', count: 15 }
    ]
  },
  {
    id: 'components',
    title: 'UI Components',
    icon: Component,
    children: [
      { id: 'buttons', title: 'Buttons', count: 8 },
      { id: 'inputs', title: 'Form Controls', count: 12 },
      { id: 'cards', title: 'Cards', count: 6 },
      { id: 'modals', title: 'Modals & Dialogs', count: 4 },
      { id: 'navigation', title: 'Navigation', count: 5 },
      { id: 'feedback', title: 'Feedback', count: 7 }
    ]
  },
  {
    id: 'onboarding',
    title: 'Onboarding Components',
    icon: Layers,
    children: [
      { id: 'onboarding-inputs', title: 'Custom Inputs', count: 4 },
      { id: 'step-components', title: 'Step Components', count: 8 },
      { id: 'product-cards', title: 'Product Cards', count: 6 },
      { id: 'info-panels', title: 'Info Panels', count: 5 }
    ]
  },
  {
    id: 'admin',
    title: 'Admin Interface',
    icon: Settings,
    children: [
      { id: 'admin-layout', title: 'Layout Components', count: 3 },
      { id: 'admin-tables', title: 'Data Tables', count: 4 },
      { id: 'admin-forms', title: 'Admin Forms', count: 6 },
      { id: 'admin-actions', title: 'Bulk Actions', count: 3 }
    ]
  },
  {
    id: 'guidelines',
    title: 'Developer Guidelines',
    icon: FileText,
    children: [
      { id: 'file-structure', title: 'File Organization' },
      { id: 'naming-conventions', title: 'Naming Conventions' },
      { id: 'best-practices', title: 'Best Practices' },
      { id: 'accessibility', title: 'Accessibility' }
    ]
  },
  {
    id: 'project-docs',
    title: 'Project Documentation',
    icon: Database,
    children: [
      { id: 'onboarding-flow', title: 'Onboarding Flow' },
      { id: 'database-schema', title: 'Database Schema' },
      { id: 'api-endpoints', title: 'API Endpoints' },
      { id: 'i18n-setup', title: 'Internationalization' }
    ]
  },
  {
    id: 'assets',
    title: 'Design Assets',
    icon: Brush,
    children: [
      { id: 'icons', title: 'Icon Library', count: 50 },
      { id: 'logos', title: 'Logo Variants', count: 4 },
      { id: 'colors-export', title: 'Color Swatches' },
      { id: 'utilities', title: 'Utility Classes' }
    ]
  }
];

const DesignSystemSidebar = ({ selectedSection, onSectionChange, searchTerm }: DesignSystemSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['foundations', 'components']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filteredItems = navigationItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.children.some(child => 
      child.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Design System & Manual
          </h2>
          <p className="text-sm text-slate-600">
            Kompletný návod pre dizajn a vývoj
          </p>
        </div>

        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const isExpanded = expandedSections.includes(item.id);
            const Icon = item.icon;
            
            return (
              <div key={item.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-10 px-3 ${
                    selectedSection === item.id ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                  onClick={() => {
                    toggleSection(item.id);
                    onSectionChange(item.id);
                  }}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>

                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Button
                        key={child.id}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start h-8 px-3 text-sm ${
                          selectedSection === child.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                        }`}
                        onClick={() => onSectionChange(child.id)}
                      >
                        <span className="flex-1 text-left">{child.title}</span>
                        {child.count && (
                          <Badge variant="secondary" className="text-xs">
                            {child.count}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DesignSystemSidebar;
