
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContractData } from "@/hooks/useContractData";
import { useContractUpdate } from "@/hooks/useContractUpdate";
import { useToast } from "@/hooks/use-toast";
import { useContractDetailForm } from "@/hooks/useContractDetailForm";
import ContractHeader from "./contract-detail/ContractHeader";
import EnhancedClientOperationsSection from "./contract-detail/EnhancedClientOperationsSection";
import DevicesServicesSection from "./contract-detail/DevicesServicesSection";
import CalculationFeesSection from "./contract-detail/CalculationFeesSection";
import AuthorizedPersonsSection from "./contract-detail/AuthorizedPersonsSection";
import ActualOwnersSection from "./contract-detail/ActualOwnersSection";
import ContractNotesSection from "./contract-detail/ContractNotesSection";
import SignatureSection from "./contract-detail/SignatureSection";
import ContractActions from "./contract-detail/ContractActions";
import { OnboardingData } from "@/types/onboarding";

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  
  const contractDataResult = useContractData(id!);
  const updateContract = useContractUpdate(id!);

  // Initialize form management with empty data first
  const { 
    formData, 
    isDirty, 
    isInitialized,
    updateField, 
    updateBusinessLocation,
    addBusinessLocation,
    removeBusinessLocation,
    resetForm, 
    markClean 
  } = useContractDetailForm({} as OnboardingData);

  // Handle data loading and form initialization
  useEffect(() => {
    if (contractDataResult.data?.onboardingData && !isEditMode) {
      console.log('Initializing form data from contract:', contractDataResult.data.onboardingData);
      resetForm(contractDataResult.data.onboardingData);
    }
  }, [contractDataResult.data?.onboardingData, isEditMode, resetForm]);

  // Reset form when entering edit mode
  useEffect(() => {
    if (isEditMode && contractDataResult.data?.onboardingData) {
      console.log('Entering edit mode, resetting form with fresh data');
      resetForm(contractDataResult.data.onboardingData);
    }
  }, [isEditMode, contractDataResult.data?.onboardingData, resetForm]);

  if (contractDataResult.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Načítavam zmluvu...</span>
        </div>
      </div>
    );
  }

  if (contractDataResult.isError || !contractDataResult.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="max-w-md text-center p-6">
          <p className="text-slate-600 mb-4">
            Zmluva nebola nájdená alebo sa nepodarilo načítať údaje.
          </p>
        </div>
      </div>
    );
  }

  const { contract, onboardingData } = contractDataResult.data;

  const handleSave = async () => {
    if (!isDirty || !isInitialized) {
      console.log('No changes to save or form not initialized');
      return;
    }

    try {
      console.log('Saving contract changes:', formData);
      
      await updateContract.mutateAsync({
        data: formData
      });

      markClean();
      
      toast({
        title: "Zmluva uložená",
        description: "Zmeny boli úspešne uložené.",
      });
    } catch (error) {
      console.error('Error saving contract:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa uložiť zmeny.",
        variant: "destructive",
      });
    }
  };

  const handleToggleEdit = () => {
    if (isEditMode) {
      // Leaving edit mode - check if there are unsaved changes
      if (isDirty) {
        const shouldSave = window.confirm('Máte neuložené zmeny. Chcete ich uložiť pred ukončením editácie?');
        if (shouldSave) {
          handleSave();
        } else {
          // Reset form to original data
          console.log('Resetting form to original data');
          resetForm(onboardingData);
        }
      }
      setIsEditMode(false);
    } else {
      // Entering edit mode - initialize form with current data
      console.log('Entering edit mode, initializing form');
      resetForm(onboardingData);
      setIsEditMode(true);
    }
  };

  const handleDataUpdate = (data: Partial<OnboardingData>) => {
    console.log('Handling bulk data update:', data);
    
    // Update form data with bulk changes
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'businessLocations' && Array.isArray(value)) {
        // Handle business locations specially
        value.forEach((location, index) => {
          updateBusinessLocation(index, location);
        });
      } else {
        updateField(key, value);
      }
    });
  };

  // Use form data if in edit mode and initialized, otherwise use original data
  const currentData = isEditMode && isInitialized && Object.keys(formData).length > 0 ? formData : onboardingData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ContractHeader
        contract={contract}
        onboardingData={currentData}
        isEditMode={isEditMode}
        onToggleEdit={handleToggleEdit}
        onBack={() => navigate('/admin')}
        onSave={handleSave}
        isDirty={isDirty}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main content - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            <EnhancedClientOperationsSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onUpdate={updateField}
              onUpdateBusinessLocation={updateBusinessLocation}
              onAddBusinessLocation={addBusinessLocation}
              onRemoveBusinessLocation={removeBusinessLocation}
            />

            <DevicesServicesSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={handleDataUpdate}
            />

            <CalculationFeesSection
              onboardingData={currentData}
              contract={contract}
            />

            <AuthorizedPersonsSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={handleDataUpdate}
            />

            <ActualOwnersSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={handleDataUpdate}
            />

            <ContractNotesSection
              contract={contract}
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={handleDataUpdate}
            />

            <SignatureSection
              contract={contract}
              onboardingData={currentData}
              onSave={handleDataUpdate}
            />
          </div>

          {/* Actions sidebar - 1 column */}
          <div className="lg:col-span-1">
            <ContractActions
              contract={contract}
              onboardingData={currentData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
