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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Eye, EyeOff, Info, Plus, Settings, Code, Database, Layers, Monitor, Users as UsersIcon } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from 'react-i18next';
import ApplicationView from '@/components/architecture/ApplicationView';

import '@xyflow/react/dist/style.css';

// Node categories for filtering
const NODE_CATEGORIES = {
  AUTH: 'auth',
  PAGES: 'pages',
  COMPONENTS: 'components',
  HOOKS: 'hooks',
  CONTEXTS: 'contexts',
  DATABASE: 'database',
  ROUTING: 'routing',
  ONBOARDING: 'onboarding',
  BUSINESS: 'business',
  PLUGINS: 'plugins'
} as const;

// Role-based color scheme
const ROLE_COLORS = {
  admin: { bg: '#ffebee', border: '#c62828', text: 'Admin Only' },
  partner: { bg: '#e3f2fd', border: '#1976d2', text: 'Partner Access' },
  merchant: { bg: '#e8f5e8', border: '#388e3c', text: 'Merchant Access' },
  public: { bg: '#f5f5f5', border: '#616161', text: 'Public Access' },
  system: { bg: '#fff3e0', border: '#f57c00', text: 'System Component' }
};

// Comprehensive nodes data with expanded architecture
const initialNodes: Node[] = [
  // ========== AUTHENTICATION LAYER ==========
  {
    id: 'auth-context',
    type: 'default',
    position: { x: 50, y: 100 },
    data: { 
      label: 'AuthContext',
      category: NODE_CATEGORIES.CONTEXTS,
      role: 'system',
      description: 'Central authentication state management',
      features: ['JWT handling', 'Role management', 'Session persistence']
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },

  // ========== MAIN DASHBOARDS ==========
  {
    id: 'admin-dashboard',
    type: 'default',
    position: { x: 300, y: 100 },
    data: { 
      label: 'Admin Dashboard',
      category: NODE_CATEGORIES.PAGES,
      role: 'admin',
      description: 'Central admin control panel',
      features: ['System overview', 'User management', 'Analytics']
    },
    style: { backgroundColor: ROLE_COLORS.admin.bg, borderColor: ROLE_COLORS.admin.border }
  },
  {
    id: 'partner-dashboard',
    type: 'default',
    position: { x: 550, y: 100 },
    data: { 
      label: 'Partner Dashboard',
      category: NODE_CATEGORIES.PAGES,
      role: 'partner',
      description: 'Partner-specific operations center',
      features: ['Inventory management', 'Sales analytics', 'Customer support']
    },
    style: { backgroundColor: ROLE_COLORS.partner.bg, borderColor: ROLE_COLORS.partner.border }
  },
  {
    id: 'merchant-dashboard',
    type: 'default',
    position: { x: 800, y: 100 },
    data: { 
      label: 'Merchant Dashboard',
      category: NODE_CATEGORIES.PAGES,
      role: 'merchant',
      description: 'Merchant self-service portal',
      features: ['Contract status', 'Location management', 'Reports']
    },
    style: { backgroundColor: ROLE_COLORS.merchant.bg, borderColor: ROLE_COLORS.merchant.border }
  },

  // ========== ONBOARDING PLUGIN ==========
  {
    id: 'onboarding-plugin',
    type: 'default',
    position: { x: 50, y: 250 },
    data: { 
      label: '🔌 Onboarding Plugin',
      category: NODE_CATEGORIES.PLUGINS,
      role: 'system',
      description: 'Complete onboarding management system',
      features: ['Dynamic forms', 'Step configuration', 'Progress tracking']
    },
    style: { backgroundColor: '#f3e5f5', borderColor: '#9c27b0', border: '2px solid' }
  },
  {
    id: 'onboarding-config',
    type: 'default',
    position: { x: 50, y: 350 },
    data: { 
      label: 'Onboarding Config',
      category: NODE_CATEGORIES.ONBOARDING,
      role: 'admin',
      description: 'Configure onboarding steps and fields',
      features: ['Step management', 'Field customization', 'Validation rules']
    },
    style: { backgroundColor: ROLE_COLORS.admin.bg, borderColor: ROLE_COLORS.admin.border }
  },
  {
    id: 'dynamic-step-renderer',
    type: 'default',
    position: { x: 250, y: 350 },
    data: { 
      label: 'Dynamic Step Renderer',
      category: NODE_CATEGORIES.ONBOARDING,
      role: 'system',
      description: 'Renders configurable onboarding steps',
      features: ['Component registry', 'Dynamic loading', 'State management']
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'onboarding-wrappers',
    type: 'default',
    position: { x: 450, y: 350 },
    data: { 
      label: 'Step Wrappers',
      category: NODE_CATEGORIES.ONBOARDING,
      role: 'system',
      description: 'ContactInfo, CompanyInfo, Fees, Consents wrappers',
      features: ['Form validation', 'Auto-save', 'Progress tracking']
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },

  // ========== BUSINESS PROCESSES PLUGIN ==========
  {
    id: 'business-plugin',
    type: 'default',
    position: { x: 300, y: 250 },
    data: { 
      label: '🔌 Business Plugin',
      category: NODE_CATEGORIES.PLUGINS,
      role: 'system',
      description: 'Core business operations management',
      features: ['Contract lifecycle', 'Document generation', 'Workflow automation']
    },
    style: { backgroundColor: '#e8f5e8', borderColor: '#4caf50', border: '2px solid' }
  },
  {
    id: 'contracts-management',
    type: 'default',
    position: { x: 650, y: 350 },
    data: { 
      label: 'Contracts Management',
      category: NODE_CATEGORIES.BUSINESS,
      role: 'admin',
      description: 'Full contract lifecycle management',
      features: ['Contract creation', 'Template system', 'Digital signatures', 'Status tracking']
    },
    style: { backgroundColor: ROLE_COLORS.admin.bg, borderColor: ROLE_COLORS.admin.border }
  },
  {
    id: 'merchant-management',
    type: 'default',
    position: { x: 850, y: 350 },
    data: { 
      label: 'Merchant Management',
      category: NODE_CATEGORIES.BUSINESS,
      role: 'admin',
      description: 'Comprehensive merchant administration',
      features: ['Profile management', 'Location tracking', 'Business verification']
    },
    style: { backgroundColor: ROLE_COLORS.admin.bg, borderColor: ROLE_COLORS.admin.border }
  },

  // ========== WAREHOUSE PLUGIN ==========
  {
    id: 'warehouse-plugin',
    type: 'default',
    position: { x: 550, y: 250 },
    data: { 
      label: '🔌 Warehouse Plugin',
      category: NODE_CATEGORIES.PLUGINS,
      role: 'system',
      description: 'Inventory and product management system',
      features: ['Stock management', 'Product catalog', 'Quick sales']
    },
    style: { backgroundColor: '#e3f2fd', borderColor: '#2196f3', border: '2px solid' }
  },
  {
    id: 'warehouse-management',
    type: 'default',
    position: { x: 1050, y: 350 },
    data: { 
      label: 'Warehouse Management',
      category: NODE_CATEGORIES.BUSINESS,
      role: 'partner',
      description: 'Complete inventory control system',
      features: ['Item management', 'Categories', 'Solutions', 'Stock tracking']
    },
    style: { backgroundColor: ROLE_COLORS.partner.bg, borderColor: ROLE_COLORS.partner.border }
  },
  {
    id: 'quick-sales',
    type: 'default',
    position: { x: 1250, y: 350 },
    data: { 
      label: 'Quick Sales',
      category: NODE_CATEGORIES.BUSINESS,
      role: 'partner',
      description: 'Fast sales processing system',
      features: ['POS interface', 'Invoice generation', 'Payment tracking']
    },
    style: { backgroundColor: ROLE_COLORS.partner.bg, borderColor: ROLE_COLORS.partner.border }
  },

  // ========== CUSTOMER MANAGEMENT PLUGIN ==========
  {
    id: 'customer-plugin',
    type: 'default',
    position: { x: 800, y: 250 },
    data: { 
      label: '🔌 Customer Plugin',
      category: NODE_CATEGORIES.PLUGINS,
      role: 'system',
      description: 'Customer relationship management',
      features: ['Profile management', 'Communication tracking', 'Support tickets']
    },
    style: { backgroundColor: '#fff3e0', borderColor: '#ff9800', border: '2px solid' }
  },

  // ========== HOOKS LAYER ==========
  {
    id: 'contract-hooks',
    type: 'default',
    position: { x: 50, y: 500 },
    data: { 
      label: 'Contract Hooks',
      category: NODE_CATEGORIES.HOOKS,
      role: 'system',
      description: 'Contract-related business logic',
      features: ['useContracts', 'useContractForm', 'useContractValidation']
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'merchant-hooks',
    type: 'default',
    position: { x: 300, y: 500 },
    data: { 
      label: 'Merchant Hooks',
      category: NODE_CATEGORIES.HOOKS,
      role: 'system',
      description: 'Merchant management logic',
      features: ['useMerchants', 'useBusinessLocations', 'useMerchantStats']
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'warehouse-hooks',
    type: 'default',
    position: { x: 550, y: 500 },
    data: { 
      label: 'Warehouse Hooks',
      category: NODE_CATEGORIES.HOOKS,
      role: 'system',
      description: 'Inventory management logic',
      features: ['useWarehouseItems', 'useCategories', 'useQuickSales']
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'onboarding-hooks',
    type: 'default',
    position: { x: 800, y: 500 },
    data: { 
      label: 'Onboarding Hooks',
      category: NODE_CATEGORIES.HOOKS,
      role: 'system',
      description: 'Onboarding flow management',
      features: ['useOnboardingConfig', 'useStepValidation', 'useAutoSave']
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },

  // ========== DATABASE LAYER ==========
  {
    id: 'supabase-core',
    type: 'default',
    position: { x: 400, y: 650 },
    data: { 
      label: 'Supabase Core',
      category: NODE_CATEGORIES.DATABASE,
      role: 'system',
      description: 'Central database management',
      features: ['PostgreSQL', 'RLS policies', 'Real-time subscriptions']
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'contract-schema',
    type: 'default',
    position: { x: 50, y: 750 },
    data: { 
      label: 'Contract Schema',
      category: NODE_CATEGORIES.DATABASE,
      role: 'system',
      description: 'Contract-related database tables',
      features: ['contracts', 'contract_items', 'consents', 'authorized_persons', 'actual_owners']
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'merchant-schema',
    type: 'default',
    position: { x: 300, y: 750 },
    data: { 
      label: 'Merchant Schema',
      category: NODE_CATEGORIES.DATABASE,
      role: 'system',
      description: 'Merchant and business data',
      features: ['merchants', 'business_locations', 'organizations', 'teams']
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'warehouse-schema',
    type: 'default',
    position: { x: 550, y: 750 },
    data: { 
      label: 'Warehouse Schema',
      category: NODE_CATEGORIES.DATABASE,
      role: 'system',
      description: 'Product and inventory data',
      features: ['warehouse_items', 'categories', 'solutions', 'quick_sales']
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },
  {
    id: 'onboarding-schema',
    type: 'default',
    position: { x: 800, y: 750 },
    data: { 
      label: 'Onboarding Schema',
      category: NODE_CATEGORIES.DATABASE,
      role: 'system',
      description: 'Onboarding configuration data',
      features: ['onboarding_configurations', 'onboarding_steps', 'onboarding_fields']
    },
    style: { backgroundColor: ROLE_COLORS.system.bg, borderColor: ROLE_COLORS.system.border }
  },

  // ========== ARCHITECTURE PAGE ==========
  {
    id: 'architecture-page',
    type: 'default',
    position: { x: 1100, y: 100 },
    data: { 
      label: '🏗️ Architecture Hub',
      category: NODE_CATEGORIES.PAGES,
      role: 'admin',
      description: 'Interactive architecture documentation and management',
      features: ['Visual mapping', 'Plugin management', 'Node editing', 'Dependency tracking']
    },
    style: { backgroundColor: '#e1f5fe', borderColor: '#0277bd', border: '3px solid' }
  }
];

// Comprehensive edges data with plugin architecture
const initialEdges: Edge[] = [
  // ========== AUTHENTICATION FLOWS ==========
  { id: 'auth-admin', source: 'auth-context', target: 'admin-dashboard', label: 'Admin Auth', type: 'smoothstep' },
  { id: 'auth-partner', source: 'auth-context', target: 'partner-dashboard', label: 'Partner Auth', type: 'smoothstep' },
  { id: 'auth-merchant', source: 'auth-context', target: 'merchant-dashboard', label: 'Merchant Auth', type: 'smoothstep' },

  // ========== PLUGIN TO DASHBOARD CONNECTIONS ==========
  { id: 'admin-onboarding-plugin', source: 'admin-dashboard', target: 'onboarding-plugin', label: 'Manage', type: 'smoothstep' },
  { id: 'admin-business-plugin', source: 'admin-dashboard', target: 'business-plugin', label: 'Configure', type: 'smoothstep' },
  { id: 'partner-warehouse-plugin', source: 'partner-dashboard', target: 'warehouse-plugin', label: 'Operate', type: 'smoothstep' },
  { id: 'admin-customer-plugin', source: 'admin-dashboard', target: 'customer-plugin', label: 'Oversee', type: 'smoothstep' },

  // ========== ONBOARDING PLUGIN FLOWS ==========
  { id: 'onboarding-config-flow', source: 'onboarding-plugin', target: 'onboarding-config', label: 'Configure', type: 'smoothstep' },
  { id: 'config-renderer', source: 'onboarding-config', target: 'dynamic-step-renderer', label: 'Define Steps', type: 'smoothstep' },
  { id: 'renderer-wrappers', source: 'dynamic-step-renderer', target: 'onboarding-wrappers', label: 'Load Components', type: 'smoothstep' },
  { id: 'onboarding-hooks-flow', source: 'onboarding-plugin', target: 'onboarding-hooks', label: 'Business Logic', type: 'smoothstep' },

  // ========== BUSINESS PLUGIN FLOWS ==========
  { id: 'business-contracts', source: 'business-plugin', target: 'contracts-management', label: 'Contracts', type: 'smoothstep' },
  { id: 'business-merchants', source: 'business-plugin', target: 'merchant-management', label: 'Merchants', type: 'smoothstep' },
  { id: 'contract-hooks-flow', source: 'business-plugin', target: 'contract-hooks', label: 'Contract Logic', type: 'smoothstep' },
  { id: 'merchant-hooks-flow', source: 'business-plugin', target: 'merchant-hooks', label: 'Merchant Logic', type: 'smoothstep' },

  // ========== WAREHOUSE PLUGIN FLOWS ==========
  { id: 'warehouse-management-flow', source: 'warehouse-plugin', target: 'warehouse-management', label: 'Inventory', type: 'smoothstep' },
  { id: 'warehouse-quick-sales', source: 'warehouse-plugin', target: 'quick-sales', label: 'POS System', type: 'smoothstep' },
  { id: 'warehouse-hooks-flow', source: 'warehouse-plugin', target: 'warehouse-hooks', label: 'Warehouse Logic', type: 'smoothstep' },

  // ========== DATABASE CONNECTIONS ==========
  { id: 'supabase-contract-schema', source: 'supabase-core', target: 'contract-schema', label: 'Tables', type: 'smoothstep' },
  { id: 'supabase-merchant-schema', source: 'supabase-core', target: 'merchant-schema', label: 'Tables', type: 'smoothstep' },
  { id: 'supabase-warehouse-schema', source: 'supabase-core', target: 'warehouse-schema', label: 'Tables', type: 'smoothstep' },
  { id: 'supabase-onboarding-schema', source: 'supabase-core', target: 'onboarding-schema', label: 'Tables', type: 'smoothstep' },

  // ========== HOOKS TO DATABASE FLOWS ==========
  { id: 'contract-hooks-db', source: 'contract-hooks', target: 'contract-schema', label: 'Data Access', type: 'smoothstep' },
  { id: 'merchant-hooks-db', source: 'merchant-hooks', target: 'merchant-schema', label: 'Data Access', type: 'smoothstep' },
  { id: 'warehouse-hooks-db', source: 'warehouse-hooks', target: 'warehouse-schema', label: 'Data Access', type: 'smoothstep' },
  { id: 'onboarding-hooks-db', source: 'onboarding-hooks', target: 'onboarding-schema', label: 'Data Access', type: 'smoothstep' },

  // ========== ARCHITECTURE HUB CONNECTIONS ==========
  { id: 'admin-architecture', source: 'admin-dashboard', target: 'architecture-page', label: 'Navigate', type: 'smoothstep' },
  { id: 'architecture-onboarding', source: 'architecture-page', target: 'onboarding-plugin', label: 'Monitor', type: 'smoothstep' },
  { id: 'architecture-business', source: 'architecture-page', target: 'business-plugin', label: 'Monitor', type: 'smoothstep' },
  { id: 'architecture-warehouse', source: 'architecture-page', target: 'warehouse-plugin', label: 'Monitor', type: 'smoothstep' },
  { id: 'architecture-customer', source: 'architecture-page', target: 'customer-plugin', label: 'Monitor', type: 'smoothstep' }
];

const AppArchitecturePage = () => {
  const { t } = useTranslation('admin');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNodeData, setNewNodeData] = useState({
    label: '',
    category: 'components' as string,
    role: 'system',
    description: '',
    features: ''
  });

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

  // Node click handler for details
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Add new node functionality
  const addNewNode = () => {
    const id = `custom-${Date.now()}`;
    const roleColors = ROLE_COLORS[newNodeData.role as keyof typeof ROLE_COLORS] || ROLE_COLORS.system;
    
    const newNode: Node = {
      id,
      type: 'default',
      position: { x: Math.random() * 500 + 100, y: Math.random() * 300 + 200 },
      data: {
        label: newNodeData.label,
        category: newNodeData.category,
        role: newNodeData.role,
        description: newNodeData.description,
        features: newNodeData.features.split(',').map(f => f.trim()).filter(Boolean)
      },
      style: { 
        backgroundColor: roleColors.bg, 
        borderColor: roleColors.border,
        border: newNodeData.category === NODE_CATEGORIES.PLUGINS ? '2px solid' : '1px solid'
      }
    };

    setNodes(prev => [...prev, newNode]);
    setIsAddingNode(false);
    setNewNodeData({
      label: '',
      category: NODE_CATEGORIES.COMPONENTS,
      role: 'system',
      description: '',
      features: ''
    });
  };

  // Plugin statistics
  const pluginNodes = nodes.filter(node => node.data.category === NODE_CATEGORIES.PLUGINS);
  const pluginStats = {
    onboarding: nodes.filter(node => node.data.category === NODE_CATEGORIES.ONBOARDING).length,
    business: nodes.filter(node => node.data.category === NODE_CATEGORIES.BUSINESS).length,
    hooks: nodes.filter(node => node.data.category === NODE_CATEGORIES.HOOKS).length,
    database: nodes.filter(node => node.data.category === NODE_CATEGORIES.DATABASE).length
  };

  return (
    <AdminLayout
      title="🏗️ Architektúra Aplikácie"
      subtitle="Komplexná vizualizácia štruktúry aplikácie a dátových tokov"
    >
      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Technická Architektúra
          </TabsTrigger>
          <TabsTrigger value="application" className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            Aplikácia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="technical" className="space-y-6">
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

          {/* Add Node Button */}
          <Dialog open={isAddingNode} onOpenChange={setIsAddingNode}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Pridať komponent
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Pridať nový komponent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Názov komponenta"
                  value={newNodeData.label}
                  onChange={(e) => setNewNodeData(prev => ({ ...prev, label: e.target.value }))}
                />
                <Select value={newNodeData.category} onValueChange={(value) => setNewNodeData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategória" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(NODE_CATEGORIES).map(([key, value]) => (
                      <SelectItem key={key} value={value}>{key}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={newNodeData.role} onValueChange={(value) => setNewNodeData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rola" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(ROLE_COLORS).map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Popis komponenta"
                  value={newNodeData.description}
                  onChange={(e) => setNewNodeData(prev => ({ ...prev, description: e.target.value }))}
                />
                <Input
                  placeholder="Funkcie (oddelené čiarkami)"
                  value={newNodeData.features}
                  onChange={(e) => setNewNodeData(prev => ({ ...prev, features: e.target.value }))}
                />
                <Button onClick={addNewNode} className="w-full">
                  Pridať komponent
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
          onNodeClick={onNodeClick}
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

      {/* Node Details Dialog */}
      {selectedNode && (
        <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                {(selectedNode.data as any).label}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Kategória</label>
                  <Badge variant="secondary">{(selectedNode.data as any).category}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Rola</label>
                  <Badge variant="outline">{(selectedNode.data as any).role}</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Popis</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {(selectedNode.data as any).description || 'Bez popisu'}
                </p>
              </div>

              {(selectedNode.data as any).features && (
                <div>
                  <label className="text-sm font-medium">Funkcie</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {((selectedNode.data as any).features || []).map((feature: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(selectedNode.data as any).category === NODE_CATEGORIES.PLUGINS && (
                <div className="border-t pt-4">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Plugin Štatistiky
                  </label>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Onboarding komponenty:</span>
                      <span className="font-medium ml-2">{pluginStats.onboarding}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Business komponenty:</span>
                      <span className="font-medium ml-2">{pluginStats.business}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hooks:</span>
                      <span className="font-medium ml-2">{pluginStats.hooks}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Database schémy:</span>
                      <span className="font-medium ml-2">{pluginStats.database}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      
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
        </TabsContent>

        <TabsContent value="application" className="space-y-6">
          <ApplicationView />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AppArchitecturePage;