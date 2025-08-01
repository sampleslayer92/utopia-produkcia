import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Position,
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Eye, EyeOff, Info } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from 'react-i18next';

import '@xyflow/react/dist/style.css';

// Node categories for filtering
const NODE_CATEGORIES = {
  AUTH: 'auth',
  PAGES: 'pages',
  COMPONENTS: 'components',
  HOOKS: 'hooks',
  CONTEXTS: 'contexts',
  DATABASE: 'database',
  ROUTING: 'routing'
} as const;

// Role-based color scheme
const ROLE_COLORS = {
  admin: { bg: '#ffebee', border: '#c62828', text: 'Admin Only' },
  partner: { bg: '#e3f2fd', border: '#1976d2', text: 'Partner Access' },
  merchant: { bg: '#e8f5e8', border: '#388e3c', text: 'Merchant Access' },
  public: { bg: '#f5f5f5', border: '#616161', text: 'Public Access' },
  system: { bg: '#fff3e0', border: '#f57c00', text: 'System Component' }
};

// Comprehensive nodes data
const initialNodes: Node[] = [
  // Authentication Layer
  {
    id: 'auth-context',
    type: 'default',
    position: { x: 100, y: 50 },
    data: { 
      label: 'AuthContext',
      category: NODE_CATEGORIES.CONTEXTS,
      role: 'system',
      description: 'Manages authentication state, user roles, and auth operations'
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },

  // Main Dashboard Pages
  {
    id: 'admin-dashboard',
    type: 'default',
    position: { x: 300, y: 150 },
    data: { 
      label: 'Admin Dashboard',
      category: NODE_CATEGORIES.PAGES,
      role: 'admin',
      description: 'Main admin interface with overview and navigation'
    },
    style: { backgroundColor: ROLE_COLORS.admin.bg, borderColor: ROLE_COLORS.admin.border }
  },
  {
    id: 'partner-dashboard',
    type: 'default',
    position: { x: 500, y: 150 },
    data: { 
      label: 'Partner Dashboard',
      category: NODE_CATEGORIES.PAGES,
      role: 'partner',
      description: 'Partner-specific dashboard with limited admin functions'
    },
    style: { backgroundColor: ROLE_COLORS.partner.bg, borderColor: ROLE_COLORS.partner.border }
  },
  {
    id: 'merchant-dashboard',
    type: 'default',
    position: { x: 700, y: 150 },
    data: { 
      label: 'Merchant Dashboard',
      category: NODE_CATEGORIES.PAGES,
      role: 'merchant',
      description: 'Merchant interface for contract and business management'
    },
    style: { backgroundColor: ROLE_COLORS.merchant.bg, borderColor: ROLE_COLORS.merchant.border }
  },

  // Business Process Pages
  {
    id: 'contracts-page',
    type: 'default',
    position: { x: 100, y: 300 },
    data: { 
      label: 'Contracts Management',
      category: NODE_CATEGORIES.PAGES,
      role: 'admin',
      description: 'Contract creation, editing, and management'
    },
    style: { backgroundColor: ROLE_COLORS.admin.bg, borderColor: ROLE_COLORS.admin.border }
  },
  {
    id: 'merchants-page',
    type: 'default',
    position: { x: 300, y: 300 },
    data: { 
      label: 'Merchants Management',
      category: NODE_CATEGORIES.PAGES,
      role: 'admin',
      description: 'Merchant profiles, locations, and business data'
    },
    style: { backgroundColor: ROLE_COLORS.admin.bg, borderColor: ROLE_COLORS.admin.border }
  },
  {
    id: 'warehouse-page',
    type: 'default',
    position: { x: 500, y: 300 },
    data: { 
      label: 'Warehouse Management',
      category: NODE_CATEGORIES.PAGES,
      role: 'partner',
      description: 'Product catalog, inventory, and solutions'
    },
    style: { backgroundColor: ROLE_COLORS.partner.bg, borderColor: ROLE_COLORS.partner.border }
  },

  // Onboarding System
  {
    id: 'onboarding-flow',
    type: 'default',
    position: { x: 700, y: 300 },
    data: { 
      label: 'Onboarding Flow',
      category: NODE_CATEGORIES.PAGES,
      role: 'public',
      description: 'Multi-step onboarding process for new merchants'
    },
    style: { backgroundColor: ROLE_COLORS.public.bg, borderColor: ROLE_COLORS.public.border }
  },
  {
    id: 'dynamic-onboarding',
    type: 'default',
    position: { x: 900, y: 300 },
    data: { 
      label: 'Dynamic Onboarding',
      category: NODE_CATEGORIES.PAGES,
      role: 'admin',
      description: 'Configurable onboarding process with custom fields'
    },
    style: { backgroundColor: ROLE_COLORS.admin.bg, borderColor: ROLE_COLORS.admin.border }
  },

  // E-shop System
  {
    id: 'eshop-page',
    type: 'default',
    position: { x: 100, y: 450 },
    data: { 
      label: 'E-shop Interface',
      category: NODE_CATEGORIES.PAGES,
      role: 'public',
      description: 'Product catalog and shopping cart for customers'
    },
    style: { backgroundColor: ROLE_COLORS.public.bg, borderColor: ROLE_COLORS.public.border }
  },
  {
    id: 'cart-context',
    type: 'default',
    position: { x: 300, y: 450 },
    data: { 
      label: 'CartContext',
      category: NODE_CATEGORIES.CONTEXTS,
      role: 'system',
      description: 'Shopping cart state management with persistence'
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },

  // Database Layer
  {
    id: 'supabase-db',
    type: 'default',
    position: { x: 500, y: 600 },
    data: { 
      label: 'Supabase Database',
      category: NODE_CATEGORIES.DATABASE,
      role: 'system',
      description: 'PostgreSQL database with RLS policies'
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'contract-tables',
    type: 'default',
    position: { x: 200, y: 750 },
    data: { 
      label: 'Contract Tables',
      category: NODE_CATEGORIES.DATABASE,
      role: 'system',
      description: 'contracts, contract_items, consents, authorized_persons'
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'merchant-tables',
    type: 'default',
    position: { x: 400, y: 750 },
    data: { 
      label: 'Merchant Tables',
      category: NODE_CATEGORIES.DATABASE,
      role: 'system',
      description: 'merchants, business_locations, organizations'
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'warehouse-tables',
    type: 'default',
    position: { x: 600, y: 750 },
    data: { 
      label: 'Warehouse Tables',
      category: NODE_CATEGORIES.DATABASE,
      role: 'system',
      description: 'warehouse_items, categories, solutions, item_types'
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'system-tables',
    type: 'default',
    position: { x: 800, y: 750 },
    data: { 
      label: 'System Tables',
      category: NODE_CATEGORIES.DATABASE,
      role: 'system',
      description: 'user_roles, profiles, translations, teams'
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },

  // Components Layer
  {
    id: 'admin-layout',
    type: 'default',
    position: { x: 100, y: 600 },
    data: { 
      label: 'AdminLayout',
      category: NODE_CATEGORIES.COMPONENTS,
      role: 'system',
      description: 'Base layout for admin pages with sidebar and header'
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'eshop-layout',
    type: 'default',
    position: { x: 300, y: 600 },
    data: { 
      label: 'EshopLayout',
      category: NODE_CATEGORIES.COMPONENTS,
      role: 'system',
      description: 'E-commerce layout with navigation and cart'
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },

  // Architecture Page (Self-reference)
  {
    id: 'architecture-page',
    type: 'default',
    position: { x: 1100, y: 300 },
    data: { 
      label: 'Architecture Page',
      category: NODE_CATEGORIES.PAGES,
      role: 'admin',
      description: 'This interactive architecture documentation page'
    },
    style: { backgroundColor: '#e1f5fe', borderColor: '#0277bd', border: '3px solid' }
  }
];

// Comprehensive edges data
const initialEdges: Edge[] = [
  // Authentication flows
  { id: 'auth-admin', source: 'auth-context', target: 'admin-dashboard', label: 'Admin Auth', type: 'smoothstep' },
  { id: 'auth-partner', source: 'auth-context', target: 'partner-dashboard', label: 'Partner Auth', type: 'smoothstep' },
  { id: 'auth-merchant', source: 'auth-context', target: 'merchant-dashboard', label: 'Merchant Auth', type: 'smoothstep' },

  // Navigation flows
  { id: 'admin-contracts', source: 'admin-dashboard', target: 'contracts-page', label: 'Navigate', type: 'smoothstep' },
  { id: 'admin-merchants', source: 'admin-dashboard', target: 'merchants-page', label: 'Navigate', type: 'smoothstep' },
  { id: 'admin-warehouse', source: 'admin-dashboard', target: 'warehouse-page', label: 'Navigate', type: 'smoothstep' },
  { id: 'admin-onboarding', source: 'admin-dashboard', target: 'dynamic-onboarding', label: 'Configure', type: 'smoothstep' },
  { id: 'admin-architecture', source: 'admin-dashboard', target: 'architecture-page', label: 'Navigate', type: 'smoothstep' },

  // E-shop flows
  { id: 'eshop-cart', source: 'eshop-page', target: 'cart-context', label: 'Cart Management', type: 'smoothstep' },
  { id: 'cart-layout', source: 'cart-context', target: 'eshop-layout', label: 'State Update', type: 'smoothstep' },

  // Database connections
  { id: 'db-contracts', source: 'supabase-db', target: 'contract-tables', label: 'Schema', type: 'smoothstep' },
  { id: 'db-merchants', source: 'supabase-db', target: 'merchant-tables', label: 'Schema', type: 'smoothstep' },
  { id: 'db-warehouse', source: 'supabase-db', target: 'warehouse-tables', label: 'Schema', type: 'smoothstep' },
  { id: 'db-system', source: 'supabase-db', target: 'system-tables', label: 'Schema', type: 'smoothstep' },

  // Layout connections
  { id: 'layout-admin', source: 'admin-layout', target: 'admin-dashboard', label: 'Wraps', type: 'smoothstep' },
  { id: 'layout-eshop', source: 'eshop-layout', target: 'eshop-page', label: 'Wraps', type: 'smoothstep' },

  // Data flows
  { id: 'contracts-db', source: 'contracts-page', target: 'contract-tables', label: 'CRUD Operations', type: 'smoothstep' },
  { id: 'merchants-db', source: 'merchants-page', target: 'merchant-tables', label: 'CRUD Operations', type: 'smoothstep' },
  { id: 'warehouse-db', source: 'warehouse-page', target: 'warehouse-tables', label: 'CRUD Operations', type: 'smoothstep' }
];

const AppArchitecturePage = () => {
  const { t } = useTranslation('admin');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Filter nodes based on search and filters
  const filteredNodes = nodes.filter(node => {
    const data = node.data as any;
    const matchesSearch = data.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         data.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || data.category === selectedCategory;
    const matchesRole = selectedRole === 'all' || data.role === selectedRole;
    const isVisible = !hiddenCategories.has(data.category);
    
    return matchesSearch && matchesCategory && matchesRole && isVisible;
  });

  const toggleCategoryVisibility = (category: string) => {
    setHiddenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  return (
    <AdminLayout
      title="🏗️ Architektúra Aplikácie"
      subtitle="Komplexná vizualizácia štruktúry aplikácie a dátových tokov"
    >
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Vyhľadať komponenty, stránky..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">Všetky kategórie</option>
            <option value={NODE_CATEGORIES.PAGES}>Stránky</option>
            <option value={NODE_CATEGORIES.COMPONENTS}>Komponenty</option>
            <option value={NODE_CATEGORIES.CONTEXTS}>Contexty</option>
            <option value={NODE_CATEGORIES.DATABASE}>Databáza</option>
          </select>

          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">Všetky roli</option>
            <option value="admin">Admin</option>
            <option value="partner">Partner</option>
            <option value="merchant">Merchant</option>
            <option value="public">Public</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Layer Toggle Controls */}
        <div className="flex flex-wrap gap-2">
          {Object.values(NODE_CATEGORIES).map(category => (
            <Button
              key={category}
              variant={hiddenCategories.has(category) ? "outline" : "default"}
              size="sm"
              onClick={() => toggleCategoryVisibility(category)}
              className="flex items-center gap-2"
            >
              {hiddenCategories.has(category) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full h-[800px] bg-background rounded-lg border">
        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-background"
        >
          <MiniMap 
            nodeColor={(node) => node.style?.borderColor || '#666'}
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      
      {/* Statistics and Legend */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Štatistiky Architektúry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">Celkom komponentov:</div>
                <div className="text-2xl font-bold text-primary">{nodes.length}</div>
              </div>
              <div>
                <div className="font-medium">Aktívne zobrazené:</div>
                <div className="text-2xl font-bold text-green-600">{filteredNodes.length}</div>
              </div>
              <div>
                <div className="font-medium">Prepojenia:</div>
                <div className="text-2xl font-bold text-blue-600">{edges.length}</div>
              </div>
              <div>
                <div className="font-medium">Skryté vrstvy:</div>
                <div className="text-2xl font-bold text-orange-600">{hiddenCategories.size}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Legenda Rolí</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(ROLE_COLORS).map(([role, colors]) => (
                <div key={role} className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded border-2" 
                    style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                  />
                  <div className="flex-1">
                    <div className="font-medium capitalize">{role}</div>
                    <div className="text-sm text-muted-foreground">{colors.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ako používať diagram</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>🔍 Vyhľadávanie:</strong> Použite vyhľadávacie pole na nájdenie konkrétnych komponentov</p>
          <p><strong>🎯 Filtrovanie:</strong> Filtrujte podľa kategórie alebo role pre zameranie na špecifické časti</p>
          <p><strong>👁️ Vrstvy:</strong> Skryte/zobrazte kategórie pomocou tlačidiel pre lepší prehľad</p>
          <p><strong>🔗 Prepojenia:</strong> Modré čiary reprezentujú dátové toky a závislosti medzi komponentmi</p>
          <p><strong>📊 Interakcia:</strong> Diagram je interaktívny - môžete zoomovať, posúvať a reorganizovať</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AppArchitecturePage;