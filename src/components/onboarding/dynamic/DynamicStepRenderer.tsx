import { useMemo } from 'react';
import { OnboardingData } from "@/types/onboarding";
import type { OnboardingStep } from '@/pages/OnboardingConfigPage';
import { stepComponentRegistry } from './StepComponentRegistry';
import { moduleComponentRegistry } from './ModuleComponentRegistry';
import './ModuleRegistration'; // Import to register modules
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { useOnboardingConfig } from '@/hooks/useOnboardingConfig';

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
  const { getStepModules } = useOnboardingConfig();
  
  // Get modules for current step
  const stepModules = stepConfig ? getStepModules(stepConfig.id) : [];
  
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
    modulesCount: stepModules?.length || 0
  });
  const enabledModules = stepModules.filter(module => module.isEnabled);
  const hasModules = enabledModules.length > 0;

  if (!stepConfig && !hasModules) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Krok {currentStep + 1} nie je nakonfigurovaný alebo nie je povolený.
        </p>
      </div>
    );
  }

  // If we have modules, render them
  if (hasModules) {
    return (
      <div className="space-y-6">
        {enabledModules
          .sort((a, b) => a.position - b.position)
          .map((moduleConfig) => {
            const ModuleComponent = moduleComponentRegistry.getComponent(moduleConfig.moduleKey);
            
            if (!ModuleComponent) {
              console.warn(`Module component not found for key: ${moduleConfig.moduleKey}`);
              return null;
            }

            return (
              <div key={moduleConfig.id}>
                <ModuleComponent
                  data={data}
                  updateData={updateData}
                  onNext={onNext}
                  onPrev={onPrev}
                  configuration={moduleConfig.configuration}
                  isReadOnly={false}
                />
              </div>
            );
          })}
        
        {/* Render custom fields if they exist alongside modules */}
        {stepConfig && stepConfig.fields && stepConfig.fields.length > 0 && (
          <DynamicFieldRenderer
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
        )}
      </div>
    );
  }

  // Fallback to original step component rendering
  if (!StepComponent) {
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