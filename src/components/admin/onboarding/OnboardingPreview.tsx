import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingPreviewProps {
  configurationId: string;
}

interface StepData {
  id: string;
  step_key: string;
  title: string;
  description: string;
  position: number;
  is_enabled: boolean;
  fields: FieldData[];
}

interface FieldData {
  id: string;
  field_key: string;
  field_label: string;
  field_type: string;
  is_required: boolean;
  is_enabled: boolean;
  position: number;
  field_options?: any;
}

const OnboardingPreview = ({ configurationId }: OnboardingPreviewProps) => {
  const [steps, setSteps] = useState<StepData[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (configurationId) {
      loadStepsWithFields();
    }
  }, [configurationId]);

  const loadStepsWithFields = async () => {
    try {
      // Load steps
      const { data: stepsData, error: stepsError } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('configuration_id', configurationId)
        .eq('is_enabled', true)
        .order('position');

      if (stepsError) throw stepsError;

      // Load fields for each step
      const stepsWithFields = await Promise.all(
        stepsData.map(async (step) => {
          const { data: fieldsData, error: fieldsError } = await supabase
            .from('onboarding_fields')
            .select('*')
            .eq('step_id', step.id)
            .eq('is_enabled', true)
            .order('position');

          if (fieldsError) throw fieldsError;

          return {
            ...step,
            fields: fieldsData
          };
        })
      );

      setSteps(stepsWithFields);
    } catch (error) {
      console.error('Error loading preview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const renderField = (field: FieldData) => {
    const value = formData[field.field_key] || '';

    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <Input
            type={field.field_type}
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            placeholder={`Zadajte ${field.field_label.toLowerCase()}`}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            placeholder={`Zadajte ${field.field_label.toLowerCase()}`}
            rows={3}
          />
        );

      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handleFieldChange(field.field_key, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Vyberte ${field.field_label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Možnosť 1</SelectItem>
              <SelectItem value="option2">Možnosť 2</SelectItem>
              <SelectItem value="option3">Možnosť 3</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value}
              onCheckedChange={(checked) => handleFieldChange(field.field_key, checked)}
            />
            <span className="text-sm">{field.field_label}</span>
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
          />
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            placeholder={`Zadajte ${field.field_label.toLowerCase()}`}
          />
        );
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Načítava sa náhľad...</div>;
  }

  if (steps.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Žiadne kroky na zobrazenie</p>
        </CardContent>
      </Card>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Náhľad onboardingu</h2>
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index < currentStep
                  ? 'bg-green-100 text-green-800'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Current step */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{step.title}</span>
                <Badge variant="outline">Krok {currentStep + 1}/{steps.length}</Badge>
              </CardTitle>
              {step.description && (
                <p className="text-muted-foreground mt-2">{step.description}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {step.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.field_key} className="flex items-center space-x-1">
                <span>{field.field_label}</span>
                {field.is_required && <span className="text-red-500">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}

          {step.fields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Tento krok nemá žiadne polia
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Späť
        </Button>
        <Button 
          onClick={nextStep} 
          disabled={currentStep === steps.length - 1}
        >
          Ďalej
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingPreview;