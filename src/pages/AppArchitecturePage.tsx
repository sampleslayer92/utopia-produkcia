import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from 'react-i18next';

const initialNodes = [
  // Authentication Layer
  {
    id: 'auth-context',
    type: 'default',
    position: { x: 100, y: 50 },
    data: { label: 'AuthContext' },
    style: { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }
  },
  {
    id: 'protected-route',
    type: 'default',
    position: { x: 300, y: 50 },
    data: { label: 'ProtectedRoute' },
    style: { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }
  },

  // Main App Router
  {
    id: 'app-router',
    type: 'default',
    position: { x: 200, y: 150 },
    data: { label: 'App Router' },
    style: { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' }
  },

  // Dashboard Layer
  {
    id: 'admin-dashboard',
    type: 'default',
    position: { x: 50, y: 250 },
    data: { label: 'AdminDashboard' },
    style: { backgroundColor: '#DCFCE7', borderColor: '#22C55E' }
  },
  {
    id: 'partner-dashboard',
    type: 'default',
    position: { x: 200, y: 250 },
    data: { label: 'PartnerDashboard' },
    style: { backgroundColor: '#DCFCE7', borderColor: '#22C55E' }
  },
  {
    id: 'merchant-dashboard',
    type: 'default',
    position: { x: 350, y: 250 },
    data: { label: 'MerchantDashboard' },
    style: { backgroundColor: '#DCFCE7', borderColor: '#22C55E' }
  },

  // Contract Management Module
  {
    id: 'contracts-page',
    type: 'default',
    position: { x: 50, y: 350 },
    data: { label: 'ContractsPage' },
    style: { backgroundColor: '#F3E8FF', borderColor: '#8B5CF6' }
  },
  {
    id: 'contract-detail',
    type: 'default',
    position: { x: 200, y: 350 },
    data: { label: 'ContractDetailPage' },
    style: { backgroundColor: '#F3E8FF', borderColor: '#8B5CF6' }
  },
  {
    id: 'onboarding-flow',
    type: 'default',
    position: { x: 350, y: 350 },
    data: { label: 'OnboardingFlow' },
    style: { backgroundColor: '#F3E8FF', borderColor: '#8B5CF6' }
  },

  // Merchant Management Module
  {
    id: 'merchants-page',
    type: 'default',
    position: { x: 500, y: 250 },
    data: { label: 'MerchantsPage' },
    style: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }
  },
  {
    id: 'business-locations',
    type: 'default',
    position: { x: 500, y: 350 },
    data: { label: 'BusinessLocationsPage' },
    style: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }
  },

  // Warehouse Management Module
  {
    id: 'warehouse-page',
    type: 'default',
    position: { x: 650, y: 250 },
    data: { label: 'WarehousePage' },
    style: { backgroundColor: '#FFF7ED', borderColor: '#F97316' }
  },
  {
    id: 'item-types-page',
    type: 'default',
    position: { x: 650, y: 350 },
    data: { label: 'ItemTypesPage' },
    style: { backgroundColor: '#FFF7ED', borderColor: '#F97316' }
  },

  // Team Management Module
  {
    id: 'team-page',
    type: 'default',
    position: { x: 800, y: 250 },
    data: { label: 'TeamPage' },
    style: { backgroundColor: '#ECFDF5', borderColor: '#10B981' }
  },
  {
    id: 'settings-page',
    type: 'default',
    position: { x: 800, y: 350 },
    data: { label: 'SettingsPage' },
    style: { backgroundColor: '#ECFDF5', borderColor: '#10B981' }
  },

  // Database Layer
  {
    id: 'supabase',
    type: 'default',
    position: { x: 400, y: 500 },
    data: { label: 'Supabase DB' },
    style: { backgroundColor: '#1F2937', color: '#FFFFFF', borderColor: '#374151' }
  },

  // Context Layer
  {
    id: 'cart-context',
    type: 'default',
    position: { x: 100, y: 450 },
    data: { label: 'CartContext' },
    style: { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }
  },

  // Hooks Layer
  {
    id: 'custom-hooks',
    type: 'default',
    position: { x: 600, y: 450 },
    data: { label: 'Custom Hooks' },
    style: { backgroundColor: '#E0E7FF', borderColor: '#6366F1' }
  }
];

const initialEdges = [
  // Authentication flow
  { id: 'e1', source: 'auth-context', target: 'protected-route', type: 'smoothstep' },
  { id: 'e2', source: 'protected-route', target: 'app-router', type: 'smoothstep' },

  // Router to dashboards
  { id: 'e3', source: 'app-router', target: 'admin-dashboard', type: 'smoothstep' },
  { id: 'e4', source: 'app-router', target: 'partner-dashboard', type: 'smoothstep' },
  { id: 'e5', source: 'app-router', target: 'merchant-dashboard', type: 'smoothstep' },

  // Admin dashboard connections
  { id: 'e6', source: 'admin-dashboard', target: 'contracts-page', type: 'smoothstep' },
  { id: 'e7', source: 'admin-dashboard', target: 'merchants-page', type: 'smoothstep' },
  { id: 'e8', source: 'admin-dashboard', target: 'warehouse-page', type: 'smoothstep' },
  { id: 'e9', source: 'admin-dashboard', target: 'team-page', type: 'smoothstep' },

  // Contract module connections
  { id: 'e10', source: 'contracts-page', target: 'contract-detail', type: 'smoothstep' },
  { id: 'e11', source: 'contracts-page', target: 'onboarding-flow', type: 'smoothstep' },

  // Merchant module connections
  { id: 'e12', source: 'merchants-page', target: 'business-locations', type: 'smoothstep' },

  // Warehouse module connections
  { id: 'e13', source: 'warehouse-page', target: 'item-types-page', type: 'smoothstep' },

  // Team module connections
  { id: 'e14', source: 'team-page', target: 'settings-page', type: 'smoothstep' },

  // Database connections
  { id: 'e15', source: 'contracts-page', target: 'supabase', type: 'smoothstep' },
  { id: 'e16', source: 'merchants-page', target: 'supabase', type: 'smoothstep' },
  { id: 'e17', source: 'warehouse-page', target: 'supabase', type: 'smoothstep' },
  { id: 'e18', source: 'team-page', target: 'supabase', type: 'smoothstep' },
  { id: 'e19', source: 'onboarding-flow', target: 'supabase', type: 'smoothstep' },

  // Context connections
  { id: 'e20', source: 'cart-context', target: 'warehouse-page', type: 'smoothstep' },

  // Hooks connections
  { id: 'e21', source: 'custom-hooks', target: 'supabase', type: 'smoothstep' },
  { id: 'e22', source: 'custom-hooks', target: 'contracts-page', type: 'smoothstep' },
  { id: 'e23', source: 'custom-hooks', target: 'merchants-page', type: 'smoothstep' }
];

const AppArchitecturePage = () => {
  const { t } = useTranslation('admin');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <AdminLayout
      title="Architektúra aplikácie"
      subtitle="Interaktívna mapa celej aplikácie a jej komponentov"
    >
      <div className="h-[calc(100vh-12rem)] bg-background rounded-lg border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionMode={ConnectionMode.Loose}
          fitView
          attributionPosition="bottom-left"
          className="bg-background"
        >
          <MiniMap 
            zoomable 
            pannable 
            className="bg-background border rounded"
          />
          <Controls className="bg-background border rounded" />
          <Background className="bg-muted/20" />
        </ReactFlow>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></div>
          <span>Autentifikácia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div>
          <span>Routing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
          <span>Dashboardy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 border border-purple-500 rounded"></div>
          <span>Zmluvy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-500 rounded"></div>
          <span>Merchanti</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-500 rounded"></div>
          <span>Sklad</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-100 border border-emerald-500 rounded"></div>
          <span>Tím & Nastavenia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-800 rounded"></div>
          <span>Databáza</span>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AppArchitecturePage;