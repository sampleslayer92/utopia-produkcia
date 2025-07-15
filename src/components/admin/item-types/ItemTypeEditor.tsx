import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateItemType, useUpdateItemType, type ItemType } from '@/hooks/useItemTypes';

interface ItemTypeEditorProps {
  itemType: ItemType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemTypeEditor = ({ itemType, isOpen, onClose }: ItemTypeEditorProps) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon_name: '',
    color: '#3B82F6',
    position: 0,
  });

  const createItemType = useCreateItemType();
  const updateItemType = useUpdateItemType();

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
  }, [itemType]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[áäâà]/g, 'a')
      .replace(/[éëêè]/g, 'e')
      .replace(/[íïîì]/g, 'i')
      .replace(/[óöôò]/g, 'o')
      .replace(/[úüûù]/g, 'u')
      .replace(/[ýÿ]/g, 'y')
      .replace(/[ň]/g, 'n')
      .replace(/[š]/g, 's')
      .replace(/[č]/g, 'c')
      .replace(/[ť]/g, 't')
      .replace(/[ž]/g, 'z')
      .replace(/[ľĺ]/g, 'l')
      .replace(/[ŕ]/g, 'r')
      .replace(/[ď]/g, 'd')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      description: formData.description || undefined,
      icon_name: formData.icon_name || undefined,
    };

    if (itemType) {
      updateItemType.mutate(
        { id: itemType.id, ...submitData },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createItemType.mutate(
        submitData,
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {itemType ? 'Upraviť typ položky' : 'Pridať typ položky'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Názov typu</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Napríklad: Zariadenie"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="zariadenie"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Popis</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Stručný popis typu..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon_name">Ikona (Lucide)</Label>
              <Input
                id="icon_name"
                value={formData.icon_name}
                onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                placeholder="Smartphone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Farba</Label>
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Zrušiť
            </Button>
            <Button 
              type="submit" 
              disabled={createItemType.isPending || updateItemType.isPending}
            >
              {itemType ? 'Uložiť' : 'Vytvoriť'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};