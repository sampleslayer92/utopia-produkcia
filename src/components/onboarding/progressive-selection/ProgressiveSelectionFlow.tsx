import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';
import ModuleSelectionStep from './ModuleSelectionStep';
import SystemSelectionStep from './SystemSelectionStep';
import { ModuleSelection, SelectionFlowState } from '@/types/selection-flow';
import { OnboardingData } from '@/types/onboarding';

interface ProgressiveSelectionFlowProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onComplete: () => void;
  onBack: () => void;
}

const ProgressiveSelectionFlow = ({ data, updateData, onComplete, onBack }: ProgressiveSelectionFlowProps) => {
  const [selectionState, setSelectionState] = useState<SelectionFlowState>({
    selectedSolution: data.deviceSelection.selectedSolutions[0] || null,
    requiresModules: data.deviceSelection.selectedSolutions.includes('Pokladňa'),
    selectedModules: [],
    availableSystems: [],
    selectedSystem: null,
    currentStep: 'modules'
  });

  const steps = [
    { id: 'modules', label: 'Moduly', completed: selectionState.selectedModules.length > 0 },
    { id: 'system', label: 'Systém', completed: !!selectionState.selectedSystem },
    { id: 'products', label: 'Produkty', completed: false }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === selectionState.currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleModulesChange = (modules: ModuleSelection[]) => {
    setSelectionState(prev => ({
      ...prev,
      selectedModules: modules
    }));
  };

  const handleSystemChange = (systemId: string) => {
    setSelectionState(prev => ({
      ...prev,
      selectedSystem: systemId
    }));
  };

  const handleNextStep = () => {
    if (selectionState.currentStep === 'modules') {
      setSelectionState(prev => ({ ...prev, currentStep: 'system' }));
    } else if (selectionState.currentStep === 'system') {
      // Store the selection state and proceed to products
      const updatedData = {
        ...data,
        progressiveSelection: {
          selectionFlow: selectionState
        }
      };
      updateData(updatedData);
      onComplete();
    }
  };

  const handlePrevStep = () => {
    if (selectionState.currentStep === 'system') {
      setSelectionState(prev => ({ ...prev, currentStep: 'modules' }));
    } else if (selectionState.currentStep === 'modules') {
      onBack();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">Konfigurácia riešenia: Pokladňa</h1>
              <Badge variant="outline">{Math.round(progress)}% dokončené</Badge>
            </div>
            
            <Progress value={progress} className="w-full" />
            
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className={`h-5 w-5 ${
                      index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  )}
                  <span className={`text-sm font-medium ${
                    index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {selectionState.currentStep === 'modules' && (
        <ModuleSelectionStep
          selectedModules={selectionState.selectedModules}
          onModulesChange={handleModulesChange}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {selectionState.currentStep === 'system' && (
        <SystemSelectionStep
          selectedSystem={selectionState.selectedSystem}
          onSystemChange={handleSystemChange}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}
    </div>
  );
};

export default ProgressiveSelectionFlow;