import { useState, useEffect } from 'react';
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
import { Progress } from '@/components/ui/progress';
import { useCategories } from '@/hooks/useCategories';
import { useItemTypes } from '@/hooks/useItemTypes';
import { useCreateWarehouseItem, type CreateWarehouseItemData } from '@/hooks/useWarehouseItems';
import { useSolutions } from '@/hooks/useSolutions';
import { useCreateSolutionItem } from '@/hooks/useSolutionItems';
import { useCustomFieldDefinitions } from '@/hooks/useCustomFieldDefinitions';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Package, Upload, Zap, CheckCircle, Tag, DollarSign, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { DynamicCustomFields } from './DynamicCustomFields';

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
  custom_fields: z.record(z.any()).optional(),
});

type FormData = z.infer<typeof itemSchema>;

const STEPS = [
  { id: 1, title: 'Základné informácie', icon: Package },
  { id: 2, title: 'Kategorizácia', icon: Tag },
  { id: 3, title: 'Ceny a zásoby', icon: DollarSign },
  { id: 4, title: 'Vlastné polia', icon: Settings },
  { id: 5, title: 'Dokončenie', icon: CheckCircle },
];

export const EnhancedAddItemForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: solutions = [] } = useSolutions(true);
  const { data: categories = [] } = useCategories();
  const { data: itemTypes = [] } = useItemTypes();
  const createMutation = useCreateWarehouseItem();
  const createSolutionItemMutation = useCreateSolutionItem();

  const form = useForm<FormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      description: '',
      solution_id: 'none',
      monthly_fee: 0,
      setup_fee: 0,
      company_cost: 0,
      current_stock: 0,
      min_stock: 0,
      image_url: '',
      is_active: true,
      custom_fields: {},
    },
  });

  const selectedCategoryId = form.watch('category_id');
  const selectedItemTypeId = form.watch('item_type_id');
  
  // Get custom field definitions for selected category/item type
  const { data: customFields = [] } = useCustomFieldDefinitions(
    selectedCategoryId,
    selectedItemTypeId
  );

  const selectedSolution = solutions.find(s => s.id === form.watch('solution_id'));
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  const validSolutions = solutions.filter(s => s.id && s.id.trim() !== '');
  const validCategories = categories.filter(c => c.id && c.id.trim() !== '' && c.is_active);
  const validItemTypes = itemTypes.filter(t => t.id && t.id.trim() !== '' && t.is_active);

  const availableItemTypes = selectedCategory 
    ? validItemTypes.filter(type => 
        selectedCategory.item_type_filter === 'both' || 
        selectedCategory.item_type_filter === type.slug
      )
    : [];

  const progress = (currentStep / STEPS.length) * 100;

  const validateCurrentStep = async () => {
    const formData = form.getValues();
    
    switch (currentStep) {
      case 1:
        return form.trigger(['name', 'description', 'image_url']);
      case 2:
        return form.trigger(['category_id', 'item_type_id', 'solution_id']);
      case 3:
        return form.trigger(['monthly_fee', 'setup_fee', 'company_cost', 'current_stock', 'min_stock']);
      case 4:
        // Validate custom fields if any are required
        const requiredFields = customFields.filter(f => f.is_required);
        if (requiredFields.length > 0) {
          const customFieldKeys = requiredFields.map(f => `custom_fields.${f.field_key}`);
          return form.trigger(customFieldKeys as any);
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
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
        custom_fields: data.custom_fields || {},
      };

      const createdItem = await createMutation.mutateAsync(createData);
      
      if (data.solution_id && data.solution_id !== 'none' && createdItem) {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-primary" />
                <span>Základné informácie</span>
              </CardTitle>
              <CardDescription>
                Zadajte základné údaje o novej položke
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-primary" />
                <span>Kategorizácia</span>
              </CardTitle>
              <CardDescription>
                Priraďte položku ku kategórii a typu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                        {validCategories.map((category) => (
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
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span>Ceny a zásoby</span>
              </CardTitle>
              <CardDescription>
                Nastavte cenové údaje a stav zásob
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        Upozornenie pri dosiahnutí tejto úrovne
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Aktívna položka
                      </FormLabel>
                      <FormDescription>
                        Položka bude dostupná v systéme a onboardingu
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
            </CardContent>
          </Card>
        );

      case 4:
        return customFields.length > 0 ? (
          <DynamicCustomFields 
            form={form} 
            customFields={customFields}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>Vlastné polia</span>
              </CardTitle>
              <CardDescription>
                Pre túto kategóriu nie sú definované žiadne vlastné polia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Žiadne vlastné polia pre túto kategóriu.</p>
                <p className="text-sm">Môžete pokračovať na ďalší krok.</p>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Kontrola údajov</span>
              </CardTitle>
              <CardDescription>
                Skontrolujte všetky údaje pred vytvorením položky
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Základné informácie</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Názov:</strong> {form.watch('name')}</p>
                    <p><strong>Popis:</strong> {form.watch('description') || 'Bez popisu'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Kategorizácia</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Kategória:</strong> {selectedCategory?.name}</p>
                    <p><strong>Riešenie:</strong> {selectedSolution?.name || 'Bez riešenia'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Cenové údaje</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Mesačný poplatok:</strong> {form.watch('monthly_fee')} €</p>
                    <p><strong>Setup poplatok:</strong> {form.watch('setup_fee')} €</p>
                    <p><strong>Náklady firmy:</strong> {form.watch('company_cost')} €</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Zásoby</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Aktuálne:</strong> {form.watch('current_stock')}</p>
                    <p><strong>Minimálne:</strong> {form.watch('min_stock')}</p>
                  </div>
                </div>
              </div>

              {customFields.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Vlastné polia</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customFields.map((field) => {
                      const value = form.watch(`custom_fields.${field.field_key}`);
                      return (
                        <div key={field.id} className="text-sm">
                          <strong>{field.field_name}:</strong>{' '}
                          {Array.isArray(value) ? value.join(', ') : value || 'Nezadané'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
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
          <p className="text-muted-foreground">Krokovým sprievodcom vytvorte novú položku</p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Krok {currentStep} z {STEPS.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% dokončené</span>
          </div>
          <Progress value={progress} className="mb-4" />
          
          <div className="flex items-center justify-between">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center space-y-2">
                  <div className={`p-2 rounded-full ${
                    isCompleted ? 'bg-primary text-primary-foreground' :
                    isActive ? 'bg-primary/20 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-xs text-center ${
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderStepContent()}

          {/* Navigation */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Predchádzajúci
                </Button>

                {currentStep < STEPS.length ? (
                  <Button type="button" onClick={nextStep}>
                    Ďalej
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Vytváram...' : 'Vytvoriť položku'}
                    <Zap className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};