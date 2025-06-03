
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { OnboardingData, DeviceCard, ServiceCard } from "@/types/onboarding";
import SolutionSelectionSection from "./device-selection/SolutionSelectionSection";
import DeviceAddingSection from "./device-selection/DeviceAddingSection";
import ServiceAddingSection from "./device-selection/ServiceAddingSection";
import SelectedItemsSection from "./device-selection/SelectedItemsSection";

interface DeviceSelectionStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DeviceSelectionStep = ({ data, updateData, onNext, onPrev }: DeviceSelectionStepProps) => {
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const maxSubSteps = 4;

  const toggleSolution = (solutionId: string) => {
    const newSelection = data.deviceSelection.selectedSolutions.includes(solutionId)
      ? data.deviceSelection.selectedSolutions.filter(id => id !== solutionId)
      : [...data.deviceSelection.selectedSolutions, solutionId];
    
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        selectedSolutions: newSelection
      }
    });
  };

  const addDevice = (deviceTemplate: any) => {
    const newDevice: DeviceCard = {
      ...deviceTemplate,
      id: `${deviceTemplate.id}-${Date.now()}`
    };
    
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        dynamicCards: [...data.deviceSelection.dynamicCards, newDevice]
      }
    });
  };

  const addService = (serviceTemplate: any, category: string) => {
    const newService: ServiceCard = {
      id: `${serviceTemplate.id}-${Date.now()}`,
      type: 'service',
      category,
      name: serviceTemplate.name,
      description: serviceTemplate.description,
      count: 1,
      monthlyFee: 0,
      customValue: serviceTemplate.name === 'Iný' ? '' : undefined
    };
    
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        dynamicCards: [...data.deviceSelection.dynamicCards, newService]
      }
    });
  };

  const updateCard = (cardId: string, updatedCard: DeviceCard | ServiceCard) => {
    const updatedCards = data.deviceSelection.dynamicCards.map(card =>
      card.id === cardId ? updatedCard : card
    );
    
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        dynamicCards: updatedCards
      }
    });
  };

  const removeCard = (cardId: string) => {
    const updatedCards = data.deviceSelection.dynamicCards.filter(card => card.id !== cardId);
    
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        dynamicCards: updatedCards
      }
    });
  };

  const handleNextSubStep = () => {
    if (currentSubStep < maxSubSteps - 1) {
      setCurrentSubStep(currentSubStep + 1);
    }
  };

  const handlePrevSubStep = () => {
    if (currentSubStep > 0) {
      setCurrentSubStep(currentSubStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentSubStep) {
      case 0:
        return data.deviceSelection.selectedSolutions.length > 0;
      case 3:
        return true; // Always can proceed from final step
      default:
        return true;
    }
  };

  const renderCurrentSubStep = () => {
    switch (currentSubStep) {
      case 0:
        return (
          <SolutionSelectionSection
            selectedSolutions={data.deviceSelection.selectedSolutions}
            onToggleSolution={toggleSolution}
            onNext={handleNextSubStep}
          />
        );
      case 1:
        return (
          <DeviceAddingSection
            selectedSolutions={data.deviceSelection.selectedSolutions}
            onAddDevice={addDevice}
          />
        );
      case 2:
        return (
          <ServiceAddingSection
            selectedSolutions={data.deviceSelection.selectedSolutions}
            onAddService={addService}
          />
        );
      case 3:
        return (
          <SelectedItemsSection
            dynamicCards={data.deviceSelection.dynamicCards}
            onUpdateCard={updateCard}
            onRemoveCard={removeCard}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        {Array.from({ length: maxSubSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <button
              onClick={() => setCurrentSubStep(i)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i === currentSubStep
                  ? 'bg-blue-600 text-white'
                  : i < currentSubStep
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {i + 1}
            </button>
            {i < maxSubSteps - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${i < currentSubStep ? 'bg-green-600' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Sub-step Content */}
      {renderCurrentSubStep()}

      {/* Navigation Controls */}
      {currentSubStep > 0 && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevSubStep}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Predchádzajúci krok
          </Button>
          
          <div className="flex gap-3">
            {currentSubStep < maxSubSteps - 1 ? (
              <Button
                onClick={handleNextSubStep}
                disabled={!canProceedToNext()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
              >
                Ďalší krok
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSubStep(0)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Zmeniť výber riešenia
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes Section */}
      {currentSubStep === maxSubSteps - 1 && (
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Poznámka</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="note">Dodatočné poznámky</Label>
              <Textarea
                id="note"
                placeholder="Dodatočné poznámky k výberu zariadení a služieb..."
                value={data.deviceSelection.note}
                onChange={(e) => updateData({
                  deviceSelection: {
                    ...data.deviceSelection,
                    note: e.target.value
                  }
                })}
                rows={3}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeviceSelectionStep;
