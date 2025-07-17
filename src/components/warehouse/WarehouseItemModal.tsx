
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useCategories } from '@/hooks/useCategories';
import { useItemTypes } from '@/hooks/useItemTypes';
import { useCreateWarehouseItem, useUpdateWarehouseItem, type CreateWarehouseItemData, type WarehouseItem } from '@/hooks/useWarehouseItems';
import { useSolutions } from '@/hooks/useSolutions';
import { useCreateSolutionItem, useSolutionItems } from '@/hooks/useSolutionItems';
import ProductAddonManager from './ProductAddonManager';

const warehouseItemSchema = z.object({
  name: z.string().min(1, 'Názov je povinný'),
  description: z.string().optional(),
  solution_id: z.string().optional(),
  category: z.string().min(1, 'Kategória je povinná'),
  item_type: z.string().min(1, 'Typ položky je povinný'),
  monthly_fee: z.number().min(0, 'Mesačný poplatok musí byť kladný'),
  setup_fee: z.number().min(0, 'Setup poplatok musí byť kladný'),
  company_cost: z.number().min(0, 'Náklady firmy musia byť kladné'),
  current_stock: z.number().min(0, 'Zásoby musia byť kladné').optional(),
  min_stock: z.number().min(0, 'Minimálne zásoby musia byť kladné').optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof warehouseItemSchema>;

interface WarehouseItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: WarehouseItem;
}

export const WarehouseItemModal = ({ open, onOpenChange, item }: WarehouseItemModalProps) => {
  const { data: solutions = [] } = useSolutions(true);
  const { data: categories = [] } = useCategories();
  const { data: itemTypes = [] } = useItemTypes();
  const { data: existingSolutionItems = [] } = useSolutionItems();
  const createMutation = useCreateWarehouseItem();
  const updateMutation = useUpdateWarehouseItem();
  const createSolutionItemMutation = useCreateSolutionItem();

  // Filter out any items with empty or invalid IDs
  const validSolutions = solutions.filter(s => s.id && s.id.trim() !== '');
  const validCategories = categories.filter(c => c.slug && c.slug.trim() !== '' && c.is_active);
  const validItemTypes = itemTypes.filter(t => t.slug && t.slug.trim() !== '' && t.is_active);

  // Find existing solution assignment for this item
  const existingSolutionItem = item ? existingSolutionItems.find(si => si.warehouse_item_id === item.id) : null;

  const form = useForm<FormData>({
    resolver: zodResolver(warehouseItemSchema),
    defaultValues: {
      name: item?.name || '',
      description: item?.description || '',
      solution_id: existingSolutionItem?.solution_id || 'none',
      category: item?.category || '',
      item_type: item?.item_type || '',
      monthly_fee: item?.monthly_fee || 0,
      setup_fee: item?.setup_fee || 0,
      company_cost: item?.company_cost || 0,
      current_stock: item?.current_stock || 0,
      min_stock: item?.min_stock || 0,
      image_url: item?.image_url || '',
      is_active: item?.is_active ?? true,
    },
  });

  const selectedCategorySlug = form.watch('category');
  const selectedItemTypeSlug = form.watch('item_type');
  const selectedSolutionId = form.watch('solution_id');
  const selectedCategory = validCategories.find(c => c.slug === selectedCategorySlug);
  const selectedItemType = validItemTypes.find(t => t.slug === selectedItemTypeSlug);

  // Get item types filtered by selected category
  const availableItemTypes = selectedCategory 
    ? validItemTypes.filter(type => 
        selectedCategory.item_type_filter === 'both' || 
        selectedCategory.item_type_filter === type.slug
      )
    : validItemTypes;

  // Get categories filtered by selected solution
  const availableCategories = selectedSolutionId && selectedSolutionId !== 'none'
    ? validCategories.filter(cat => {
        // For now, show all categories when a solution is selected
        // This can be enhanced later with solution-category relationships
        return cat.is_active;
      })
    : validCategories;

  const onSubmit = async (data: FormData) => {
    try {
      // Find category and item type IDs
      const categoryData = validCategories.find(c => c.slug === data.category);
      const itemTypeData = validItemTypes.find(t => t.slug === data.item_type);

      const warehouseData: CreateWarehouseItemData = {
        name: data.name,
        description: data.description,
        category: data.category,
        category_id: categoryData?.id,
        item_type: data.item_type,
        item_type_id: itemTypeData?.id,
        monthly_fee: data.monthly_fee,
        setup_fee: data.setup_fee,
        company_cost: data.company_cost,
        current_stock: data.current_stock,
        min_stock: data.min_stock,
        image_url: data.image_url || undefined,
        is_active: data.is_active,
      };

      if (item) {
        await updateMutation.mutateAsync({ id: item.id, ...warehouseData });
        
        // Handle solution assignment for updates
        if (data.solution_id && data.solution_id !== 'none' && categoryData) {
          // Check if solution item exists, if not create it
          if (!existingSolutionItem) {
            await createSolutionItemMutation.mutateAsync({
              solution_id: data.solution_id,
              warehouse_item_id: item.id,
              category_id: categoryData.id,
              position: 0,
              is_featured: false,
            });
          }
        }
      } else {
        const createdItem = await createMutation.mutateAsync(warehouseData);
        
        // Handle solution assignment for new items
        if (data.solution_id && data.solution_id !== 'none' && createdItem && categoryData) {
          await createSolutionItemMutation.mutateAsync({
            solution_id: data.solution_id,
            warehouse_item_id: createdItem.id,
            category_id: categoryData.id,
            position: 0,
            is_featured: false,
          });
        }
      }

      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving warehouse item:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Upraviť položku' : 'Pridať novú položku'}
          </DialogTitle>
          <DialogDescription>
            {item 
              ? 'Upravte údaje skladovej položky a priradenie ku riešeniu' 
              : 'Vytvorte novú položku a priradenie ku riešeniu pre váš sklad'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Názov položky *</FormLabel>
                      <FormControl>
                        <Input placeholder="Napríklad: PAX A920 PRO" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="solution_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Riešenie (voliteľné)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte riešenie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Bez riešenia</SelectItem>
                        {validSolutions.map((solution) => (
                          <SelectItem key={solution.id} value={solution.id}>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: solution.color }}
                              />
                              <span>{solution.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        <Textarea 
                          placeholder="Stručný popis položky a jej funkcií..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column - Product Addons */}
              {item && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Doplnky produktu</h3>
                  <ProductAddonManager parentProductId={item.id} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategória *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte kategóriu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: category.color }}
                              />
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="item_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ položky *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!selectedCategorySlug}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte typ položky" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableItemTypes.map((type) => (
                          <SelectItem key={type.id} value={type.slug}>
                            <div>
                              <div className="font-medium">{type.name}</div>
                              {type.description && (
                                <div className="text-sm text-muted-foreground">{type.description}</div>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="monthly_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mesačný poplatok (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="setup_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setup poplatok (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Náklady firmy (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedItemType?.slug === 'device' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="min_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimálne zásoby</FormLabel>
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
                  name="current_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aktuálne zásoby</FormLabel>
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
              </div>
            )}

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL obrázka</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg"
                      {...field}
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
                    <FormLabel className="text-base">Aktívna položka</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Aktívne položky sú viditeľné v obchode a onboardingu
                    </div>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Zrušiť
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Ukladám...' : (item ? 'Uložiť' : 'Vytvoriť')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
