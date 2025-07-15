import { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
  DragOverEvent,
  DragStartEvent,
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
import { 
  Package, 
  Target, 
  FolderOpen, 
  GripVertical, 
  ArrowRight,
  Lightbulb,
  Zap,
  CheckCircle
} from 'lucide-react';
import { useWarehouseItems, useUpdateWarehouseItem } from '@/hooks/useWarehouseItems';
import { useCategories, useUpdateCategory } from '@/hooks/useCategories';
import { useSolutions, useUpdateSolution } from '@/hooks/useSolutions';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SortableItemProps {
  id: string;
  item: any;
  type: 'product' | 'category' | 'solution';
}

function SortableItem({ id, item, type }: SortableItemProps) {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-3 p-3 bg-background border rounded-lg shadow-sm hover:shadow-md transition-shadow"
      onClick={() => {
        if (type === 'product') {
          navigate(`/admin/warehouse/items/${item.id}`);
        } else if (type === 'category') {
          navigate(`/admin/warehouse/categories/${item.id}`);
        } else if (type === 'solution') {
          navigate(`/admin/warehouse/solutions`);
        }
      }}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className={`p-2 rounded-lg ${getColor()} text-white`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{item.name}</h4>
        <p className="text-sm text-muted-foreground truncate">
          {type === 'product' && `${item.category} • €${item.monthly_fee}/mes`}
          {type === 'category' && `${item.description || 'Kategória'}`}
          {type === 'solution' && `${item.subtitle || 'Riešenie'}`}
        </p>
      </div>

      <Badge variant={item.is_active ? "default" : "secondary"}>
        {item.is_active ? 'Aktívne' : 'Neaktívne'}
      </Badge>
    </div>
  );
}

interface CategoryDropZoneProps {
  id: string;
  title: string;
  items: any[];
  color?: string;
  isActive?: boolean;
}

function CategoryDropZone({ id, title, items, color = 'bg-muted', isActive = false }: CategoryDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Card className={`min-h-[400px] ${isOver ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="secondary" className="text-xs">
            {items.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent ref={setNodeRef} className="space-y-2">
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              item={item}
              type="product"
            />
          ))}
        </SortableContext>
        
        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Žiadne produkty</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  action: () => void;
  confidence: number;
  type: 'category' | 'solution' | 'pricing' | 'bundle';
}

export const VisualBuilder = () => {
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const navigate = useNavigate();
  
  const { data: products = [] } = useWarehouseItems();
  const { data: categories = [] } = useCategories();
  const { data: solutions = [] } = useSolutions();
  
  const updateWarehouseItemMutation = useUpdateWarehouseItem();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Smart suggestions based on current data
  const getSmartSuggestions = (): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];

    // Category suggestions
    const uncategorizedProducts = products.filter(p => !p.category_id || p.category === 'other');
    if (uncategorizedProducts.length > 3) {
      suggestions.push({
        id: 'categorize',
        title: `Kategorizovať ${uncategorizedProducts.length} produktov`,
        description: 'Produkty bez kategórie môžu byť ťažšie spravovateľné',
        action: () => navigate('/admin/warehouse/categories'),
        confidence: 85,
        type: 'category'
      });
    }

    // Solution suggestions
    const productsWithoutSolution = products.filter(p => 
      !solutions.some(s => s.id === p.id) // Simplified check
    );
    if (productsWithoutSolution.length > 5) {
      suggestions.push({
        id: 'create-bundle',
        title: 'Vytvoriť nové riešenie',
        description: `${productsWithoutSolution.length} produktov nie je súčasťou žiadneho riešenia`,
        action: () => navigate('/admin/warehouse/solutions'),
        confidence: 75,
        type: 'solution'
      });
    }

    // Pricing suggestions
    const lowPricedProducts = products.filter(p => p.monthly_fee < 5);
    if (lowPricedProducts.length > 2) {
      suggestions.push({
        id: 'price-review',
        title: 'Preskúmať cenník',
        description: `${lowPricedProducts.length} produktov má nízku cenu (< 5€)`,
        action: () => navigate('/admin/warehouse'),
        confidence: 60,
        type: 'pricing'
      });
    }

    // Bundle suggestions
    const popularCategories = categories.filter(c => 
      products.filter(p => p.category_id === c.id).length >= 3
    );
    if (popularCategories.length > 0) {
      suggestions.push({
        id: 'bundle-popular',
        title: 'Vytvoriť bundle z populárnych kategórií',
        description: `Kategórie s 3+ produktmi sú vhodné na bundling`,
        action: () => navigate('/admin/warehouse/solutions'),
        confidence: 70,
        type: 'bundle'
      });
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  };

  // Group products by category
  const getProductsByCategory = () => {
    const productsByCategory: Record<string, any[]> = {};
    
    // All products (uncategorized)
    const uncategorizedProducts = products.filter(p => !p.category_id || p.category === 'other');
    productsByCategory['all'] = uncategorizedProducts;
    
    // Products by category
    categories.forEach(category => {
      productsByCategory[category.id] = products.filter(p => p.category_id === category.id);
    });
    
    return productsByCategory;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = products.find(p => p.id === active.id);
    setDraggedItem(item);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedItem(null);

    if (!over || active.id === over.id) {
      return;
    }

    const productId = active.id as string;
    const targetCategoryId = over.id as string;

    try {
      // Find the product being moved
      const product = products.find(p => p.id === productId);
      if (!product) return;

      // Determine the new category
      let newCategoryId: string | null = null;
      let newCategoryName = 'other';

      if (targetCategoryId !== 'all') {
        const targetCategory = categories.find(c => c.id === targetCategoryId);
        if (targetCategory) {
          newCategoryId = targetCategory.id;
          newCategoryName = targetCategory.name;
        }
      }

      // Update the product
      await updateWarehouseItemMutation.mutateAsync({
        id: productId,
        category_id: newCategoryId,
      });

      toast.success('Produkt bol úspešne presunutý');
    } catch (error) {
      console.error('Error updating product category:', error);
      toast.error('Nepodarilo sa presunúť produkt');
    }
  };

  const smartSuggestions = getSmartSuggestions();
  const productsByCategory = getProductsByCategory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🎨 Visual Builder</h2>
          <p className="text-muted-foreground">
            Drag & drop editor pre produkty, kategórie a riešenia
          </p>
        </div>
      </div>

      {/* Smart Suggestions */}
      {smartSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>Smart Suggestions</span>
            </CardTitle>
            <CardDescription>
              AI odporúčania na optimalizáciu vášho skladu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {smartSuggestions.map((suggestion) => (
                <Card 
                  key={suggestion.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
                  onClick={suggestion.action}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <h4 className="font-medium">{suggestion.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={`
                            ${suggestion.confidence >= 80 ? 'text-green-600 border-green-600' : ''}
                            ${suggestion.confidence >= 60 && suggestion.confidence < 80 ? 'text-yellow-600 border-yellow-600' : ''}
                            ${suggestion.confidence < 60 ? 'text-red-600 border-red-600' : ''}
                          `}>
                            {suggestion.confidence}% istota
                          </Badge>
                          <Badge variant="secondary">
                            {suggestion.type}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground ml-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Multi-Column Drag & Drop Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GripVertical className="h-5 w-5 text-primary" />
            <span>Drag & Drop Editor</span>
          </CardTitle>
          <CardDescription>
            Potiahnutím presuňte produkty medzi kategóriami
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* All Products Column */}
              <CategoryDropZone
                id="all"
                title="Všetky produkty"
                items={productsByCategory['all'] || []}
              />
              
              {/* Category Columns */}
              {categories.map((category) => (
                <CategoryDropZone
                  key={category.id}
                  id={category.id}
                  title={category.name}
                  items={productsByCategory[category.id] || []}
                  color={category.color}
                />
              ))}
            </div>
          </DndContext>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Zmeny sa ukladajú automaticky
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Obnoviť
              </Button>
              <Button onClick={() => navigate('/admin/warehouse')}>
                Späť na sklad
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};