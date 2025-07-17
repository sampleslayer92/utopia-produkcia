import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/hooks/useCategories';
import { useItemTypes } from '@/hooks/useItemTypes';
import { useCreateWarehouseItem, type CreateWarehouseItemData } from '@/hooks/useWarehouseItems';
import { useSolutions } from '@/hooks/useSolutions';
import { useCreateSolutionItem } from '@/hooks/useSolutionItems';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Upload, Zap } from 'lucide-react';
import { toast } from 'sonner';

const itemSchema = z.object({
  name: z.string().min(1, 'Názov je povinný'),
  description: z.string().optional(),
  solution_id: z.string().optional(),
  category_id: z.string().min(1, 'Kategória je povinná'),
  item_type_id: z.string().min(1, 'Typ položky je povinný'),
  monthly_fee: z.number().min(0, 'Mesačný poplatok musí byť kladný'),
  setup_fee: z.number().min(0, 'Setup poplatok musí byť kladný'),
  company_cost: z.number().min(0, 'Náklady firmy musia byť kladné'),
  current_stock: z.number().min(0, 'Zásoby musia byť kladné').optional(),
  min_stock: z.number().min(0, 'Minimálne zásoby musia byť kladné').optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof itemSchema>;

export const AddItemForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: solutions = [] } = useSolutions(true); // Only active solutions
  const { data: categories = [] } = useCategories();
  const { data: itemTypes = [] } = useItemTypes();
  const createMutation = useCreateWarehouseItem();
  const createSolutionItemMutation = useCreateSolutionItem();

  const form = useForm<FormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      description: '',
      monthly_fee: 0,
      setup_fee: 0,
      company_cost: 0,
      current_stock: 0,
      min_stock: 0,
      image_url: '',
      is_active: true,
    },
  });

  const selectedSolutionId = form.watch('solution_id');
  const selectedCategoryId = form.watch('category_id');
  
  const selectedSolution = solutions.find(s => s.id === selectedSolutionId);
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  // Get categories filtered by selected solution (if any)
  const availableCategories = selectedSolutionId 
    ? categories.filter(category => {
        // You can add logic here to filter categories by solution
        // For now, show all categories but this can be enhanced
        return category.is_active;
      })
    : categories.filter(c => c.is_active);

  // Get item types based on selected category
  const availableItemTypes = selectedCategory 
    ? itemTypes.filter(type => 
        selectedCategory.item_type_filter === 'both' || 
        selectedCategory.item_type_filter === type.slug
      )
    : [];

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Map form data to create request
      const createData: CreateWarehouseItemData = {
        name: data.name,
        description: data.description,
        category_id: data.category_id,
        item_type_id: data.item_type_id,
        monthly_fee: data.monthly_fee,
        setup_fee: data.setup_fee,
        company_cost: data.company_cost,
        current_stock: data.current_stock,
        min_stock: data.min_stock,
        image_url: data.image_url || undefined,
      };

      const createdItem = await createMutation.mutateAsync(createData);
      
      // If solution is selected, also create solution_item record
      if (data.solution_id && createdItem) {
        await createSolutionItemMutation.mutateAsync({
          solution_id: data.solution_id,
          warehouse_item_id: createdItem.id,
          category_id: data.category_id,
          position: 0,
          is_featured: false,
        });
      }
      
      toast.success('Položka bola úspešne vytvorená!');
      navigate('/admin/warehouse');
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('Nepodarilo sa vytvoriť položku');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/warehouse')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Späť do skladu</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">➕ Pridať novú položku</h1>
          <p className="text-muted-foreground">Vytvorte novú položku pre váš sklad</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-primary" />
            <span>Údaje o položke</span>
          </CardTitle>
          <CardDescription>
            Vyplňte všetky potrebné informácie o novej skladovej položke
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center space-x-2">
                    <span>📋 Základné informácie</span>
                  </h3>
                  
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

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Upload className="h-4 w-4" />
                          <span>URL obrázka</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Zadajte URL adresu obrázka položky
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Category & Type */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">🏷️ Kategorizácia</h3>
                  
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
                            <SelectItem value="">Bez riešenia</SelectItem>
                            {solutions.map((solution) => (
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
                        <FormDescription>
                          Priradením ku riešeniu sa položka zobrazí v onboardingu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category_id"
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
                              <SelectItem key={category.id} value={category.id}>
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
                    name="item_type_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typ položky *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={!selectedCategoryId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Vyberte typ položky" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableItemTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
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
                        {!selectedCategoryId && (
                          <FormDescription>
                            Najprv vyberte kategóriu
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedSolution && (
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: selectedSolution.color }}
                        />
                        <span className="font-medium">{selectedSolution.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedSolution.description}
                      </p>
                    </div>
                  )}

                  {selectedCategory && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: selectedCategory.color }}
                        />
                        <span className="font-medium">{selectedCategory.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedCategory.description}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        Filter: {selectedCategory.item_type_filter}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center space-x-2">
                  <span>💰 Ceny a zásoby</span>
                </h3>
                
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                        <FormDescription>
                          Upozornenie pri poklesnutí pod túto úroveň
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="border-t pt-6">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center space-x-2">
                          <Zap className="h-4 w-4" />
                          <span>Aktívna položka</span>
                        </FormLabel>
                        <FormDescription>
                          Aktívne položky sú viditeľné v obchode a onboardingu
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
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/admin/warehouse')}
                >
                  Zrušiť
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? 'Vytváram...' : 'Vytvoriť položku'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};