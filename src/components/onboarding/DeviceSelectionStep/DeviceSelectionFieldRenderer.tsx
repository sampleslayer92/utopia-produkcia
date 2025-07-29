import React, { useState } from 'react';
import { useStepConfiguration } from '@/hooks/useOnboardingConfiguration';
import { DynamicFieldRenderer } from '../components/DynamicFieldRenderer';
import { OnboardingData, DeviceCard, ServiceCard } from '@/types/onboarding';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SolutionSelectionSection from '../device-selection/SolutionSelectionSection';
import DynamicDeviceCatalogPanel from '../device-selection/DynamicDeviceCatalogPanel';
import LivePreviewPanel from '../device-selection/LivePreviewPanel';
import UnifiedProductModal from '../components/UnifiedProductModal';
import ProgressiveSelectionFlow from '../progressive-selection/ProgressiveSelectionFlow';
import { useProductModal } from '../hooks/useProductModal';
import { useStepValidation } from '../hooks/useStepValidation';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface DeviceSelectionFieldRendererProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const DeviceSelectionFieldRenderer: React.FC<DeviceSelectionFieldRendererProps> = ({
  data,
  updateData
}) => {
  const { t } = useTranslation('forms');
  const { modalState, openAddModal, openEditModal, closeModal } = useProductModal();
  const stepValidation = useStepValidation(3, data);
  const [showProgressiveFlow, setShowProgressiveFlow] = useState(false);
  const { step, isStepEnabled, fields } = useStepConfiguration('device_selection');

  // If configuration is available and step is disabled, render nothing
  if (step && !isStepEnabled) {
    return null;
  }

  const toggleSolution = (solutionId: string) => {
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

    // Check if Pokladňa solution is selected to show progressive flow
    const pokladnaUuid = 'ee043a8f-3699-4c0e-8d21-b71eca1720f0';
    if (solutionId === pokladnaUuid && !isSelected) {
      setShowProgressiveFlow(true);
    } else if (solutionId === pokladnaUuid && isSelected) {
      setShowProgressiveFlow(false);
    }
  };

  const addDevice = (deviceTemplate: any) => {
    openAddModal(deviceTemplate, 'device');
  };

  const addService = (serviceTemplate: any, category: string) => {
    const serviceWithCategory = { ...serviceTemplate, category };
    openAddModal(serviceWithCategory, 'service');
  };

  const handleSaveProduct = async (card: DeviceCard | ServiceCard) => {
    // Validate location if multiple locations exist
    if (data.businessLocations.length > 1 && !card.locationId) {
      toast.error('Chyba', {
        description: 'Musíte vybrať prevádzku pre produkt'
      });
      return;
    }

    // Auto-assign location if only one exists
    if (data.businessLocations.length === 1 && !card.locationId) {
      card.locationId = data.businessLocations[0].id;
    }
    
    let updatedDeviceSelection;
    
    if (modalState.mode === 'add') {
      updatedDeviceSelection = {
        ...data.deviceSelection,
        dynamicCards: [...data.deviceSelection.dynamicCards, card]
      };
    } else if (modalState.mode === 'edit' && modalState.editingCard) {
      const updatedCards = data.deviceSelection.dynamicCards.map(existingCard =>
        existingCard.id === modalState.editingCard!.id ? card : existingCard
      );
      
      updatedDeviceSelection = {
        ...data.deviceSelection,
        dynamicCards: updatedCards
      };
    } else {
      return;
    }

    updateData({
      deviceSelection: updatedDeviceSelection
    });
    
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

  // If no configuration available, render default device selection components
  if (!step || fields.length === 0) {
    // Show solution selection if no solutions are selected
    if (data.deviceSelection.selectedSolutions.length === 0) {
      return (
        <div className="space-y-6">
          <SolutionSelectionSection
            selectedSolutions={data.deviceSelection.selectedSolutions}
            onToggleSolution={toggleSolution}
            onNext={() => {}}
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
              onAddDevice={addDevice}
              onAddService={addService}
              businessLocations={data.businessLocations}
            />
          </Card>

          {/* Right Panel - Live Preview */}
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
            <LivePreviewPanel
              dynamicCards={data.deviceSelection.dynamicCards}
              onUpdateCard={updateCard}
              onRemoveCard={removeCard}
              onClearAll={clearAllCards}
              onEditCard={openEditModal}
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
  }

  // Render dynamic fields based on configuration
  return (
    <div className="space-y-6">
      {fields.map((field) => {
        // Handle special device selection components
        if (field.field_key === 'solution_selection') {
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <SolutionSelectionSection
                  selectedSolutions={data.deviceSelection.selectedSolutions}
                  onToggleSolution={toggleSolution}
                  onNext={() => {}}
                />
              )}
            </div>
          );
        }

        if (field.field_key === 'device_catalog') {
          return (
            <div key={field.id}>
              {field.is_enabled && data.deviceSelection.selectedSolutions.length > 0 && (
                <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
                  <DynamicDeviceCatalogPanel
                    selectedSolutions={data.deviceSelection.selectedSolutions}
                    onAddDevice={addDevice}
                    onAddService={addService}
                    businessLocations={data.businessLocations}
                  />
                </Card>
              )}
            </div>
          );
        }

        if (field.field_key === 'device_preview') {
          return (
            <div key={field.id}>
              {field.is_enabled && data.deviceSelection.selectedSolutions.length > 0 && (
                <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
                  <LivePreviewPanel
                    dynamicCards={data.deviceSelection.dynamicCards}
                    onUpdateCard={updateCard}
                    onRemoveCard={removeCard}
                    onClearAll={clearAllCards}
                    onEditCard={openEditModal}
                    businessLocations={data.businessLocations.map(loc => ({ id: loc.id, name: loc.name }))}
                  />
                </Card>
              )}
            </div>
          );
        }

        // Handle individual dynamic fields
        const fieldValue = (data.deviceSelection as any)[field.field_key];
        
        return (
          <div key={field.id}>
            {field.is_enabled && (
              <DynamicFieldRenderer
                field={field}
                value={fieldValue}
                onChange={(value) => {
                  updateData({
                    deviceSelection: {
                      ...data.deviceSelection,
                      [field.field_key]: value
                    }
                  });
                }}
              />
            )}
          </div>
        );
      })}
      
      {/* Always include modal for dynamic config */}
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