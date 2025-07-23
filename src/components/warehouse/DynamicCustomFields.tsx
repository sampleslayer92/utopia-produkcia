import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UseFormReturn } from 'react-hook-form';
import { CustomFieldDefinition } from '@/hooks/useCustomFieldDefinitions';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DynamicCustomFieldsProps {
  form: UseFormReturn<any>;
  customFields: CustomFieldDefinition[];
}

export const DynamicCustomFields: React.FC<DynamicCustomFieldsProps> = ({
  form,
  customFields,
}) => {
  if (!customFields || customFields.length === 0) {
    return null;
  }

  const renderField = (field: CustomFieldDefinition) => {
    const fieldName = `custom_fields.${field.field_key}`;

    switch (field.field_type) {
      case 'text':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <span>{field.field_name}</span>
                  {field.is_required && <Badge variant="destructive" className="text-xs">Povinné</Badge>}
                  {field.help_text && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{field.help_text}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={field.default_value || ''}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'number':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <span>{field.field_name}</span>
                  {field.is_required && <Badge variant="destructive" className="text-xs">Povinné</Badge>}
                  {field.help_text && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{field.help_text}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={field.default_value || '0'}
                    {...formField}
                    onChange={(e) => formField.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'textarea':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <span>{field.field_name}</span>
                  {field.is_required && <Badge variant="destructive" className="text-xs">Povinné</Badge>}
                  {field.help_text && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{field.help_text}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.default_value || ''}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'boolean':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="flex items-center space-x-2">
                    <span>{field.field_name}</span>
                    {field.is_required && <Badge variant="destructive" className="text-xs">Povinné</Badge>}
                  </FormLabel>
                  {field.help_text && (
                    <FormDescription>{field.help_text}</FormDescription>
                  )}
                </div>
                <FormControl>
                  <Switch
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );

      case 'select':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <span>{field.field_name}</span>
                  {field.is_required && <Badge variant="destructive" className="text-xs">Povinné</Badge>}
                  {field.help_text && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{field.help_text}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte možnosť" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.field_options?.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'checkbox_group':
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="flex items-center space-x-2">
                    <span>{field.field_name}</span>
                    {field.is_required && <Badge variant="destructive" className="text-xs">Povinné</Badge>}
                    {field.help_text && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{field.help_text}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </FormLabel>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {field.field_options?.options?.map((option) => (
                    <FormField
                      key={option.value}
                      control={form.control}
                      name={fieldName}
                      render={({ field: checkboxField }) => {
                        const currentValues = Array.isArray(checkboxField.value) ? checkboxField.value : [];
                        return (
                          <FormItem
                            key={option.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={currentValues.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  let newValues;
                                  if (checked) {
                                    newValues = [...currentValues, option.value];
                                  } else {
                                    newValues = currentValues.filter((value: string) => value !== option.value);
                                  }
                                  checkboxField.onChange(newValues);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>⚙️ Vlastné polia</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {customFields.map(renderField)}
      </CardContent>
    </Card>
  );
};