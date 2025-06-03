
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { OnboardingData, DeviceCard, ServiceCard } from "@/types/onboarding";
import SolutionSelectionSection from "./device-selection/SolutionSelectionSection";
import DeviceCatalogPanel from "./device-selection/DeviceCatalogPanel";
import LivePreviewPanel from "./device-selection/LivePreviewPanel";

interface DeviceSelectionStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DeviceSelectionStep = ({ data, updateData, onNext, onPrev }: DeviceSelectionStepProps) => {
  const [currentMode, setCurrentMode] = useState<'selection' | 'configuration'>('selection');

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

    // Auto-switch to configuration mode when first item is added
    if (data.deviceSelection.dynamicCards.length === 0) {
      setCurrentMode('configuration');
    }
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

    // Auto-switch to configuration mode when first item is added
    if (data.deviceSelection.dynamicCards.length === 0) {
      setCurrentMode('configuration');
    }
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

  const clearAllCards = () => {
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        dynamicCards: []
      }
    });
  };

  const canProceedToNext = () => {
    return data.deviceSelection.selectedSolutions.length > 0;
  };

  // Show solution selection if no solutions are selected
  if (data.deviceSelection.selectedSolutions.length === 0) {
    return (
      <div className="space-y-6">
        <SolutionSelectionSection
          selectedSolutions={data.deviceSelection.selectedSolutions}
          onToggleSolution={toggleSolution}
          onNext={() => {}} // This will be handled by the selection itself
        />
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onPrev}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Späť
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress and Mode Toggle */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900 flex items-center gap-3">
              <span>Výber zariadení a služieb</span>
              <div className="flex items-center gap-2">
                {data.deviceSelection.selectedSolutions.map((solution) => (
                  <Badge key={solution} variant="secondary" className="text-xs">
                    {solution === 'terminal' && 'Terminály'}
                    {solution === 'pos' && 'POS'}
                    {solution === 'gateway' && 'Brána'}
                    {solution === 'softpos' && 'SoftPOS'}
                    {solution === 'charging' && 'Nabíjanie'}
                  </Badge>
                ))}
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={currentMode === 'selection' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentMode('selection')}
              >
                Katalóg
              </Button>
              <Button
                variant={currentMode === 'configuration' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentMode('configuration')}
                disabled={data.deviceSelection.dynamicCards.length === 0}
              >
                Konfigurácia ({data.deviceSelection.dynamicCards.length})
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-5 gap-6 min-h-[600px]">
        {/* Left Panel - Catalog */}
        <div className={`lg:col-span-2 ${currentMode === 'selection' ? 'lg:col-span-3' : ''}`}>
          <Card className="h-full border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
            <DeviceCatalogPanel
              selectedSolutions={data.deviceSelection.selectedSolutions}
              onAddDevice={addDevice}
              onAddService={addService}
            />
          </Card>
        </div>

        {/* Right Panel - Live Preview */}
        <div className={`lg:col-span-3 ${currentMode === 'selection' ? 'lg:col-span-2' : ''}`}>
          <Card className="h-full border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
            <LivePreviewPanel
              dynamicCards={data.deviceSelection.dynamicCards}
              onUpdateCard={updateCard}
              onRemoveCard={removeCard}
              onClearAll={clearAllCards}
            />
          </Card>
        </div>
      </div>

      {/* Notes Section */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Poznámka</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="note">Dodatočné poznámky k výberu zariadení a služieb</Label>
            <Textarea
              id="note"
              placeholder="Špecifické požiadavky, inštalačné poznámky, termíny dodania..."
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

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrev}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Späť
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              updateData({
                deviceSelection: {
                  ...data.deviceSelection,
                  selectedSolutions: []
                }
              });
            }}
            className="text-slate-600"
          >
            Zmeniť riešenie
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canProceedToNext()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
          >
            {data.deviceSelection.dynamicCards.length > 0 ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Pokračovať
              </>
            ) : (
              <>
                Ďalej
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceSelectionStep;
