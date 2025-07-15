import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateCategory, useUpdateCategory, type Category } from '@/hooks/useCategories';

interface CategoryEditorProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryEditor = ({ category, isOpen, onClose }: CategoryEditorProps) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon_name: '',
    color: '#3B82F6',
    item_type_filter: 'both' as 'device' | 'service' | 'both',
    position: 0,
  });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

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
  }, [category]);

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

    if (category) {
      updateCategory.mutate(
        { id: category.id, ...submitData },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createCategory.mutate(
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
            {category ? 'Upraviť kategóriu' : 'Pridať kategóriu'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Názov kategórie</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Napríklad: Platobné terminály"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="platobne-terminaly"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Popis</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Stručný popis kategórie..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon_name">Ikona (Lucide)</Label>
              <Input
                id="icon_name"
                value={formData.icon_name}
                onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                placeholder="CreditCard"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item_type_filter">Typ produktov</Label>
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
                  <SelectItem value="device">Len zariadenia</SelectItem>
                  <SelectItem value="service">Len služby</SelectItem>
                  <SelectItem value="both">Oboje</SelectItem>
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Zrušiť
            </Button>
            <Button 
              type="submit" 
              disabled={createCategory.isPending || updateCategory.isPending}
            >
              {category ? 'Uložiť' : 'Vytvoriť'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};