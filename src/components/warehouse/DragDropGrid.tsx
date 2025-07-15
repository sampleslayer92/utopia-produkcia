import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Target, 
  FolderOpen,
  Plus,
  ArrowRightLeft,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

interface DragDropItem {
  id: string;
  name: string;
  type: 'product' | 'category' | 'solution';
  category?: string;
  subtitle?: string;
  monthly_fee?: number;
  is_active: boolean;
  connected_to?: string[];
}

interface SortableCardProps {
  item: DragDropItem;
  onConnect: (fromId: string, toId: string) => void;
  connections: Array<{from: string, to: string}>;
}

function SortableCard({ item, onConnect, connections }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getIcon = () => {
    switch (item.type) {
      case 'product': return <Package className="h-5 w-5" />;
      case 'category': return <FolderOpen className="h-5 w-5" />;
      case 'solution': return <Target className="h-5 w-5" />;
    }
  };

  const getCardColor = () => {
    switch (item.type) {
      case 'product': return 'border-blue-200 bg-blue-50/50';
      case 'category': return 'border-purple-200 bg-purple-50/50';
      case 'solution': return 'border-green-200 bg-green-50/50';
    }
  };

  const getConnectedCount = () => {
    return connections.filter(c => c.from === item.id || c.to === item.id).length;
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-move hover:shadow-lg transition-all ${getCardColor()} ${
        isDragging ? 'shadow-2xl scale-105' : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded ${
                item.type === 'product' ? 'bg-blue-500 text-white' :
                item.type === 'category' ? 'bg-purple-500 text-white' :
                'bg-green-500 text-white'
              }`}>
                {getIcon()}
              </div>
              <h3 className="font-medium text-sm">{item.name}</h3>
            </div>
            <Badge variant={item.is_active ? "default" : "secondary"} className="text-xs">
              {item.is_active ? 'Aktívne' : 'Neaktívne'}
            </Badge>
          </div>

          {/* Content */}
          <div className="space-y-1">
            {item.category && (
              <p className="text-xs text-muted-foreground">📁 {item.category}</p>
            )}
            {item.subtitle && (
              <p className="text-xs text-muted-foreground">💬 {item.subtitle}</p>
            )}
            {item.monthly_fee && (
              <p className="text-xs font-medium text-green-600">💰 €{item.monthly_fee}/mes</p>
            )}
          </div>

          {/* Connections */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-1">
              <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {getConnectedCount()} prepojení
              </span>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toast.info(`Prepojenie pre ${item.name}`);
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DragDropGridProps {
  items: DragDropItem[];
  onItemsReorder: (items: DragDropItem[]) => void;
  onConnect: (fromId: string, toId: string) => void;
}

export const DragDropGrid = ({ items, onItemsReorder, onConnect }: DragDropGridProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [connections, setConnections] = useState<Array<{from: string, to: string}>>([]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over?.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onItemsReorder(newItems);
      
      toast.success('Poradie bolo aktualizované');
    }

    setActiveId(null);
  }

  const handleConnect = (fromId: string, toId: string) => {
    const newConnection = { from: fromId, to: toId };
    setConnections(prev => [...prev, newConnection]);
    onConnect(fromId, toId);
    toast.success('Položky boli prepojené');
  };

  const activeItem = items.find(item => item.id === activeId);

  // Group items by type for better visualization
  const groupedItems = {
    solutions: items.filter(item => item.type === 'solution'),
    categories: items.filter(item => item.type === 'category'),
    products: items.filter(item => item.type === 'product'),
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Visual Builder aktívny</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>📦 {groupedItems.products.length} produktov</span>
          <span>📁 {groupedItems.categories.length} kategórií</span>
          <span>🎯 {groupedItems.solutions.length} riešení</span>
          <span>🔗 {connections.length} prepojení</span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
          {/* Solutions Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-green-600">🎯 Riešenia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {groupedItems.solutions.map((item) => (
                <SortableCard 
                  key={item.id} 
                  item={item} 
                  onConnect={handleConnect}
                  connections={connections}
                />
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-purple-600">📁 Kategórie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {groupedItems.categories.map((item) => (
                <SortableCard 
                  key={item.id} 
                  item={item} 
                  onConnect={handleConnect}
                  connections={connections}
                />
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-600">📦 Produkty</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {groupedItems.products.map((item) => (
                <SortableCard 
                  key={item.id} 
                  item={item} 
                  onConnect={handleConnect}
                  connections={connections}
                />
              ))}
            </div>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId && activeItem ? (
            <Card className="shadow-2xl opacity-90">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded ${
                    activeItem.type === 'product' ? 'bg-blue-500 text-white' :
                    activeItem.type === 'category' ? 'bg-purple-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {activeItem.type === 'product' && <Package className="h-4 w-4" />}
                    {activeItem.type === 'category' && <FolderOpen className="h-4 w-4" />}
                    {activeItem.type === 'solution' && <Target className="h-4 w-4" />}
                  </div>
                  <span className="font-medium">{activeItem.name}</span>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};