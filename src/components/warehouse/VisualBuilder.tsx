import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, Lightbulb, ArrowRight, Sparkles, Target, Zap, Plus, Edit, Trash2, Eye, Layers, FolderOpen, GripVertical } from 'lucide-react';
import { useWarehouseItems, useUpdateWarehouseItem } from '@/hooks/useWarehouseItems';
import { useCategories } from '@/hooks/useCategories';
import { useSolutions } from '@/hooks/useSolutions';
import { useSolutionCategories, useCreateSolutionCategory, useDeleteSolutionCategory } from '@/hooks/useSolutionCategories';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: products = [], isLoading: isLoadingProducts } = useWarehouseItems();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: solutions = [], isLoading: isLoadingSolutions } = useSolutions();
  const { data: solutionCategories = [] } = useSolutionCategories(selectedSolution || undefined);
  const updateProduct = useUpdateWarehouseItem();
  const createSolutionCategory = useCreateSolutionCategory();
  const deleteSolutionCategory = useDeleteSolutionCategory();
  
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
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

  const getProductsByCategory = () => {
    const categorizedProducts = new Map<string, any[]>();
    
    // Add "All Products" category
    categorizedProducts.set('all-products', products);
    
    // Group products by category
    categories.forEach(category => {
      const categoryProducts = products.filter(p => p.category_id === category.id);
      categorizedProducts.set(category.id, categoryProducts);
    });
    
    return categorizedProducts;
  };

  const getCategoriesForSolution = () => {
    if (!selectedSolution) return [];
    return solutionCategories.map(sc => sc.category).filter(Boolean);
  };

  const getProductsForCategory = (categoryId: string) => {
    return products.filter(p => p.category_id === categoryId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    
    // Find the dragged item
    const productItem = products.find(p => p.id === event.active.id);
    const categoryItem = categories.find(c => c.id === event.active.id);
    
    if (productItem) {
      setDraggedItem(productItem);
    } else if (categoryItem) {
      setDraggedItem(categoryItem);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !active) {
      setActiveId(null);
      setDraggedItem(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Handle product being dropped into a category
    if (activeId.startsWith('product-') && overId.startsWith('category-')) {
      const productId = activeId.replace('product-', '');
      const categoryId = overId.replace('category-', '');
      
      const product = products.find(p => p.id === productId);
      const category = categories.find(c => c.id === categoryId);
      
      if (product && category) {
        try {
          await updateProduct.mutateAsync({
            id: productId,
            category_id: categoryId,
          });
          
          toast({
            title: 'Success',
            description: `Product "${product.name}" moved to category "${category.name}"`,
          });
        } catch (error) {
          console.error('Error updating product category:', error);
          toast({
            title: 'Error',
            description: 'Failed to update product category',
            variant: 'destructive',
          });
        }
      }
    }
    
    // Handle product being dropped into "All Products" (remove category)
    if (activeId.startsWith('product-') && overId === 'all-products') {
      const productId = activeId.replace('product-', '');
      const product = products.find(p => p.id === productId);
      
      if (product) {
        try {
          await updateProduct.mutateAsync({
            id: productId,
            category_id: null,
          });
          
          toast({
            title: 'Success',
            description: `Product "${product.name}" removed from category`,
          });
        } catch (error) {
          console.error('Error removing product from category:', error);
          toast({
            title: 'Error',
            description: 'Failed to remove product from category',
            variant: 'destructive',
          });
        }
      }
    }

    // Handle category being dropped into a solution
    if (activeId.startsWith('category-') && overId.startsWith('solution-')) {
      const categoryId = activeId.replace('category-', '');
      const solutionId = overId.replace('solution-', '');
      
      const category = categories.find(c => c.id === categoryId);
      const solution = solutions.find(s => s.id === solutionId);
      
      if (category && solution) {
        try {
          await createSolutionCategory.mutateAsync({
            solution_id: solutionId,
            category_id: categoryId,
          });
          
          toast({
            title: 'Success',
            description: `Category "${category.name}" added to solution "${solution.name}"`,
          });
        } catch (error) {
          console.error('Error adding category to solution:', error);
          toast({
            title: 'Error',
            description: 'Failed to add category to solution',
            variant: 'destructive',
          });
        }
      }
    }

    setActiveId(null);
    setDraggedItem(null);
  };

  const smartSuggestions = getSmartSuggestions();
  const productsByCategory = getProductsByCategory();
  const solutionCategoriesData = getCategoriesForSolution();

  return (
    <div className="p-6 bg-gradient-to-br from-background to-muted/30 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Visual Builder
          </h1>
          <p className="text-muted-foreground text-lg">
            Hierarchical warehouse management: Solutions → Categories → Products
          </p>
        </div>

        {/* Smart Suggestions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Smart Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {smartSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={suggestion.action}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{suggestion.type}</Badge>
                      <Badge variant="outline">{suggestion.confidence}%</Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{suggestion.title}</h3>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* 3-Level Hierarchy Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Level 1: Solutions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Solutions
                </h2>
                <Button
                  size="sm"
                  onClick={() => navigate('/admin/warehouse/solutions')}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Solution
                </Button>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {solutions.map((solution) => (
                    <Card
                      key={solution.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedSolution === solution.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedSolution(solution.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <Lightbulb className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{solution.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {solution.subtitle}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Level 2: Categories for Selected Solution */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Categories
                  {selectedSolution && (
                    <Badge variant="outline" className="ml-2">
                      {solutions.find(s => s.id === selectedSolution)?.name}
                    </Badge>
                  )}
                </h2>
                <Button
                  size="sm"
                  onClick={() => navigate('/admin/warehouse/categories')}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {selectedSolution ? (
                    solutionCategoriesData.map((category) => (
                      <Card
                        key={category.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${category.color}20` }}
                              >
                                <Layers className="h-4 w-4" style={{ color: category.color }} />
                              </div>
                              <div>
                                <h3 className="font-medium">{category.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {getProductsForCategory(category.id).length} products
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const solutionCategory = solutionCategories.find(
                                    sc => sc.category?.id === category.id
                                  );
                                  if (solutionCategory) {
                                    deleteSolutionCategory.mutate(solutionCategory.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Select a solution to view its categories
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Level 3: Products for Selected Category */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products
                  {selectedCategory && (
                    <Badge variant="outline" className="ml-2">
                      {categories.find(c => c.id === selectedCategory)?.name}
                    </Badge>
                  )}
                </h2>
                <Button
                  size="sm"
                  onClick={() => navigate('/admin/warehouse/products')}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {selectedCategory ? (
                    getProductsForCategory(selectedCategory).map((product) => (
                      <Card key={product.id} className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                                <Package className="h-4 w-4 text-secondary" />
                              </div>
                              <div>
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  €{product.monthly_fee}/month
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/admin/warehouse/items/${product.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Select a category to view its products
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Drag & Drop Areas */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Drag & Drop Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* All Products */}
              <CategoryDropZone
                id="all-products"
                title="All Products"
                items={productsByCategory.get('all-products') || []}
                color="bg-gradient-to-br from-blue-50 to-blue-100"
                isActive={activeId === 'all-products'}
              />

              {/* Solutions Drop Zone */}
              <div className="space-y-2">
                <h4 className="font-medium">Solutions</h4>
                {solutions.map((solution) => (
                  <CategoryDropZone
                    key={`solution-${solution.id}`}
                    id={`solution-${solution.id}`}
                    title={solution.name}
                    items={solutionCategories.filter(sc => sc.solution_id === solution.id).map(sc => sc.category).filter(Boolean)}
                    color="bg-gradient-to-br from-purple-50 to-purple-100"
                    isActive={activeId === `solution-${solution.id}`}
                  />
                ))}
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="font-medium">Categories</h4>
                {categories.map((category) => (
                  <CategoryDropZone
                    key={`category-${category.id}`}
                    id={`category-${category.id}`}
                    title={category.name}
                    items={productsByCategory.get(category.id) || []}
                    color={`bg-gradient-to-br from-green-50 to-green-100`}
                    isActive={activeId === `category-${category.id}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <DragOverlay>
            {draggedItem && (
              <div className="bg-card border rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">{draggedItem.name}</span>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};