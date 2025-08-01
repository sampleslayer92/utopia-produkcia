import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  TrendingUp, 
  ClipboardList, 
  Settings, 
  User,
  Building2,
  FileText,
  ShoppingCart,
  BarChart3,
  UserCheck,
  Globe
} from 'lucide-react';

// Application sections with user-centric view
const APPLICATION_SECTIONS = {
  dashboard: {
    title: 'Dashboard',
    icon: LayoutDashboard,
    color: 'hsl(var(--primary))',
    sections: {
      admin: {
        title: 'Admin Dashboard',
        description: 'Komplexný prehľad celého systému',
        features: ['Prehľad všetkých procesov', 'Používateľská aktivita', 'Systémové štatistiky', 'Rýchle akcie'],
        pages: ['Admin Overview', 'System Health', 'User Analytics', 'Performance Metrics']
      },
      partner: {
        title: 'Partner Dashboard',
        description: 'Obchodné operácie a inventár',
        features: ['Sales Dashboard', 'Inventory Status', 'Customer Insights', 'Performance Reports'],
        pages: ['Sales Overview', 'Warehouse Status', 'Customer Analytics', 'Revenue Reports']
      },
      merchant: {
        title: 'Merchant Portal',
        description: 'Self-service portál pre merchantov',
        features: ['Contract Status', 'Location Overview', 'Document Center', 'Support Tickets'],
        pages: ['My Contracts', 'Business Locations', 'Documents', 'Help Center']
      }
    }
  },
  business: {
    title: 'Obchodné Procesy',
    icon: Building2,
    color: 'hsl(var(--accent))',
    sections: {
      admin: {
        title: 'Správa Obchodných Procesov',
        description: 'Komplexná správa všetkých obchodných operácií',
        features: ['Deal Management', 'Contract Lifecycle', 'Document Automation', 'Workflow Configuration'],
        pages: ['Deals Overview', 'Contracts List', 'Document Templates', 'Process Designer']
      },
      partner: {
        title: 'Obchodné Operácie',
        description: 'Každodenné obchodné aktivity',
        features: ['Active Deals', 'Contract Processing', 'Customer Onboarding', 'Revenue Tracking'],
        pages: ['My Deals', 'Contract Pipeline', 'New Customers', 'Sales Reports']
      }
    }
  },
  clients: {
    title: 'Správa Klientov',
    icon: Users,
    color: 'hsl(var(--secondary))',
    sections: {
      admin: {
        title: 'Celková Správa Klientov',
        description: 'Centralizovaná správa všetkých klientov',
        features: ['Merchant Database', 'Location Management', 'Relationship Tracking', 'Segmentation'],
        pages: ['All Merchants', 'Business Locations', 'Relationship Map', 'Customer Segments']
      },
      partner: {
        title: 'Klienti Partnera',
        description: 'Správa priradených klientov',
        features: ['Assigned Merchants', 'Location Updates', 'Communication History', 'Support Cases'],
        pages: ['My Merchants', 'Location Updates', 'Messages', 'Support Tickets']
      },
      merchant: {
        title: 'Môj Profil',
        description: 'Správa vlastných údajov',
        features: ['Company Profile', 'Location Details', 'Contact Information', 'Business Documents'],
        pages: ['Company Info', 'Locations', 'Contacts', 'Documents']
      }
    }
  },
  catalog: {
    title: 'Produktový Katalóg',
    icon: Package,
    color: 'hsl(var(--warning))',
    sections: {
      admin: {
        title: 'Správa Katalógu',
        description: 'Centrálna správa produktov a služieb',
        features: ['Product Categories', 'Service Templates', 'Pricing Models', 'Configuration Tools'],
        pages: ['Product Manager', 'Categories', 'Pricing', 'Configuration']
      },
      partner: {
        title: 'Produktový Inventár',
        description: 'Správa dostupných produktov a služieb',
        features: ['Available Products', 'Quick Sales', 'Custom Solutions', 'Visual Builder'],
        pages: ['Warehouse', 'Quick Sales', 'Solution Builder', 'Custom Packages']
      }
    }
  },
  analytics: {
    title: 'Analýzy & Reporting',
    icon: TrendingUp,
    color: 'hsl(var(--success))',
    sections: {
      admin: {
        title: 'Systémové Analýzy',
        description: 'Komplexné reporty a analýzy',
        features: ['System Performance', 'User Analytics', 'Business Intelligence', 'Custom Reports'],
        pages: ['System Reports', 'User Activity', 'BI Dashboard', 'Report Builder']
      },
      partner: {
        title: 'Obchodné Analýzy',
        description: 'Analýzy výkonnosti a predaja',
        features: ['Sales Analytics', 'Customer Insights', 'Performance Metrics', 'Forecasting'],
        pages: ['Sales Dashboard', 'Customer Analytics', 'Performance', 'Forecasts']
      }
    }
  },
  onboarding: {
    title: 'Správa Onboardingu',
    icon: ClipboardList,
    color: 'hsl(var(--info))',
    sections: {
      admin: {
        title: 'Konfigurácia Onboardingu',
        description: 'Nastavenie procesov zapojenia nových klientov',
        features: ['Step Configuration', 'Form Builder', 'Workflow Design', 'Template Management'],
        pages: ['Step Manager', 'Form Builder', 'Workflow Designer', 'Templates']
      }
    }
  },
  system: {
    title: 'Správa Systému',
    icon: Settings,
    color: 'hsl(var(--destructive))',
    sections: {
      admin: {
        title: 'Systémové Nastavenia',
        description: 'Konfigurácia a správa celého systému',
        features: ['User Management', 'System Configuration', 'Translation Management', 'Organization Setup'],
        pages: ['Users & Roles', 'System Config', 'Translations', 'Organizations']
      }
    }
  },
  personal: {
    title: 'Osobné',
    icon: User,
    color: 'hsl(var(--muted))',
    sections: {
      all: {
        title: 'Osobné Nastavenia',
        description: 'Správa osobného profilu a preferencií',
        features: ['Profile Management', 'Notification Settings', 'Language Preferences', 'Security Settings'],
        pages: ['My Profile', 'Notifications', 'Preferences', 'Security']
      }
    }
  }
};

// Role colors for visual distinction
const ROLE_COLORS = {
  admin: { bg: 'hsl(var(--destructive) / 0.1)', border: 'hsl(var(--destructive))', text: 'Admin' },
  partner: { bg: 'hsl(var(--primary) / 0.1)', border: 'hsl(var(--primary))', text: 'Partner' },
  merchant: { bg: 'hsl(var(--success) / 0.1)', border: 'hsl(var(--success))', text: 'Merchant' },
  all: { bg: 'hsl(var(--muted) / 0.1)', border: 'hsl(var(--muted-foreground))', text: 'Všetky roly' }
};

export default function ApplicationView() {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const filterSectionsByRole = (sections: any) => {
    if (selectedRole === 'all') return sections;
    
    const filtered: any = {};
    Object.entries(sections).forEach(([key, section]: [string, any]) => {
      if (key === selectedRole || key === 'all') {
        filtered[key] = section;
      }
    });
    return filtered;
  };

  const getSectionCount = (sections: any) => {
    const filtered = filterSectionsByRole(sections);
    return Object.keys(filtered).length;
  };

  return (
    <div className="space-y-6">
      {/* Role Filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground py-2">Filtrovať podľa role:</span>
        {Object.entries(ROLE_COLORS).map(([role, colors]) => (
          <Button
            key={role}
            variant={selectedRole === role ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRole(role)}
            className="flex items-center gap-2"
            style={selectedRole === role ? { 
              backgroundColor: colors.bg, 
              borderColor: colors.border,
              color: 'hsl(var(--foreground))'
            } : {}}
          >
            {colors.text}
          </Button>
        ))}
      </div>

      {/* Application Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(APPLICATION_SECTIONS).map(([key, section]) => {
          const filteredSections = filterSectionsByRole(section.sections);
          const sectionCount = getSectionCount(section.sections);
          const IconComponent = section.icon;

          if (sectionCount === 0) return null;

          return (
            <Card 
              key={key} 
              className="cursor-pointer transition-all hover:shadow-lg border-2"
              style={{ borderColor: section.color }}
              onClick={() => setSelectedSection(selectedSection === key ? null : key)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${section.color}15`, color: section.color }}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>{section.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {sectionCount} {sectionCount === 1 ? 'modul' : 'moduly'}
                      </Badge>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>

              {selectedSection === key && (
                <CardContent className="pt-0 space-y-4">
                  {Object.entries(filteredSections).map(([roleKey, roleSection]: [string, any]) => (
                    <div key={roleKey} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{roleSection.title}</h4>
                        <Badge 
                          variant="outline"
                          style={{ 
                            backgroundColor: ROLE_COLORS[roleKey as keyof typeof ROLE_COLORS]?.bg,
                            borderColor: ROLE_COLORS[roleKey as keyof typeof ROLE_COLORS]?.border
                          }}
                        >
                          {ROLE_COLORS[roleKey as keyof typeof ROLE_COLORS]?.text || roleKey}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">{roleSection.description}</p>
                      
                      {/* Features */}
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Hlavné funkcie:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {roleSection.features.map((feature: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Pages */}
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Stránky:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {roleSection.pages.map((page: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {page}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Súhrn Aplikácie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">8</div>
              <div className="text-sm text-muted-foreground">Hlavných sekcií</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">15</div>
              <div className="text-sm text-muted-foreground">Modulov celkom</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">45+</div>
              <div className="text-sm text-muted-foreground">Stránok</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-info">3</div>
              <div className="text-sm text-muted-foreground">Používateľských rolí</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legenda Rolí</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: ROLE_COLORS.admin.bg }}>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ROLE_COLORS.admin.border }}></div>
              <div>
                <div className="font-medium">Admin</div>
                <div className="text-sm text-muted-foreground">Plný prístup ku všetkým funkciám</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: ROLE_COLORS.partner.bg }}>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ROLE_COLORS.partner.border }}></div>
              <div>
                <div className="font-medium">Partner</div>
                <div className="text-sm text-muted-foreground">Obchodné operácie a inventár</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: ROLE_COLORS.merchant.bg }}>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ROLE_COLORS.merchant.border }}></div>
              <div>
                <div className="font-medium">Merchant</div>
                <div className="text-sm text-muted-foreground">Self-service portál</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}