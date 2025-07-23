
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCategories, type Category } from '@/hooks/useCategories';
import { useBulkCategoryActions } from '@/hooks/useBulkCategoryActions';
import { Trash2, Eye, EyeOff } from 'lucide-react';

export const BulkCategoryActions: React.FC = () => {
  const { data: categories = [] } = useCategories();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const bulkActions = useBulkCategoryActions();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map(cat => cat.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkActions.bulkDelete(selectedCategories);
      setSelectedCategories([]);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting categories:', error);
    }
  };

  const handleBulkActivate = async () => {
    try {
      await bulkActions.bulkActivate(selectedCategories);
      setSelectedCategories([]);
    } catch (error) {
      console.error('Error activating categories:', error);
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      await bulkActions.bulkDeactivate(selectedCategories);
      setSelectedCategories([]);
    } catch (error) {
      console.error('Error deactivating categories:', error);
    }
  };

  const selectedCategoriesData = categories.filter(cat => 
    selectedCategories.includes(cat.id)
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Hromadné operácie s kategóriami</CardTitle>
          <CardDescription>
            Vyberte kategórie a vykonajte hromadné operácie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Select All */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedCategories.length === categories.length}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Vybrať všetky kategórie ({categories.length})
            </label>
          </div>

          {/* Category List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2 p-2 rounded border">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleSelectCategory(category.id, checked as boolean)}
                />
                <div className="flex-1 flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium">{category.name}</span>
                  <Badge variant={category.is_active ? 'default' : 'secondary'}>
                    {category.is_active ? 'Aktívna' : 'Neaktívna'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkActivate}
                disabled={bulkActions.isLoading}
              >
                <Eye className="h-4 w-4 mr-2" />
                Aktivovať ({selectedCategories.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDeactivate}
                disabled={bulkActions.isLoading}
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Deaktivovať ({selectedCategories.length})
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                disabled={bulkActions.isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vymazať ({selectedCategories.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potvrdiť hromadné vymazanie</AlertDialogTitle>
            <AlertDialogDescription>
              Naozaj chcete vymazať {selectedCategories.length} kategórií? Táto akcia sa nedá vrátiť späť.
              <br />
              <br />
              <strong>Kategórie na vymazanie:</strong>
              <ul className="mt-2 space-y-1">
                {selectedCategoriesData.map(category => (
                  <li key={category.id} className="text-sm">
                    • {category.name}
                  </li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Vymazať kategórie
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
