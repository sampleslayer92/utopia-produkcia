
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCreateWarehouseItem } from '@/hooks/useWarehouseItems';
import { useCategories } from '@/hooks/useCategories';
import { useItemTypes } from '@/hooks/useItemTypes';
import { useCustomFieldDefinitions } from '@/hooks/useCustomFieldDefinitions';
import { DynamicCustomFields } from './DynamicCustomFields';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const warehouseItemSchema = z.object({
  name: z.string().min(1, 'Názov je povinný'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Kategória je povinná'),
  item_type_id: z.string().min(1, 'Typ položky je povinný'),
  item_type: z.enum(['device', 'service']),
  monthly_fee: z.number().min(0, 'Mesačný poplatok musí byť nezáporný'),
  setup_fee: z.number().min(0, 'Inštalačný poplatok musí byť nezáporný'),
  company_cost: z.number().min(0, 'Náklady firmy musia byť nezáporné'),
  current_stock: z.number().optional(),
  min_stock: z.number().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  custom_fields: z.record(z.any()).optional(),
});

type WarehouseItemFormData = z.infer<typeof warehouseItemSchema>;

export const EnhancedAddItemForm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedItemTypeId, setSelectedItemTypeId] = useState<string>('');
  
  const { data: categories } = useCategories(true);
  const { data: itemTypes } = useItemTypes(true);
  const { data: customFields } = useCustomFieldDefinitions(selectedCategoryId, selectedItemTypeId);
  
  const createMutation = useCreateWarehouseItem();

  const form = useForm<WarehouseItemFormData>({
    resolver: zodResolver(warehouseItemSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: '',
      item_type_id: '',
      item_type: 'device',
      monthly_fee: 0,
      setup_fee: 0,
      company_cost: 0,
      current_stock: 0,
      min_stock: 0,
      image_url: '',
      custom_fields: {},
    },
  });

  // Watch for category and item type changes
  const watchedCategoryId = form.watch('category_id');
  const watchedItemTypeId = form.watch('item_type_id');

  useEffect(() => {
    setSelectedCategoryId(watchedCategoryId);
  }, [watchedCategoryId]);

  useEffect(() => {
    setSelectedItemTypeId(watchedItemTypeId);
  }, [watchedItemTypeId]);

  // Update item_type when item_type_id changes
  useEffect(() => {
    if (watchedItemTypeId && itemTypes) {
      const selectedItemType = itemTypes.find(it => it.id === watchedItemTypeId);
      if (selectedItemType) {
        form.setValue('item_type', selectedItemType.slug as 'device' | 'service');
      }
    }
  }, [watchedItemTypeId, itemTypes, form]);

  const onSubmit = async (data: WarehouseItemFormData) => {
    try {
      console.log('Submitting form data:', data);
      
      // Ensure custom_fields is properly formatted
      const customFieldsData = data.custom_fields || {};
      
      const submissionData = {
        ...data,
        custom_fields: customFieldsData,
        current_stock: data.current_stock || null,
        min_stock: data.min_stock || null,
      };

      await createMutation.mutateAsync(submissionData);
      navigate('/admin/warehouse');
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const selectedCategory = categories?.find(c => c.id === selectedCategoryId);
  const selectedItemType = itemTypes?.find(it => it.id === selectedItemTypeId);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/warehouse')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Späť do skladu
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Pridať novú položku</h1>
            <p className="text-muted-foreground">
              Vytvorte novú položku v sklade s vlastnými poliami
            </p>
          </div>
        </div>
        <Badge variant="secondary">
          <Package className="h-4 w-4 mr-2" />
          Nová položka
        </Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📝 Základné informácie</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Názov položky *</FormLabel>
                      <FormControl>
                        <Input placeholder="Názov produktu alebo služby" {...field} />
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
                      <FormLabel>URL obrázka</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Popis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailný popis produktu alebo služby..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Category and Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🗂️ Kategorizácia</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategória *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Vyberte kategóriu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Vyberte typ položky" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {itemTypes?.map((itemType) => (
                            <SelectItem key={itemType.id} value={itemType.id}>
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: itemType.color }}
                                />
                                <span>{itemType.name}</span>
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

              {/* Selection Preview */}
              {(selectedCategory || selectedItemType) && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Výber:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <Badge variant="outline">
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: selectedCategory.color }}
                        />
                        {selectedCategory.name}
                      </Badge>
                    )}
                    {selectedItemType && (
                      <Badge variant="outline">
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: selectedItemType.color }}
                        />
                        {selectedItemType.name}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>💰 Ceny a náklady</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                          placeholder="0.00"
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
                      <FormLabel>Inštalačný poplatok (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
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
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stock Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📦 Správa zásob</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="current_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aktuálny stav</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Aktuálny počet kusov na sklade
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="min_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimálny stav</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimálny počet kusov pred upozornením
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Custom Fields */}
          {customFields && customFields.length > 0 && (
            <DynamicCustomFields form={form} customFields={customFields} />
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/warehouse')}>
              Zrušiť
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {createMutation.isPending ? 'Ukladám...' : 'Uložiť položku'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
