import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useCreateWarehouseItem, useUpdateWarehouseItem, type WarehouseItem, type CreateWarehouseItemData } from '@/hooks/useWarehouseItems';
import { useTranslation } from 'react-i18next';

const warehouseItemSchema = z.object({
  name: z.string().min(1, 'Názov je povinný'),
  description: z.string().optional(),
  category: z.string().min(1, 'Kategória je povinná'),
  item_type: z.enum(['device', 'service']),
  monthly_fee: z.number().min(0, 'Mesačný poplatok musí byť nezáporný'),
  setup_fee: z.number().min(0, 'Poplatok za nastavenie musí byť nezáporný'),
  company_cost: z.number().min(0, 'Náklady spoločnosti musia byť nezáporné'),
  image_url: z.string().url().optional().or(z.literal('')),
  min_stock: z.number().min(0).optional(),
  current_stock: z.number().min(0).optional(),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof warehouseItemSchema>;

interface WarehouseItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: WarehouseItem;
}

const CATEGORIES = {
  device: [
    { value: 'pos_terminals', label: 'POS Terminály' },
    { value: 'tablets', label: 'Tablety' },
    { value: 'accessories', label: 'Príslušenstvo' },
    { value: 'other', label: 'Ostatné' },
  ],
  service: [
    { value: 'software', label: 'Software' },
    { value: 'processing', label: 'Spracovanie platieb' },
    { value: 'support', label: 'Technická podpora' },
    { value: 'analytics', label: 'Analytika' },
    { value: 'other', label: 'Ostatné' },
  ],
};

export const WarehouseItemModal = ({ open, onOpenChange, item }: WarehouseItemModalProps) => {
  const { t } = useTranslation('admin');
  const createMutation = useCreateWarehouseItem();
  const updateMutation = useUpdateWarehouseItem();

  const form = useForm<FormData>({
    resolver: zodResolver(warehouseItemSchema),
    defaultValues: {
      name: item?.name || '',
      description: item?.description || '',
      category: item?.category || '',
      item_type: item?.item_type || 'device',
      monthly_fee: item?.monthly_fee || 0,
      setup_fee: item?.setup_fee || 0,
      company_cost: item?.company_cost || 0,
      image_url: item?.image_url || '',
      min_stock: item?.min_stock || 0,
      current_stock: item?.current_stock || 0,
      is_active: item?.is_active ?? true,
    },
  });

  const watchedType = form.watch('item_type');
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: FormData) => {
    try {
      if (item) {
        await updateMutation.mutateAsync({ id: item.id, ...data });
      } else {
        await createMutation.mutateAsync(data as CreateWarehouseItemData);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving warehouse item:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Upraviť položku' : 'Pridať novú položku'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Názov *</FormLabel>
                    <FormControl>
                      <Input placeholder="Názov položky" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="item_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte typ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="device">Zariadenie</SelectItem>
                        <SelectItem value="service">Služba</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      {CATEGORIES[watchedType].map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
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
                    <Textarea placeholder="Popis položky" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
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
                    <FormLabel>Poplatok za nastavenie (€)</FormLabel>
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
                    <FormLabel>Náklady spoločnosti (€)</FormLabel>
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

            {watchedType === 'device' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="min_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimálny sklad</FormLabel>
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
                      <FormLabel>Aktuálny sklad</FormLabel>
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
                    <Input placeholder="https://..." {...field} />
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
                    <FormLabel className="text-base">Aktívne</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Položka je dostupná pre výber v kontraktoch
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