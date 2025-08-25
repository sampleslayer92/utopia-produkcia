
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Category, 
  useCreateCategory, 
  useUpdateCategory,
  useDeleteCategory 
} from '@/hooks/useCategories';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ConfirmDeleteModal from '@/components/admin/contract-detail/ConfirmDeleteModal';
import { useTranslation } from 'react-i18next';

interface CategoryEditorProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryEditor = ({ category, isOpen, onClose }: CategoryEditorProps) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const { toast } = useToast();
  const { t } = useTranslation('common');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon_name: '',
    color: '#3B82F6',
    item_type_filter: 'both' as 'device' | 'service' | 'both',
    position: 0,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon_name: category.icon_name || '',
        color: category.color,
        item_type_filter: category.item_type_filter,
        position: category.position,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon_name: '',
        color: '#3B82F6',
        item_type_filter: 'both',
        position: 0,
      });
    }
  }, [category, isOpen]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (category) {
        await updateCategory.mutateAsync({ ...formData, id: category.id });
      } else {
        await createCategory.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async () => {
    if (!category) return;
    
    try {
      await deleteCategory.mutateAsync(category.id);
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Chyba',
        description: 'Kategóriu sa nepodarilo vymazať. Možno má priradenú skladové položky.',
        variant: 'destructive',
      });
    }
  };

  const isLoading = createCategory.isPending || updateCategory.isPending || deleteCategory.isPending;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {category ? 'Upraviť kategóriu' : 'Pridať kategóriu'}
              </DialogTitle>
              <DialogDescription>
                {category ? 'Upravte údaje kategórie' : 'Vytvorte novú kategóriu pre produkty'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Názov kategórie *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Názov kategórie"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="slug-kategorie"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Popis</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Popis kategórie"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon_name">Ikona</Label>
                  <Input
                    id="icon_name"
                    value={formData.icon_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                    placeholder="package"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Farba</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item_type_filter">Typ filtra</Label>
                  <Select
                    value={formData.item_type_filter}
                    onValueChange={(value: 'device' | 'service' | 'both') => 
                      setFormData(prev => ({ ...prev, item_type_filter: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Všetko</SelectItem>
                      <SelectItem value="device">Zariadenia</SelectItem>
                      <SelectItem value="service">Služby</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Pozícia</Label>
                  <Input
                    id="position"
                    type="number"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <div>
                {category && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Vymazať
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Zrušiť
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t('status.saving') : (category ? 'Uložiť' : 'Vytvoriť')}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={category?.name || ''}
        isDeleting={deleteCategory.isPending}
      />
    </>
  );
};
