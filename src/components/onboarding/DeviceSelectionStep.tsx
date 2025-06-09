
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { OnboardingData, DeviceCard, ServiceCard } from "@/types/onboarding";
import SolutionSelectionSection from "./device-selection/SolutionSelectionSection";
import DeviceCatalogPanel from "./device-selection/DeviceCatalogPanel";
import LivePreviewPanel from "./device-selection/LivePreviewPanel";
import ProductDetailModal from "./components/ProductDetailModal";
import { useProductModal } from "./hooks/useProductModal";
import { useTranslation } from "react-i18next";

interface DeviceSelectionStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DeviceSelectionStep = ({ data, updateData, onNext, onPrev }: DeviceSelectionStepProps) => {
  const { t } = useTranslation('forms');
  const { modalState, openAddModal, openEditModal, closeModal } = useProductModal();

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

  const handleSaveProduct = (card: DeviceCard | ServiceCard) => {
    console.log('Saving product:', card);
    if (modalState.mode === 'add') {
      updateData({
        deviceSelection: {
          ...data.deviceSelection,
          dynamicCards: [...data.deviceSelection.dynamicCards, card]
        }
      });
    } else if (modalState.mode === 'edit' && modalState.editingCard) {
      const updatedCards = data.deviceSelection.dynamicCards.map(existingCard =>
        existingCard.id === modalState.editingCard!.id ? card : existingCard
      );
      
      updateData({
        deviceSelection: {
          ...data.deviceSelection,
          dynamicCards: updatedCards
        }
      });
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
      {/* Header with Progress */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900 flex items-center gap-3">
              <span>{t('deviceSelection.title')}</span>
              <div className="flex items-center gap-2">
                {data.deviceSelection.selectedSolutions.map((solution) => (
                  <Badge key={solution} variant="secondary" className="text-xs">
                    {solutionBadgeNames[solution as keyof typeof solutionBadgeNames]}
                  </Badge>
                ))}
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600">
                {t('deviceSelection.navigation.itemsSelected', { count: data.deviceSelection.dynamicCards.length })}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Area - Two Column Layout */}
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
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrev}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('deviceSelection.navigation.back')}
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
            {t('deviceSelection.navigation.changeSolution')}
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canProceedToNext()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
          >
            {data.deviceSelection.dynamicCards.length > 0 ? (
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
