
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateCategory, useUpdateCategory, useDeleteCategory, type Category, type CreateCategoryData, type UpdateCategoryData } from '@/hooks/useCategories';
import { Trash2 } from 'lucide-react';
import { CategoryDeleteDialog } from './CategoryDeleteDialog';

const categorySchema = z.object({
  name: z.string().min(1, 'Názov je povinný'),
  slug: z.string().min(1, 'Slug je povinný'),
  description: z.string().optional(),
  color: z.string().min(1, 'Farba je povinná'),
  item_type_filter: z.enum(['device', 'service', 'both']),
  is_active: z.boolean(),
  position: z.number().min(0),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryEditorProps {
  category?: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryEditor: React.FC<CategoryEditorProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      color: '#3B82F6',
      item_type_filter: 'both',
      is_active: true,
      position: 0,
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        color: category.color,
        item_type_filter: category.item_type_filter,
        is_active: category.is_active,
        position: category.position,
      });
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        color: '#3B82F6',
        item_type_filter: 'both',
        is_active: true,
        position: 0,
      });
    }
  }, [category, form]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (category) {
        await updateMutation.mutateAsync({
          id: category.id,
          ...data,
        } as UpdateCategoryData);
      } else {
        await createMutation.mutateAsync(data as CreateCategoryData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async () => {
    if (category) {
      try {
        await deleteMutation.mutateAsync(category.id);
        setShowDeleteDialog(false);
        onClose();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {category ? 'Upraviť kategóriu' : 'Vytvoriť kategóriu'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Názov kategórie</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Názov kategórie"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!category) {
                            form.setValue('slug', generateSlug(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="slug-kategorie" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL-friendly identifikátor kategórie
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Popis</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Popis kategórie..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farba</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="item_type_filter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filter typov položiek</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte filter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="both">Zariadenia aj služby</SelectItem>
                        <SelectItem value="device">Iba zariadenia</SelectItem>
                        <SelectItem value="service">Iba služby</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pozícia</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Aktívna kategória</FormLabel>
                      <FormDescription>
                        Neaktívne kategórie sa nezobrazujú vo verejnom katalógu
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                {category && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Vymazať
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={onClose}>
                  Zrušiť
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {category ? 'Aktualizovať' : 'Vytvoriť'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <CategoryDeleteDialog
        category={category}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};
