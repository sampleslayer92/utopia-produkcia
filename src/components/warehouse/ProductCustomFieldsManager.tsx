import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Copy, Edit } from 'lucide-react';
import { 
  CustomFieldDefinition, 
  useCreateCustomFieldDefinition, 
  useDeleteCustomFieldDefinition,
  useUpdateCustomFieldDefinition,
  useCopyTemplateFields,
  useTemplateCustomFields 
} from '@/hooks/useCustomFieldDefinitions';

interface ProductCustomFieldsManagerProps {
  warehouseItemId?: string;
  customFields: CustomFieldDefinition[];
  categoryId?: string;
  itemTypeId?: string;
  onFieldsChange?: () => void;
}

export const ProductCustomFieldsManager: React.FC<ProductCustomFieldsManagerProps> = ({
  warehouseItemId,
  customFields,
  categoryId,
  itemTypeId,
  onFieldsChange
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomFieldDefinition | null>(null);
  const [newField, setNewField] = useState<{
    field_name: string;
    field_key: string;
    field_type: 'text' | 'number' | 'boolean' | 'select' | 'checkbox' | 'textarea' | 'checkbox_group';
    is_required: boolean;
    help_text: string;
    default_value: string;
    display_order: number;
  }>({
    field_name: '',
    field_key: '',
    field_type: 'text',
    is_required: false,
    help_text: '',
    default_value: '',
    display_order: customFields.length
  });

  const createFieldMutation = useCreateCustomFieldDefinition();
  const updateFieldMutation = useUpdateCustomFieldDefinition();
  const deleteFieldMutation = useDeleteCustomFieldDefinition();
  const copyTemplateFieldsMutation = useCopyTemplateFields();
  const { data: templateFields } = useTemplateCustomFields(categoryId, itemTypeId);

  const handleSaveField = async () => {
    if (!warehouseItemId) return;

    const fieldData = {
      ...newField,
      warehouse_item_id: warehouseItemId,
      is_template: false,
      is_active: true
    };

    if (editingField) {
      await updateFieldMutation.mutateAsync({ ...editingField, ...fieldData });
    } else {
      await createFieldMutation.mutateAsync(fieldData);
    }

    setIsDialogOpen(false);
    setEditingField(null);
    setNewField({
      field_name: '',
      field_key: '',
      field_type: 'text',
      is_required: false,
      help_text: '',
      default_value: '',
      display_order: customFields.length
    });
    onFieldsChange?.();
  };

  const handleDeleteField = async (fieldId: string) => {
    await deleteFieldMutation.mutateAsync(fieldId);
    onFieldsChange?.();
  };

  const handleCopyTemplateFields = async () => {
    if (!warehouseItemId || !categoryId) return;
    
    await copyTemplateFieldsMutation.mutateAsync({
      warehouseItemId,
      categoryId,
      itemTypeId
    });
    onFieldsChange?.();
  };

  const handleEditField = (field: CustomFieldDefinition) => {
    setEditingField(field);
    setNewField({
      field_name: field.field_name,
      field_key: field.field_key,
      field_type: field.field_type,
      is_required: field.is_required,
      help_text: field.help_text || '',
      default_value: field.default_value || '',
      display_order: field.display_order
    });
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>⚙️ Vlastné polia produktu</span>
          <div className="flex gap-2">
            {templateFields && templateFields.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyTemplateFields}
                disabled={copyTemplateFieldsMutation.isPending}
              >
                <Copy className="h-4 w-4 mr-2" />
                Kopírovať z kategórie
              </Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať pole
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingField ? 'Upraviť pole' : 'Pridať nové pole'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="field_name">Názov poľa</Label>
                    <Input
                      id="field_name"
                      value={newField.field_name}
                      onChange={(e) => setNewField({ ...newField, field_name: e.target.value })}
                      placeholder="Napríklad: Konektivita"
                    />
                  </div>
                  <div>
                    <Label htmlFor="field_key">Kľúč poľa</Label>
                    <Input
                      id="field_key"
                      value={newField.field_key}
                      onChange={(e) => setNewField({ ...newField, field_key: e.target.value })}
                      placeholder="connectivity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="field_type">Typ poľa</Label>
                    <Select 
                      value={newField.field_type} 
                      onValueChange={(value: any) => setNewField({ ...newField, field_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Číslo</SelectItem>
                        <SelectItem value="textarea">Dlhý text</SelectItem>
                        <SelectItem value="boolean">Áno/Nie</SelectItem>
                        <SelectItem value="select">Výber zo zoznamu</SelectItem>
                        <SelectItem value="checkbox_group">Viacnásobný výber</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_required"
                      checked={newField.is_required}
                      onCheckedChange={(checked) => setNewField({ ...newField, is_required: checked })}
                    />
                    <Label htmlFor="is_required">Povinné pole</Label>
                  </div>
                  <div>
                    <Label htmlFor="help_text">Pomocný text</Label>
                    <Textarea
                      id="help_text"
                      value={newField.help_text}
                      onChange={(e) => setNewField({ ...newField, help_text: e.target.value })}
                      placeholder="Krátky popis pre používateľa"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveField}
                    disabled={!newField.field_name || !newField.field_key || createFieldMutation.isPending || updateFieldMutation.isPending}
                    className="w-full"
                  >
                    {editingField ? 'Upraviť' : 'Pridať'} pole
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {customFields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Žiadne vlastné polia nie sú definované</p>
            <p className="text-sm mt-2">
              Pridajte vlastné polia alebo skopírujte z kategórie
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {customFields.map((field) => (
              <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{field.field_name}</span>
                    <Badge variant="outline">{field.field_type}</Badge>
                    {field.is_required && (
                      <Badge variant="destructive" className="text-xs">Povinné</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kľúč: {field.field_key}
                  </p>
                  {field.help_text && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {field.help_text}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditField(field)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteField(field.id)}
                    disabled={deleteFieldMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};