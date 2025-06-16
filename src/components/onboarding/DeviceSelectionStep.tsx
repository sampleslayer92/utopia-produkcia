
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { OnboardingData, DeviceCard, ServiceCard } from "@/types/onboarding";
import SolutionSelectionSection from "./device-selection/SolutionSelectionSection";
import DeviceCatalogPanel from "./device-selection/DeviceCatalogPanel";
import LivePreviewPanel from "./device-selection/LivePreviewPanel";
import ProductDetailModal from "./components/ProductDetailModal";
import { useProductModal } from "./hooks/useProductModal";
import { useContractPersistence } from "@/hooks/useContractPersistence";
import { useEnhancedAutoSave } from "./hooks/useEnhancedAutoSave";
import { useStepValidation } from "./hooks/useStepValidation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface DeviceSelectionStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DeviceSelectionStep = ({ data, updateData, onNext, onPrev }: DeviceSelectionStepProps) => {
  const { t } = useTranslation('forms');
  const { modalState, openAddModal, openEditModal, closeModal } = useProductModal();
  const { saveContractData } = useContractPersistence();
  const stepValidation = useStepValidation(3, data);

  // Enhanced auto-save with better error handling
  const handleAutoSave = useCallback(async (updatedData: OnboardingData) => {
    if (!updatedData.contractId) {
      console.warn('No contract ID available for auto-save');
      return;
    }

    console.log('Auto-saving products...', updatedData.deviceSelection.dynamicCards);
    const result = await saveContractData(updatedData.contractId, updatedData);
    
    if (!result.success) {
      console.error('Auto-save failed:', result.error);
      throw new Error(result.error || 'Auto-save failed');
    }
    
    console.log('Products auto-saved successfully');
  }, [saveContractData]);

  const { isSaving, lastSaved, saveStatus, forceSave } = useEnhancedAutoSave(data, {
    enabled: Boolean(data.contractId),
    onSave: handleAutoSave,
    showToasts: false,
    delay: 2000
  });

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
    console.log('Adding device:', deviceTemplate);
    openAddModal(deviceTemplate, 'device');
  };

  const addService = (serviceTemplate: any, category: string) => {
    const serviceWithCategory = { ...serviceTemplate, category };
    console.log('Adding service:', serviceWithCategory);
    openAddModal(serviceWithCategory, 'service');
  };

  const handleSaveProduct = async (card: DeviceCard | ServiceCard) => {
    console.log('Saving product:', card);
    
    let updatedData: OnboardingData;
    
    if (modalState.mode === 'add') {
      updatedData = {
        ...data,
        deviceSelection: {
          ...data.deviceSelection,
          dynamicCards: [...data.deviceSelection.dynamicCards, card]
        }
      };
    } else if (modalState.mode === 'edit' && modalState.editingCard) {
      const updatedCards = data.deviceSelection.dynamicCards.map(existingCard =>
        existingCard.id === modalState.editingCard!.id ? card : existingCard
      );
      
      updatedData = {
        ...data,
        deviceSelection: {
          ...data.deviceSelection,
          dynamicCards: updatedCards
        }
      };
    } else {
      return;
    }

    // Update local state first
    updateData(updatedData);
    
    // Force immediate save for important changes
    try {
      await forceSave();
      toast.success('Produkt uložený', {
        description: 'Zmeny boli úspešne uložené'
      });
    } catch (error) {
      toast.error('Chyba pri ukladaní', {
        description: 'Skúste to znova'
      });
    }
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

  const canProceedToNext = () => {
    return stepValidation.isValid;
  };

  // Show solution selection if no solutions are selected
  if (data.deviceSelection.selectedSolutions.length === 0) {
    return (
      <div className="space-y-6">
        <SolutionSelectionSection
          selectedSolutions={data.deviceSelection.selectedSolutions}
          onToggleSolution={toggleSolution}
          onNext={() => {}}
        />
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onPrev}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('deviceSelection.navigation.back')}
          </Button>
        </div>
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
    <div className="space-y-6">
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
          <DeviceCatalogPanel
            selectedSolutions={data.deviceSelection.selectedSolutions}
            onAddDevice={addDevice}
            onAddService={addService}
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
          />
        </Card>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        productType={modalState.productType}
        product={modalState.product}
        editingCard={modalState.editingCard}
        onSave={handleSaveProduct}
      />

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button
          variant="outline"
          onClick={onPrev}
          className="flex items-center gap-2 w-full sm:w-auto"
          disabled={isSaving}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('deviceSelection.navigation.back')}
        </Button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
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
            className="text-slate-600 w-full sm:w-auto"
            disabled={isSaving}
          >
            {t('deviceSelection.navigation.changeSolution')}
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canProceedToNext() || isSaving}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('deviceSelection.loading.saving')}
              </>
            ) : data.deviceSelection.dynamicCards.length > 0 ? (
              <>
                <CheckCircle className="h-4 w-4" />
                {t('deviceSelection.navigation.continue')}
              </>
            ) : (
              <>
                {t('deviceSelection.navigation.next')}
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
