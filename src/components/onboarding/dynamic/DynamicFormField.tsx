import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OnboardingField } from '@/pages/OnboardingConfigPage';

interface DynamicFormFieldProps {
  field: OnboardingField;
  value: any;
  onChange: (value: any) => void;
}

const DynamicFormField = ({ field, value, onChange }: DynamicFormFieldProps) => {
  const { fieldKey, fieldLabel, fieldType, isRequired, fieldOptions } = field;

  const renderField = () => {
    switch (fieldType) {
      case 'text':
      case 'email':
      case 'tel':
      case 'phone':
        return (
          <Input
            type={fieldType === 'email' ? 'email' : fieldType === 'tel' || fieldType === 'phone' ? 'tel' : 'text'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={fieldOptions?.placeholder}
            required={isRequired}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={fieldOptions?.placeholder}
            required={isRequired}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={fieldOptions?.placeholder}
            required={isRequired}
            rows={3}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={Boolean(value)}
              onCheckedChange={(checked) => onChange(checked)}
            />
            <Label className="text-sm font-normal">{fieldLabel}</Label>
          </div>
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={fieldOptions?.placeholder || `Vyberte ${fieldLabel.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {fieldOptions?.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        // For multiselect, we'll use checkboxes for now
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {fieldOptions?.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selectedValues, option.value]);
                    } else {
                      onChange(selectedValues.filter((v: string) => v !== option.value));
                    }
                  }}
                />
                <Label className="text-sm font-normal">{option.label}</Label>
              </div>
            ))}
          </div>
        );

      case 'radio':
        return (
          <RadioGroup value={value || ''} onValueChange={onChange}>
            {fieldOptions?.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} />
                <Label className="text-sm font-normal">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={isRequired}
          />
        );

      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={fieldOptions?.placeholder}
            required={isRequired}
          />
        );
    }
  };

  // For checkbox, we don't render a separate label since it's included in the component
  if (fieldType === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderField()}
        {fieldOptions?.helpText && (
          <p className="text-sm text-muted-foreground">{fieldOptions.helpText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldKey} className="text-sm font-medium">
        {fieldLabel}
        {isRequired && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
      {fieldOptions?.helpText && (
        <p className="text-sm text-muted-foreground">{fieldOptions.helpText}</p>
      )}
    </div>
  );
};

export default DynamicFormField;