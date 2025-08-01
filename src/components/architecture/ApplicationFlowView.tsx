import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  TrendingUp, 
  ClipboardList, 
  Settings, 
  Building2,
  UserCheck,
  FileText,
  BarChart3
} from 'lucide-react';

// Role colors
const ROLE_COLORS = {
  admin: 'hsl(var(--destructive))',
  iso: 'hsl(var(--primary))',
  merchant: 'hsl(var(--success))',
  shared: 'hsl(var(--muted-foreground))'
};

// Application nodes definition
const applicationNodes: Node[] = [
  // Dashboard Layer (Top)
  {
    id: 'admin-dashboard',
    type: 'default',
    position: { x: 100, y: 50 },
    data: { 
      label: 'Admin Dashboard',
      icon: LayoutDashboard,
      role: 'admin',
      description: 'Komplexný prehľad systému'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.admin}15`,
      borderColor: ROLE_COLORS.admin,
      borderWidth: 2,
      width: 180,
      height: 80
    }
  },
  {
    id: 'iso-dashboard',
    type: 'default',
    position: { x: 320, y: 50 },
    data: { 
      label: 'ISO Dashboard',
      icon: LayoutDashboard,
      role: 'iso',
      description: 'ISO operácie'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.iso}15`,
      borderColor: ROLE_COLORS.iso,
      borderWidth: 2,
      width: 180,
      height: 80
    }
  },
  {
    id: 'merchant-portal',
    type: 'default',
    position: { x: 540, y: 50 },
    data: { 
      label: 'Merchant Portal',
      icon: LayoutDashboard,
      role: 'merchant',
      description: 'Self-service portál'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.merchant}15`,
      borderColor: ROLE_COLORS.merchant,
      borderWidth: 2,
      width: 180,
      height: 80
    }
  },

  // Business Processes Layer (Middle Left)
  {
    id: 'deal-management',
    type: 'default',
    position: { x: 50, y: 200 },
    data: { 
      label: 'Deal Management',
      icon: Building2,
      role: 'admin',
      description: 'Správa obchodných príležitostí'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.admin}15`,
      borderColor: ROLE_COLORS.admin,
      borderWidth: 2,
      width: 160,
      height: 70
    }
  },
  {
    id: 'contract-lifecycle',
    type: 'default',
    position: { x: 50, y: 300 },
    data: { 
      label: 'Contract Lifecycle',
      icon: FileText,
      role: 'iso',
      description: 'Životný cyklus zmlúv'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.iso}15`,
      borderColor: ROLE_COLORS.iso,
      borderWidth: 2,
      width: 160,
      height: 70
    }
  },

  // Client Management Layer (Middle Right)
  {
    id: 'merchant-database',
    type: 'default',
    position: { x: 550, y: 200 },
    data: { 
      label: 'Merchant Database',
      icon: Users,
      role: 'admin',
      description: 'Centrálna databáza klientov'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.admin}15`,
      borderColor: ROLE_COLORS.admin,
      borderWidth: 2,
      width: 160,
      height: 70
    }
  },
  {
    id: 'location-management',
    type: 'default',
    position: { x: 550, y: 300 },
    data: { 
      label: 'Location Management',
      icon: Users,
      role: 'iso',
      description: 'Správa lokácií klientov'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.iso}15`,
      borderColor: ROLE_COLORS.iso,
      borderWidth: 2,
      width: 160,
      height: 70
    }
  },

  // Product & Analytics Layer (Bottom)
  {
    id: 'product-catalog',
    type: 'default',
    position: { x: 250, y: 200 },
    data: { 
      label: 'Product Catalog',
      icon: Package,
      role: 'admin',
      description: 'Správa produktového katalógu'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.admin}15`,
      borderColor: ROLE_COLORS.admin,
      borderWidth: 2,
      width: 160,
      height: 70
    }
  },
  {
    id: 'visual-builder',
    type: 'default',
    position: { x: 250, y: 300 },
    data: { 
      label: 'Visual Builder',
      icon: Package,
      role: 'iso',
      description: 'Tvorba riešení'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.iso}15`,
      borderColor: ROLE_COLORS.iso,
      borderWidth: 2,
      width: 160,
      height: 70
    }
  },
  {
    id: 'analytics-engine',
    type: 'default',
    position: { x: 350, y: 450 },
    data: { 
      label: 'Analytics Engine',
      icon: TrendingUp,
      role: 'admin',
      description: 'Business Intelligence'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.admin}15`,
      borderColor: ROLE_COLORS.admin,
      borderWidth: 2,
      width: 160,
      height: 70
    }
  },

  // System Management Layer (Right Side)
  {
    id: 'onboarding-system',
    type: 'default',
    position: { x: 750, y: 200 },
    data: { 
      label: 'Onboarding System',
      icon: ClipboardList,
      role: 'admin',
      description: 'Konfigurácia onboardingu'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.admin}15`,
      borderColor: ROLE_COLORS.admin,
      borderWidth: 2,
      width: 160,
      height: 70
    }
  },
  {
    id: 'system-config',
    type: 'default',
    position: { x: 750, y: 300 },
    data: { 
      label: 'System Config',
      icon: Settings,
      role: 'admin',
      description: 'Systémové nastavenia'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.admin}15`,
      borderColor: ROLE_COLORS.admin,
      borderWidth: 2,
      width: 160,
      height: 70
    }
  },

  // Shared Services
  {
    id: 'user-management',
    type: 'default',
    position: { x: 450, y: 550 },
    data: { 
      label: 'User Management',
      icon: UserCheck,
      role: 'shared',
      description: 'Správa používateľov'
    },
    style: { 
      backgroundColor: `${ROLE_COLORS.shared}15`,
      borderColor: ROLE_COLORS.shared,
      borderWidth: 2,
      width: 160,
      height: 70
    }
  }
];

// Edges showing data flow
const applicationEdges: Edge[] = [
  // Dashboard connections
  { id: 'e1', source: 'admin-dashboard', target: 'deal-management', type: 'smoothstep' },
  { id: 'e2', source: 'admin-dashboard', target: 'merchant-database', type: 'smoothstep' },
  { id: 'e3', source: 'admin-dashboard', target: 'product-catalog', type: 'smoothstep' },
  { id: 'e4', source: 'iso-dashboard', target: 'contract-lifecycle', type: 'smoothstep' },
  { id: 'e5', source: 'iso-dashboard', target: 'location-management', type: 'smoothstep' },
  { id: 'e6', source: 'iso-dashboard', target: 'visual-builder', type: 'smoothstep' },
  
  // Business process flows
  { id: 'e7', source: 'deal-management', target: 'contract-lifecycle', type: 'smoothstep' },
  { id: 'e8', source: 'contract-lifecycle', target: 'onboarding-system', type: 'smoothstep' },
  { id: 'e9', source: 'product-catalog', target: 'visual-builder', type: 'smoothstep' },
  { id: 'e10', source: 'merchant-database', target: 'location-management', type: 'smoothstep' },
  
  // Analytics connections
  { id: 'e11', source: 'deal-management', target: 'analytics-engine', type: 'smoothstep' },
  { id: 'e12', source: 'contract-lifecycle', target: 'analytics-engine', type: 'smoothstep' },
  { id: 'e13', source: 'visual-builder', target: 'analytics-engine', type: 'smoothstep' },
  
  // System connections
  { id: 'e14', source: 'system-config', target: 'user-management', type: 'smoothstep' },
  { id: 'e15', source: 'onboarding-system', target: 'user-management', type: 'smoothstep' }
];

export default function ApplicationFlowView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(applicationNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(applicationEdges);
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const filterByRole = (role: string) => {
    setSelectedRole(role);
    if (role === 'all') {
      setNodes(applicationNodes);
      setEdges(applicationEdges);
    } else {
      const filteredNodes = applicationNodes.filter(node => 
        node.data.role === role || node.data.role === 'shared'
      );
      const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
      const filteredEdges = applicationEdges.filter(edge => 
        filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
      );
      setNodes(filteredNodes);
      setEdges(filteredEdges);
    }
  };

  const CustomNode = ({ data }: { data: any }) => {
    const IconComponent = data.icon;
    return (
      <div className="p-3 text-center">
        <div className="flex items-center justify-center mb-2">
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="text-sm font-medium">{data.label}</div>
        <div className="text-xs text-muted-foreground mt-1">{data.description}</div>
      </div>
    );
  };

  const nodeTypes = {
    default: CustomNode
  };

  return (
    <div className="h-[800px] w-full border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={{ backgroundColor: 'hsl(var(--background))' }}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            const role = node.data?.role || 'shared';
            return ROLE_COLORS[role as keyof typeof ROLE_COLORS];
          }}
        />
        
        <Panel position="top-left" className="bg-background/95 backdrop-blur-sm p-4 rounded-lg border">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Filter podľa roly:</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedRole === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => filterByRole('all')}
              >
                Všetky
              </Button>
              <Button
                variant={selectedRole === 'admin' ? 'default' : 'outline'}
                size="sm"
                onClick={() => filterByRole('admin')}
                style={{ 
                  backgroundColor: selectedRole === 'admin' ? ROLE_COLORS.admin : undefined,
                  borderColor: ROLE_COLORS.admin 
                }}
              >
                Admin
              </Button>
              <Button
                variant={selectedRole === 'iso' ? 'default' : 'outline'}
                size="sm"
                onClick={() => filterByRole('iso')}
                style={{ 
                  backgroundColor: selectedRole === 'iso' ? ROLE_COLORS.iso : undefined,
                  borderColor: ROLE_COLORS.iso 
                }}
              >
                ISO
              </Button>
              <Button
                variant={selectedRole === 'merchant' ? 'default' : 'outline'}
                size="sm"
                onClick={() => filterByRole('merchant')}
                style={{ 
                  backgroundColor: selectedRole === 'merchant' ? ROLE_COLORS.merchant : undefined,
                  borderColor: ROLE_COLORS.merchant 
                }}
              >
                Merchant
              </Button>
            </div>
          </div>
        </Panel>

        <Panel position="bottom-right" className="bg-background/95 backdrop-blur-sm p-4 rounded-lg border">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Legenda rolí:</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: ROLE_COLORS.admin }}
                />
                <span className="text-xs">Admin - Plný prístup</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: ROLE_COLORS.iso }}
                />
                <span className="text-xs">ISO - ISO operácie (Admin, Obchodný zástupca, Bežný používateľ)</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: ROLE_COLORS.merchant }}
                />
                <span className="text-xs">Merchant - Self-service</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: ROLE_COLORS.shared }}
                />
                <span className="text-xs">Shared - Spoločné funkcie</span>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}