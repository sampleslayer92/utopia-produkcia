import { useMemo } from 'react';
import { OnboardingData } from "@/types/onboarding";
import type { OnboardingStep } from '@/pages/OnboardingConfigPage';
import { stepComponentRegistry } from './StepComponentRegistry';
import DynamicFieldRenderer from './DynamicFieldRenderer';

interface DynamicStepRendererProps {
  currentStep: number;
  stepConfig?: OnboardingStep;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onSaveSignature: () => void;
  onStepNavigate: (fromStep: number, toStep: number) => void;
}

const DynamicStepRenderer = ({
  currentStep,
  stepConfig,
  data,
  updateData,
  onNext,
  onPrev,
  onComplete,
  onSaveSignature,
  onStepNavigate
}: DynamicStepRendererProps) => {
  
  // Get the component for this step
  const StepComponent = useMemo(() => {
    if (!stepConfig) return null;
    
    // First try to get a registered component
    const RegisteredComponent = stepComponentRegistry.getComponent(stepConfig.stepKey);
    if (RegisteredComponent) {
      return RegisteredComponent;
    }
    
    // If no registered component, use dynamic field renderer
    return DynamicFieldRenderer;
  }, [stepConfig]);

  console.log('=== DynamicStepRenderer Debug ===', {
    currentStep,
    stepConfig,
    stepKey: stepConfig?.stepKey,
    hasComponent: !!StepComponent,
    fieldsCount: stepConfig?.fields?.length || 0,
    availableStepKeys: stepComponentRegistry.getAllStepKeys(),
    foundInRegistry: stepComponentRegistry.getComponent(stepConfig?.stepKey || ''),
    componentName: StepComponent?.name || 'Unknown'
  });

  if (!stepConfig || !StepComponent) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Krok {currentStep + 1} nie je nakonfigurovaný alebo nie je povolený.
        </p>
      </div>
    );
  }

  // Render the step component with all necessary props
  return (
    <StepComponent
      currentStep={currentStep}
      stepConfig={stepConfig}
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
      onComplete={onComplete}
      onSaveSignature={onSaveSignature}
      onStepNavigate={onStepNavigate}
    />
  );
};

export default DynamicStepRenderer;