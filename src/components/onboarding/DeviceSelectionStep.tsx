
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { OnboardingData, DeviceCard, ServiceCard } from "@/types/onboarding";
import SolutionSelectionSection from "./device-selection/SolutionSelectionSection";
import DynamicDeviceCatalogPanel from "./device-selection/DynamicDeviceCatalogPanel";
import LivePreviewPanel from "./device-selection/LivePreviewPanel";
import UnifiedProductModal from "./components/UnifiedProductModal";
import ProgressiveSelectionFlow from "./progressive-selection/ProgressiveSelectionFlow";
import { useProductModal } from "./hooks/useProductModal";
import { useStepValidation } from "./hooks/useStepValidation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface DeviceSelectionStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isReadOnly?: boolean;
  customFields?: Array<{ id?: string; fieldKey: string; fieldLabel: string; fieldType: string; isRequired: boolean; isEnabled: boolean; position?: number; fieldOptions?: any; }>;
}

const DeviceSelectionStep = ({ data, updateData, onNext, onPrev, isReadOnly = false, customFields }: DeviceSelectionStepProps) => {
  const { t } = useTranslation('forms');
  const { modalState, openAddModal, openEditModal, closeModal } = useProductModal();
  const stepValidation = useStepValidation(3, data);
  const [showProgressiveFlow, setShowProgressiveFlow] = useState(false);

  const toggleSolution = (solutionId: string) => {
    if (isReadOnly) return;
    
    const isSelected = data.deviceSelection.selectedSolutions.includes(solutionId);
    const newSelection = isSelected
      ? data.deviceSelection.selectedSolutions.filter(id => id !== solutionId)
      : [...data.deviceSelection.selectedSolutions, solutionId];
    
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        selectedSolutions: newSelection
      }
    });

    // Check if Pokladňa solution (UUID: ee043a8f-3699-4c0e-8d21-b71eca1720f0) is selected to show progressive flow
    const pokladnaUuid = 'ee043a8f-3699-4c0e-8d21-b71eca1720f0';
    if (solutionId === pokladnaUuid && !isSelected) {
      setShowProgressiveFlow(true);
    } else if (solutionId === pokladnaUuid && isSelected) {
      setShowProgressiveFlow(false);
    }
  };

  const addDevice = (deviceTemplate: any) => {
    if (isReadOnly) return;
    console.log('Adding device:', deviceTemplate);
    openAddModal(deviceTemplate, 'device');
  };

  const addService = (serviceTemplate: any, category: string) => {
    if (isReadOnly) return;
    const serviceWithCategory = { ...serviceTemplate, category };
    console.log('Adding service:', serviceWithCategory);
    openAddModal(serviceWithCategory, 'service');
  };

  const handleSaveProduct = async (card: DeviceCard | ServiceCard) => {
    console.log('🎯 Saving product card:', {
      id: card.id,
      name: card.name,
      locationId: card.locationId,
      monthlyFee: card.monthlyFee,
      customFields: card.customFields,
      mode: modalState.mode
    });
    
    // Validate location if multiple locations exist
    if (data.businessLocations.length > 1 && !card.locationId) {
      console.log('❌ Location validation failed for card:', card.name);
      toast.error('Chyba', {
        description: 'Musíte vybrať prevádzku pre produkt'
      });
      return;
    }

    // Auto-assign location if only one exists
    if (data.businessLocations.length === 1 && !card.locationId) {
      card.locationId = data.businessLocations[0].id;
      console.log('🔧 Auto-assigned location:', card.locationId);
    }
    
    let updatedDeviceSelection;
    
    if (modalState.mode === 'add') {
      updatedDeviceSelection = {
        ...data.deviceSelection,
        dynamicCards: [...data.deviceSelection.dynamicCards, card]
      };
      console.log('✅ Added new card to cart, total cards:', updatedDeviceSelection.dynamicCards.length);
    } else if (modalState.mode === 'edit' && modalState.editingCard) {
      const updatedCards = data.deviceSelection.dynamicCards.map(existingCard =>
        existingCard.id === modalState.editingCard!.id ? card : existingCard
      );
      
      updatedDeviceSelection = {
        ...data.deviceSelection,
        dynamicCards: updatedCards
      };
      console.log('✅ Updated existing card in cart');
    } else {
      console.log('❌ Invalid save operation');
      return;
    }

    // Update data with deviceSelection directly
    console.log('🎯 Calling updateData with deviceSelection:', updatedDeviceSelection);
    console.log('🎯 Current cart before update:', data.deviceSelection.dynamicCards.length, 'items');
    console.log('🎯 New cart after update:', updatedDeviceSelection.dynamicCards.length, 'items');
    
    updateData({
      deviceSelection: updatedDeviceSelection
    });
    
    console.log('💾 Cart updated, localStorage synced');
    
    toast.success(modalState.mode === 'add' ? 'Produkt pridaný do košíka' : 'Produkt aktualizovaný', {
      description: `${card.name} bol úspešne ${modalState.mode === 'add' ? 'pridaný' : 'aktualizovaný'}`
    });
  };

  const updateCard = async (cardId: string, updatedCard: DeviceCard | ServiceCard) => {
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

  const removeCard = async (cardId: string) => {
    const updatedCards = data.deviceSelection.dynamicCards.filter(card => card.id !== cardId);
    
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        dynamicCards: updatedCards
      }
    });
  };

  const clearAllCards = async () => {
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        dynamicCards: []
      }
    });
  };

  const handleProgressiveFlowComplete = () => {
    setShowProgressiveFlow(false);
  };

  const handleProgressiveFlowBack = () => {
    // Remove Pokladňa from selected solutions
    const pokladnaUuid = 'ee043a8f-3699-4c0e-8d21-b71eca1720f0';
    const updatedSolutions = data.deviceSelection.selectedSolutions.filter(id => id !== pokladnaUuid);
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        selectedSolutions: updatedSolutions
      }
    });
    setShowProgressiveFlow(false);
  };

  // Show progressive flow if Pokladňa is selected
  if (showProgressiveFlow) {
    return (
      <ProgressiveSelectionFlow
        data={data}
        updateData={updateData}
        onComplete={handleProgressiveFlowComplete}
        onBack={handleProgressiveFlowBack}
      />
    );
  }

  // Show solution selection if no solutions are selected
  if (data.deviceSelection.selectedSolutions.length === 0) {
    return (
      <div className="space-y-6">
        <SolutionSelectionSection
          selectedSolutions={data.deviceSelection.selectedSolutions}
          onToggleSolution={isReadOnly ? () => {} : toggleSolution}
          onNext={() => {}}
          isReadOnly={isReadOnly}
        />
      </div>
    );
  }

  const solutionBadgeNames = {
    terminal: t('deviceSelection.solutionSelection.solutionBadges.terminal'),
    pos: t('deviceSelection.solutionSelection.solutionBadges.pos'),
    gateway: t('deviceSelection.solutionSelection.solutionBadges.gateway'),
    softpos: t('deviceSelection.solutionSelection.solutionBadges.softpos'),
    charging: t('deviceSelection.solutionSelection.solutionBadges.charging')
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header with Selected Solutions */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-slate-900 flex items-center gap-3 flex-wrap">
              <span>{t('deviceSelection.title')}</span>
              <div className="flex items-center gap-2 flex-wrap">
                {data.deviceSelection.selectedSolutions.map((solution) => (
                  <Badge key={solution} variant="secondary" className="text-xs">
                    {solutionBadgeNames[solution as keyof typeof solutionBadgeNames]}
                  </Badge>
                ))}
              </div>
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-blue-600">
                {t('deviceSelection.navigation.itemsSelected', { count: data.deviceSelection.dynamicCards.length })}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Validation Errors */}
      {stepValidation.errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-800">
              <div className="font-medium mb-2">Opravte nasledujúce chyby:</div>
              <ul className="text-sm space-y-1">
                {stepValidation.errors.map((error, index) => (
                  <li key={index}>• {error.message}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Area - Responsive Layout */}
      <div className="grid lg:grid-cols-2 gap-6 min-h-[600px]">
        {/* Left Panel - Catalog */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
          <DynamicDeviceCatalogPanel
            selectedSolutions={data.deviceSelection.selectedSolutions}
            onAddDevice={isReadOnly ? () => {} : addDevice}
            onAddService={isReadOnly ? () => {} : addService}
            businessLocations={data.businessLocations}
          />
        </Card>

        {/* Right Panel - Live Preview */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
          <LivePreviewPanel
            dynamicCards={data.deviceSelection.dynamicCards}
            onUpdateCard={isReadOnly ? () => {} : updateCard}
            onRemoveCard={isReadOnly ? () => {} : removeCard}
            onClearAll={isReadOnly ? () => {} : clearAllCards}
            onEditCard={isReadOnly ? () => {} : openEditModal}
            businessLocations={data.businessLocations.map(loc => ({ id: loc.id, name: loc.name }))}
          />
        </Card>
      </div>

      {/* Unified Product Modal */}
        <UnifiedProductModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          mode={modalState.mode}
          productType={modalState.productType}
          product={modalState.product}
          editingCard={modalState.editingCard}
          onSave={handleSaveProduct}
          businessLocations={data.businessLocations}
        />
    </div>
  );
};

export default DeviceSelectionStep;
