import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, Circle } from 'lucide-react';

interface CustomFieldsDisplayProps {
  customFields?: Record<string, any>;
  customFieldDefinitions?: Array<{
    id: string;
    field_name: string;
    field_key: string;
    field_type: string;
    field_options?: {
      options?: Array<{ value: string; label: string }>;
    } | null;
  }>;
}

export const CustomFieldsDisplay: React.FC<CustomFieldsDisplayProps> = ({
  customFields = {},
  customFieldDefinitions = [],
}) => {
  if (!customFieldDefinitions.length) {
    return null;
  }

  const renderFieldValue = (field: any, value: any) => {
    if (value === undefined || value === null || value === '') {
      return <span className="text-muted-foreground">Nezadané</span>;
    }

    switch (field.field_type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            {value ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Circle className="h-4 w-4 text-gray-400" />
            )}
            <span>{value ? 'Áno' : 'Nie'}</span>
          </div>
        );

      case 'checkbox_group':
        if (!Array.isArray(value) || value.length === 0) {
          return <span className="text-muted-foreground">Žiadne vybraté</span>;
        }

        const selectedOptions = field.field_options?.options?.filter((option: any) => 
          value.includes(option.value)
        ) || [];

        return (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option: any) => (
              <Badge key={option.value} variant="secondary" className="text-xs">
                {option.label}
              </Badge>
            ))}
          </div>
        );

      case 'select':
        const selectedOption = field.field_options?.options?.find((option: any) => 
          option.value === value
        );
        return selectedOption ? (
          <Badge variant="outline">{selectedOption.label}</Badge>
        ) : (
          <span>{value}</span>
        );

      case 'number':
        return <span className="font-mono">{value}</span>;

      case 'textarea':
        return (
          <div className="text-sm max-w-xs">
            <p className="line-clamp-3">{value}</p>
          </div>
        );

      default:
        return <span>{value}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vlastné polia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {customFieldDefinitions.map((field) => {
          const value = customFields[field.field_key];
          
          return (
            <div key={field.id} className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {field.field_name}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                {renderFieldValue(field, value)}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};