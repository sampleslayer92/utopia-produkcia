import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ItemType, useCreateItemType, useUpdateItemType } from '@/hooks/useItemTypes';
import { useTranslation } from 'react-i18next';

interface ItemTypeEditorProps {
  itemType: ItemType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemTypeEditor = ({ itemType, isOpen, onClose }: ItemTypeEditorProps) => {
  const createItemType = useCreateItemType();
  const updateItemType = useUpdateItemType();
  const { t } = useTranslation('common');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon_name: '',
    color: '#3B82F6',
    position: 0,
  });

  useEffect(() => {
    if (itemType) {
      setFormData({
        name: itemType.name,
        slug: itemType.slug,
        description: itemType.description || '',
        icon_name: itemType.icon_name || '',
        color: itemType.color,
        position: itemType.position,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon_name: '',
        color: '#3B82F6',
        position: 0,
      });
    }
  }, [itemType, isOpen]);

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
      if (itemType) {
        await updateItemType.mutateAsync({ ...formData, id: itemType.id });
      } else {
        await createItemType.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving item type:', error);
    }
  };

  const isLoading = createItemType.isPending || updateItemType.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {itemType ? 'Upraviť typ položky' : 'Pridať typ položky'}
            </DialogTitle>
            <DialogDescription>
              {itemType ? 'Upravte údaje typu položky' : 'Vytvorte nový typ položky'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Názov typu *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Názov typu"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="slug-typu"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Popis</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Popis typu položky"
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Zrušiť
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('status.saving') : (itemType ? 'Uložiť' : 'Vytvoriť')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};