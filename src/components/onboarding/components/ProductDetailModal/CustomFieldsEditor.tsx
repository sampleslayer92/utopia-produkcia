import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProductCustomFields } from '@/hooks/useCustomFieldDefinitions';
import { CustomFieldDefinition } from '@/hooks/useCustomFieldDefinitions';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';

interface CustomFieldsEditorProps {
  warehouseItemId?: string;
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}

const CustomFieldsEditor = ({ warehouseItemId, values, onChange }: CustomFieldsEditorProps) => {
  const { data: customFields, isLoading } = useProductCustomFields(warehouseItemId || '');
  const [localValues, setLocalValues] = useState<Record<string, any>>(values);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const handleChange = (fieldKey: string, value: any) => {
    const newValues = { ...localValues, [fieldKey]: value };
    setLocalValues(newValues);
    onChange(newValues);
  };

  const renderField = (field: CustomFieldDefinition) => {
    const value = localValues[field.field_key] || field.default_value || '';

    switch (field.field_type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleChange(field.field_key, e.target.value)}
            placeholder={field.help_text || ''}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleChange(field.field_key, parseFloat(e.target.value) || 0)}
            placeholder={field.help_text || ''}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleChange(field.field_key, e.target.value)}
            placeholder={field.help_text || ''}
            rows={3}
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={Boolean(value)}
              onCheckedChange={(checked) => handleChange(field.field_key, checked)}
            />
            <span className="text-sm">{field.help_text || 'Áno/Nie'}</span>
          </div>
        );

      case 'select':
        return (
          <Select
            value={value?.toString() || ''}
            onValueChange={(selectedValue) => handleChange(field.field_key, selectedValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.help_text || 'Vyberte možnosť'} />
            </SelectTrigger>
            <SelectContent>
              {field.field_options?.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox_group':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {field.field_options?.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newValues = checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter(v => v !== option.value);
                    handleChange(field.field_key, newValues);
                  }}
                />
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleChange(field.field_key, e.target.value)}
            placeholder={field.help_text || ''}
          />
        );
    }
  };

  if (!warehouseItemId) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!customFields || customFields.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Pre tento produkt nie sú definované žiadne vlastné polia.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vlastné polia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {customFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label className="flex items-center gap-2">
              {field.field_name}
              {field.is_required && <Badge variant="destructive" className="text-xs">Povinné</Badge>}
            </Label>
            {renderField(field)}
            {field.help_text && (
              <p className="text-xs text-muted-foreground">{field.help_text}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CustomFieldsEditor;