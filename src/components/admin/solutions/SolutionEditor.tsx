import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useSolution, useCreateSolution, useUpdateSolution } from '@/hooks/useSolutions';
import LoadingSpinner from '@/components/ui/loading-spinner';
import SolutionProductManager from './SolutionProductManager';

const solutionSchema = z.object({
  name: z.string().min(1, 'Názov je povinný'),
  description: z.string().optional(),
  subtitle: z.string().optional(),
  icon_name: z.string().optional(),
  icon_url: z.string().url().optional().or(z.literal('')),
  color: z.string().min(1, 'Farba je povinná'),
  is_active: z.boolean(),
});

type SolutionFormData = z.infer<typeof solutionSchema>;

interface SolutionEditorProps {
  solutionId?: string;
  onClose: () => void;
}

const SolutionEditor = ({ solutionId, onClose }: SolutionEditorProps) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'products'>('basic');
  
  const { data: solution, isLoading } = useSolution(solutionId || '');
  const createSolution = useCreateSolution();
  const updateSolution = useUpdateSolution();

  const form = useForm<SolutionFormData>({
    resolver: zodResolver(solutionSchema),
    defaultValues: {
      name: '',
      description: '',
      subtitle: '',
      icon_name: 'CreditCard',
      icon_url: '',
      color: '#3B82F6',
      is_active: true,
    },
  });

  useEffect(() => {
    if (solution) {
      form.reset({
        name: solution.name,
        description: solution.description || '',
        subtitle: solution.subtitle || '',
        icon_name: solution.icon_name || 'CreditCard',
        icon_url: solution.icon_url || '',
        color: solution.color,
        is_active: solution.is_active,
      });
    }
  }, [solution, form]);

  const onSubmit = async (data: SolutionFormData) => {
    try {
      if (solutionId) {
        await updateSolution.mutateAsync({ id: solutionId, ...data });
      } else {
        // Ensure required fields are present for creation
        await createSolution.mutateAsync({
          name: data.name,
          description: data.description,
          subtitle: data.subtitle,
          icon_name: data.icon_name,
          icon_url: data.icon_url,
          color: data.color,
          is_active: data.is_active,
        });
        onClose();
      }
    } catch (error) {
      console.error('Error saving solution:', error);
    }
  };

  const isEditing = !!solutionId;
  const isPending = createSolution.isPending || updateSolution.isPending;

  if (isLoading && isEditing) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Späť
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab('basic')}
            disabled={activeTab === 'basic'}
          >
            Základné údaje
          </Button>
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => setActiveTab('products')}
              disabled={activeTab === 'products'}
            >
              Produkty
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Basic Information Tab */}
      {activeTab === 'basic' && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Základné informácie</CardTitle>
                <CardDescription>
                  Nastavte základné údaje pre riešenie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Názov riešenia *</FormLabel>
                      <FormControl>
                        <Input placeholder="napr. POS Terminály" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Podnadpis</FormLabel>
                      <FormControl>
                        <Input placeholder="napr. Bezpečné a rýchle platby kartou" {...field} />
                      </FormControl>
                      <FormDescription>
                        Krátky text zobrazený pod názvom riešenia
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
                        <Textarea 
                          placeholder="Detailný popis riešenia..."
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="icon_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ikona (Lucide)</FormLabel>
                        <FormControl>
                          <Input placeholder="napr. CreditCard" {...field} />
                        </FormControl>
                        <FormDescription>
                          Názov ikony z Lucide React
                        </FormDescription>
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
                        <FormDescription>
                          Primárna farba pre riešenie
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="icon_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL vlastnej ikony</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Voliteľne - URL na vlastnú ikonu (prepíše Lucide ikonu)
                      </FormDescription>
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
                        <FormLabel className="text-base">Aktívne riešenie</FormLabel>
                        <FormDescription>
                          Zobrazí sa v onboarding procese
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

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Zrušiť
              </Button>
              <Button type="submit" disabled={isPending}>
                <Save className="h-4 w-4 mr-2" />
                {isPending ? 'Ukladám...' : isEditing ? 'Uložiť zmeny' : 'Vytvoriť riešenie'}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && isEditing && solutionId && (
        <SolutionProductManager solutionId={solutionId} />
      )}
    </div>
  );
};

export default SolutionEditor;