import React from 'react';
import { OnboardingFieldConfig } from '@/hooks/useOnboardingConfiguration';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DynamicFieldRendererProps {
  field: OnboardingFieldConfig;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  const { field_type, field_label, field_key, is_required, field_options } = field;

  const renderField = () => {
    switch (field_type) {
      case 'text':
        return (
          <Input
            id={field_key}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field_options?.placeholder}
            required={is_required}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'email':
        return (
          <Input
            id={field_key}
            type="email"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field_options?.placeholder}
            required={is_required}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'phone':
        return (
          <Input
            id={field_key}
            type="tel"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field_options?.placeholder}
            required={is_required}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={field_key}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field_options?.placeholder}
            required={is_required}
            className={error ? 'border-destructive' : ''}
            rows={field_options?.rows || 4}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange} required={is_required}>
            <SelectTrigger className={error ? 'border-destructive' : ''}>
              <SelectValue placeholder={field_options?.placeholder || `Vyberte ${field_label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field_options?.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field_key}
              checked={Boolean(value)}
              onCheckedChange={onChange}
              required={is_required}
            />
            <Label 
              htmlFor={field_key} 
              className="text-sm font-normal cursor-pointer"
              dangerouslySetInnerHTML={{ __html: field_options?.checkboxLabel || field_label }}
            />
          </div>
        );

      case 'radio':
        return (
          <RadioGroup value={value || ''} onValueChange={onChange} required={is_required}>
            {field_options?.options?.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field_key}-${option.value}`} />
                <Label htmlFor={`${field_key}-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'number':
        return (
          <Input
            id={field_key}
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field_options?.placeholder}
            required={is_required}
            className={error ? 'border-destructive' : ''}
            min={field_options?.min}
            max={field_options?.max}
            step={field_options?.step}
          />
        );

      case 'date':
        return (
          <Input
            id={field_key}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={is_required}
            className={error ? 'border-destructive' : ''}
            min={field_options?.min}
            max={field_options?.max}
          />
        );

      default:
        console.warn(`Unknown field type: ${field_type}`);
        return (
          <Input
            id={field_key}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field_options?.placeholder}
            required={is_required}
            className={error ? 'border-destructive' : ''}
          />
        );
    }
  };

  // For checkbox type, don't render a separate label since it's included in the checkbox
  if (field_type === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderField()}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field_key} className={is_required ? "required" : ""}>
        {field_label}
        {is_required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};