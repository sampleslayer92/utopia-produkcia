
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Plus, Folder, Package, Edit, Trash2, MoreHorizontal, Table, Grid } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CategoryEditor } from '@/components/admin/categories/CategoryEditor';
import { CategoriesTable } from '@/components/admin/categories/CategoriesTable';
import { useCategories, type Category } from '@/hooks/useCategories';
import { useBulkCategoryActions } from '@/hooks/useBulkCategoryActions';
import { useGenericBulkSelection } from '@/hooks/useGenericBulkSelection';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const CategoriesPage = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: categories, isLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const bulkActions = useBulkCategoryActions();
  const selection = useGenericBulkSelection(categories || []);

  // Get item counts for each category
  const { data: categoryCounts } = useQuery({
    queryKey: ['category-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warehouse_items')
        .select('category_id')
        .not('category_id', 'is', null);
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data.forEach(item => {
        if (item.category_id) {
          counts[item.category_id] = (counts[item.category_id] || 0) + 1;
        }
      });
      
      return counts;
    },
  });

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleViewCategory = (category: Category) => {
    navigate(`/admin/warehouse/categories/${category.id}`);
  };

  const handleBulkDelete = async () => {
    if (selection.selectedItems.length === 0) return;
    
    try {
      await bulkActions.bulkDelete(selection.selectedItems);
      selection.clearSelection();
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  };

  const handleBulkActivate = async () => {
    if (selection.selectedItems.length === 0) return;
    
    try {
      await bulkActions.bulkActivate(selection.selectedItems);
      selection.clearSelection();
    } catch (error) {
      console.error('Bulk activate failed:', error);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selection.selectedItems.length === 0) return;
    
    try {
      await bulkActions.bulkDeactivate(selection.selectedItems);
      selection.clearSelection();
    } catch (error) {
      console.error('Bulk deactivate failed:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Kategórie" subtitle="Správa kategórií produktov">
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  const sortedCategories = categories?.sort((a, b) => a.position - b.position) || [];

  return (
    <AdminLayout 
      title="Kategórie" 
      subtitle="Správa kategórií produktov a služieb"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Kategórie skladu</h2>
            <p className="text-muted-foreground">
              Kliknite na kategóriu pre zobrazenie produktov a služieb
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex rounded-md border">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <Table className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Pridať kategóriu
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selection.selectedItems.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">
              {selection.selectedItems.length} kategórií vybratých
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkActivate}
              disabled={bulkActions.isLoading}
            >
              Aktivovať
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDeactivate}
              disabled={bulkActions.isLoading}
            >
              Deaktivovať
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkActions.isLoading}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Vymazať
            </Button>
          </div>
        )}

        {/* View Content */}
        {viewMode === 'table' ? (
          <CategoriesTable
            categories={sortedCategories}
            onEdit={handleEdit}
          />
        ) : (
          /* Categories Grid - Folder View */
          sortedCategories.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Folder className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Žiadne kategórie</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Vytvorte prvú kategóriu pre organizovanie produktov a služieb v sklade.
                </p>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať prvú kategóriu
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Select All */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selection.isAllSelected}
                  onCheckedChange={() => selection.selectAll(sortedCategories)}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Vybrať všetky kategórie
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedCategories.map((category) => {
                  const itemCount = categoryCounts?.[category.id] || 0;
                  const isSelected = selection.isItemSelected(category.id);
                  
                  return (
                    <Card 
                      key={category.id} 
                      className={`hover:shadow-lg transition-all duration-200 cursor-pointer group relative ${
                        isSelected ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleViewCategory(category)}
                    >
                      <div className="absolute top-3 left-3 z-10">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            selection.selectItem(category.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 ml-8">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${category.color}20`, border: `2px solid ${category.color}` }}
                            >
                              <Folder 
                                className="h-5 w-5" 
                                style={{ color: category.color }}
                              />
                            </div>
                            <div>
                              <CardTitle className="text-base group-hover:text-primary transition-colors">
                                {category.name}
                              </CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={category.is_active ? 'default' : 'secondary'}>
                                  {category.is_active ? 'Aktívna' : 'Neaktívna'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(category);
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Upraviť
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewCategory(category);
                                }}
                              >
                                <Package className="h-4 w-4 mr-2" />
                                Zobraziť položky
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {category.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {category.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span>{itemCount} položiek</span>
                            </div>
                            
                            <Badge variant="outline">
                              {category.item_type_filter === 'both' ? 'Všetko' :
                               category.item_type_filter === 'device' ? 'Zariadenia' : 'Služby'}
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Pozícia: {category.position}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )
        )}

        <CategoryEditor
          category={selectedCategory}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </AdminLayout>
  );
};

export default CategoriesPage;
