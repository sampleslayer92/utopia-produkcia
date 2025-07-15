import { useState, useCallback } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  Active,
  Over,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Target, 
  FolderOpen, 
  GripVertical, 
  ArrowRight,
  Lightbulb,
  Zap,
  CheckCircle,
  Edit3,
  Copy,
  Trash2,
  Plus,
  Save,
  X
} from 'lucide-react';
import { useWarehouseItems } from '@/hooks/useWarehouseItems';
import { useCategories } from '@/hooks/useCategories';
import { useSolutions } from '@/hooks/useSolutions';
import { useUpdateWarehouseItem } from '@/hooks/useWarehouseItems';
import { useBulkUpdateWarehouseItems } from '@/hooks/useBulkWarehouseOperations';
import { toast } from 'sonner';

interface DragItem {
  id: string;
  type: 'product' | 'category' | 'solution';
  data: any;
}

interface EditingItem {
  id: string;
  field: string;
  value: string;
}

interface CategoryDropZone {
  id: string;
  name: string;
  color: string;
  items: any[];
}

interface SortableItemProps {
  id: string;
  item: any;
  type: 'product' | 'category' | 'solution';
  isEditing?: boolean;
  editingField?: string;
  onStartEdit: (id: string, field: string, value: string) => void;
  onSaveEdit: (id: string, field: string, value: string) => void;
  onCancelEdit: () => void;
  onQuickAction: (action: string, item: any) => void;
}

function SortableItem({ 
  id, 
  item, 
  type, 
  isEditing = false, 
  editingField, 
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit,
  onQuickAction 
}: SortableItemProps) {
  const [editValue, setEditValue] = useState('');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getIcon = () => {
    switch (type) {
      case 'product': return <Package className="h-4 w-4" />;
      case 'category': return <FolderOpen className="h-4 w-4" />;
      case 'solution': return <Target className="h-4 w-4" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'product': return 'bg-blue-500';
      case 'category': return 'bg-purple-500';
      case 'solution': return 'bg-green-500';
    }
  };

  const handleEditStart = (field: string, value: string) => {
    setEditValue(value);
    onStartEdit(id, field, value);
  };

  const handleEditSave = () => {
    onSaveEdit(id, editingField!, editValue);
    setEditValue('');
  };

  const handleEditCancel = () => {
    onCancelEdit();
    setEditValue('');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center space-x-3 p-3 bg-background border rounded-lg shadow-sm hover:shadow-md transition-all ${
        isDragging ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className={`p-2 rounded-lg ${getColor()} text-white`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        {/* Editable Name */}
        {isEditing && editingField === 'name' ? (
          <div className="flex items-center space-x-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-6 text-sm"
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={handleEditSave}>
              <Save className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleEditCancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <h4 
            className="font-medium truncate cursor-pointer hover:text-primary"
            onClick={() => handleEditStart('name', item.name)}
          >
            {item.name}
          </h4>
        )}

        {/* Editable Secondary Info */}
        <div className="text-sm text-muted-foreground truncate">
          {type === 'product' && (
            <div className="flex items-center space-x-2">
              <span>{item.category}</span>
              <span>•</span>
              {isEditing && editingField === 'monthly_fee' ? (
                <div className="flex items-center space-x-1">
                  <span>€</span>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-5 w-16 text-xs"
                    type="number"
                    autoFocus
                  />
                  <span>/mes</span>
                  <Button size="sm" variant="ghost" onClick={handleEditSave}>
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleEditCancel}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <span 
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleEditStart('monthly_fee', item.monthly_fee.toString())}
                >
                  €{item.monthly_fee}/mes
                </span>
              )}
            </div>
          )}
          {type === 'category' && (item.description || 'Kategória')}
          {type === 'solution' && (item.subtitle || 'Riešenie')}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Badge variant={item.is_active ? "default" : "secondary"} className="text-xs">
          {item.is_active ? 'Aktívne' : 'Neaktívne'}
        </Badge>

        {/* Quick Actions - Show on Hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onQuickAction('edit', item)}
            className="h-6 w-6 p-0"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onQuickAction('copy', item)}
            className="h-6 w-6 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onQuickAction('delete', item)}
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DropZoneProps {
  category: CategoryDropZone;
  items: any[];
  onItemMove: (itemId: string, categoryId: string) => void;
}

function CategoryDropZone({ category, items, onItemMove }: DropZoneProps) {
  const categoryItems = items.filter(item => item.category_id === category.id);

  return (
    <Card className="min-h-[200px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: category.color }}
          />
          <span>{category.name}</span>
          <Badge variant="outline" className="text-xs">
            {categoryItems.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categoryItems.map((item) => (
          <div key={item.id} className="p-2 bg-muted rounded text-sm">
            <div className="font-medium">{item.name}</div>
            <div className="text-xs text-muted-foreground">
              €{item.monthly_fee}/mes
            </div>
          </div>
        ))}
        {categoryItems.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            <FolderOpen className="h-6 w-6 mx-auto mb-2 opacity-50" />
            Žiadne produkty
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const EnhancedVisualBuilder = () => {
  const [selectedTab, setSelectedTab] = useState<'drag-drop' | 'categories' | 'solutions'>('drag-drop');
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  
  const { data: products = [] } = useWarehouseItems();
  const { data: categories = [] } = useCategories();
  const { data: solutions = [] } = useSolutions();
  
  const updateMutation = useUpdateWarehouseItem();
  const bulkUpdateMutation = useBulkUpdateWarehouseItems();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = products.find(p => p.id === active.id) || 
                categories.find(c => c.id === active.id) || 
                solutions.find(s => s.id === active.id);
    
    if (item) {
      let type: 'product' | 'category' | 'solution' = 'product';
      if (categories.find(c => c.id === active.id)) type = 'category';
      if (solutions.find(s => s.id === active.id)) type = 'solution';
      
      setDraggedItem({ id: active.id as string, type, data: item });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedItem(null);

    if (!over) return;

    // Handle cross-category moves
    if (over.id.toString().startsWith('category-')) {
      const categoryId = over.id.toString().replace('category-', '');
      const productId = active.id as string;
      
      // Update product category
      updateMutation.mutate({
        id: productId,
        category_id: categoryId
      });
      
      toast.success('Produkt premiestnený do novej kategórie');
      return;
    }

    // Handle reordering within same context
    if (active.id !== over.id) {
      toast.success('Poradie bolo aktualizované');
    }
  };

  const handleStartEdit = useCallback((id: string, field: string, value: string) => {
    setEditingItem({ id, field, value });
  }, []);

  const handleSaveEdit = useCallback((id: string, field: string, value: string) => {
    const updates: any = {};
    
    if (field === 'name') {
      updates.name = value;
    } else if (field === 'monthly_fee') {
      updates.monthly_fee = parseFloat(value) || 0;
    }

    updateMutation.mutate({ id, ...updates });
    setEditingItem(null);
  }, [updateMutation]);

  const handleCancelEdit = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleQuickAction = useCallback((action: string, item: any) => {
    switch (action) {
      case 'edit':
        toast.info(`Otváram editáciu ${item.name}`);
        break;
      case 'copy':
        toast.info(`Duplikujem ${item.name}`);
        break;
      case 'delete':
        if (confirm(`Naozaj chcete zmazať ${item.name}?`)) {
          toast.info(`Mažem ${item.name}`);
        }
        break;
    }
  }, []);

  const categoryDropZones: CategoryDropZone[] = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    color: cat.color,
    items: products.filter(p => p.category_id === cat.id)
  }));

  const currentItems = () => {
    switch (selectedTab) {
      case 'drag-drop': return products;
      case 'categories': return categories;
      case 'solutions': return solutions;
      default: return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🎨 Enhanced Visual Builder</h2>
          <p className="text-muted-foreground">
            Pokročilý drag & drop editor s cross-category presúvaním a granulárnym editovaním
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={selectedTab === 'drag-drop' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('drag-drop')}
          className="flex-1"
        >
          <GripVertical className="h-4 w-4 mr-2" />
          Drag & Drop Editor
        </Button>
        <Button
          variant={selectedTab === 'categories' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('categories')}
          className="flex-1"
        >
          <FolderOpen className="h-4 w-4 mr-2" />
          Category Builder
        </Button>
        <Button
          variant={selectedTab === 'solutions' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('solutions')}
          className="flex-1"
        >
          <Target className="h-4 w-4 mr-2" />
          Solution Builder
        </Button>
      </div>

      {selectedTab === 'drag-drop' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Source Items */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span>Produkty ({products.length})</span>
                  </CardTitle>
                  <CardDescription>
                    Presúvajte produkty medzi kategóriami aloud editujte priamo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SortableContext
                    items={products.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {products.map((item) => (
                        <SortableItem
                          key={item.id}
                          id={item.id}
                          item={item}
                          type="product"
                          isEditing={editingItem?.id === item.id}
                          editingField={editingItem?.field}
                          onStartEdit={handleStartEdit}
                          onSaveEdit={handleSaveEdit}
                          onCancelEdit={handleCancelEdit}
                          onQuickAction={handleQuickAction}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            </div>

            {/* Category Drop Zones */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryDropZones.map((category) => (
                  <div 
                    key={category.id}
                    id={`category-${category.id}`}
                    className="drop-zone"
                  >
                    <CategoryDropZone
                      category={category}
                      items={products}
                      onItemMove={(itemId, categoryId) => {
                        updateMutation.mutate({
                          id: itemId,
                          category_id: categoryId
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drag Overlay Info */}
          {draggedItem && (
            <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-lg shadow-lg z-50">
              <div className="flex items-center space-x-2">
                <GripVertical className="h-4 w-4" />
                <span className="font-medium">Presúvam: {draggedItem.data.name}</span>
              </div>
              <p className="text-xs opacity-80">Pustite nad kategóriou pre presun</p>
            </div>
          )}
        </DndContext>
      )}

      {selectedTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Správa kategórií</CardTitle>
              <CardDescription>
                Vytvárajte a upravujte kategórie produktov
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-3 p-3 border rounded">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <Badge variant="outline">
                    {products.filter(p => p.category_id === category.id).length} produktov
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vytvoriť kategóriu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input placeholder="Názov kategórie" />
                <Input placeholder="Popis" />
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Vytvoriť kategóriu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'solutions' && (
        <Card>
          <CardHeader>
            <CardTitle>Solution Builder</CardTitle>
            <CardDescription>
              Vytvárajte komplexné riešenia z produktov
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Solution Builder bude implementovaný v ďalšej fáze</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Enhanced Visual Builder aktívny
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{products.length} produktov</span>
              <span>•</span>
              <span>{categories.length} kategórií</span>
              <span>•</span>
              <span>{solutions.length} riešení</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};