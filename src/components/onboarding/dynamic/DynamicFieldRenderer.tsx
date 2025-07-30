import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingData } from "@/types/onboarding";
import type { OnboardingStep, OnboardingField } from '@/pages/OnboardingConfigPage';
import DynamicFormField from './DynamicFormField';
import OnboardingStepHeader from '../ui/OnboardingStepHeader';

interface DynamicFieldRendererProps {
  currentStep: number;
  stepConfig: OnboardingStep;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onSaveSignature: () => void;
  onStepNavigate: (fromStep: number, toStep: number) => void;
}

const DynamicFieldRenderer = ({
  currentStep,
  stepConfig,
  data,
  updateData,
  onNext,
  onPrev
}: DynamicFieldRendererProps) => {
  
  const enabledFields = stepConfig.fields
    .filter(field => field.isEnabled)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  const handleFieldChange = (fieldKey: string, value: any) => {
    // Handle nested field keys like 'address.street'
    if (fieldKey.includes('.')) {
      const keys = fieldKey.split('.');
      const nestedUpdate = keys.reduceRight((acc, key, index) => {
        if (index === keys.length - 1) {
          return { [key]: value };
        }
        return { [key]: acc };
      }, {} as any);
      
      updateData(nestedUpdate);
    } else {
      updateData({ [fieldKey]: value });
    }
  };

  const getFieldValue = (fieldKey: string): any => {
    if (fieldKey.includes('.')) {
      const keys = fieldKey.split('.');
      let value: any = data;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) break;
      }
      return value;
    }
    return (data as any)[fieldKey];
  };

  console.log('=== DynamicFieldRenderer Debug ===', {
    stepConfig,
    enabledFields: enabledFields.length,
    firstFieldKey: enabledFields[0]?.fieldKey,
    firstFieldValue: enabledFields[0] ? getFieldValue(enabledFields[0].fieldKey) : null
  });

  if (!enabledFields.length) {
    return (
      <div className="space-y-6">
        <OnboardingStepHeader
          currentStep={currentStep}
          totalSteps={7}
          title={stepConfig.title}
          description={stepConfig.description}
        />
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Tento krok nemá nakonfigurované žiadne polia.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        currentStep={currentStep}
        totalSteps={7}
        title={stepConfig.title}
        description={stepConfig.description}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>{stepConfig.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {enabledFields.map((field) => (
            <DynamicFormField
              key={field.id || field.fieldKey}
              field={field}
              value={getFieldValue(field.fieldKey)}
              onChange={(value) => handleFieldChange(field.fieldKey, value)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicFieldRenderer;