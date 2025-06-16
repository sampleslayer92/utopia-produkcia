
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContractData } from "@/hooks/useContractData";
import { useContractUpdate } from "@/hooks/useContractUpdate";
import { useContractDelete } from "@/hooks/useContractDelete";
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
  const deleteContract = useContractDelete();

  // Initialize form management
  const { formData, isDirty, updateField, updateSection, resetForm, markClean, forceInitialize } = useContractDetailForm();

  // Handle data loading and form initialization
  useEffect(() => {
    if (contractDataResult.data?.onboardingData) {
      console.log('Contract data loaded, initializing form with:', contractDataResult.data.onboardingData);
      forceInitialize(contractDataResult.data.onboardingData);
    }
  }, [contractDataResult.data?.onboardingData, forceInitialize]);

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
    if (!isDirty) {
      console.log('No changes to save');
      toast({
        title: "Informácia",
        description: "Nie su žiadne zmeny na uloženie.",
      });
      return;
    }

    // Use formData if available, otherwise fall back to onboardingData
    const dataToSave = formData || onboardingData;
    
    if (!dataToSave) {
      console.error('No data available to save');
      toast({
        title: "Chyba",
        description: "Nie sú dostupné žiadne dáta na uloženie.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Saving contract changes:', dataToSave);
      
      await updateContract.mutateAsync({
        data: dataToSave
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
    console.log('Toggling edit mode. Current state:', { isEditMode, hasFormData: !!formData, isDirty });
    
    if (isEditMode) {
      // Leaving edit mode
      if (isDirty) {
        const shouldSave = window.confirm('Máte neuložené zmeny. Chcete ich uložiť pred ukončením editácie?');
        if (shouldSave) {
          handleSave();
        } else {
          // Reset form to original data
          console.log('Resetting form to original data due to user cancellation');
          forceInitialize(onboardingData);
        }
      }
      setIsEditMode(false);
    } else {
      // Entering edit mode - ensure form has the latest data
      console.log('Entering edit mode, ensuring form has current data');
      forceInitialize(onboardingData);
      setIsEditMode(true);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      console.error('No contract ID available for deletion');
      return;
    }

    console.log('Delete button clicked for contract:', id);
    
    const confirmed = window.confirm(
      `Naozaj chcete zmazať zmluvu ${contract.contract_number}? Táto akcia sa nedá vrátiť späť.`
    );
    
    if (!confirmed) {
      console.log('Delete cancelled by user');
      return;
    }

    try {
      console.log('Attempting to delete contract:', id);
      await deleteContract.mutateAsync(id);
      
      toast({
        title: "Zmluva zmazaná",
        description: "Zmluva a všetky súvisiace údaje boli úspešne zmazané.",
      });
      
      console.log('Contract deleted successfully, navigating to admin');
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting contract:', error);
      
      // Zobrazíme podrobnejšiu chybovú správu
      const errorMessage = error instanceof Error ? error.message : 'Neočakávaná chyba pri mazaní zmluvy';
      
      toast({
        title: "Chyba pri mazaní",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Determine which data to use - in edit mode use formData if available, otherwise use original data
  const currentData = (isEditMode && formData) ? formData : onboardingData;

  console.log('ContractDetail render state:', {
    isEditMode,
    hasFormData: !!formData,
    hasOnboardingData: !!onboardingData,
    formDataKeys: formData ? Object.keys(formData) : [],
    onboardingDataKeys: onboardingData ? Object.keys(onboardingData) : [],
    isDirty,
    currentDataSource: (isEditMode && formData) ? 'formData' : 'onboardingData',
    contractId: id
  });

  const handleSectionUpdate = (sectionPath: string, sectionData: any) => {
    console.log(`Section ${sectionPath} updated with data:`, sectionData);
    updateSection(sectionPath, sectionData);
  };

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
        isSaving={updateContract.isPending}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main content - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            <EnhancedClientOperationsSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onUpdate={updateField}
              onSectionUpdate={(data) => handleSectionUpdate('contactInfo', data)}
            />

            <DevicesServicesSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={(data) => handleSectionUpdate('deviceSelection', data)}
            />

            <CalculationFeesSection
              onboardingData={currentData}
              contract={contract}
            />

            <AuthorizedPersonsSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={(data) => handleSectionUpdate('authorizedPersons', data)}
            />

            <ActualOwnersSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={(data) => handleSectionUpdate('actualOwners', data)}
            />

            <ContractNotesSection
              contract={contract}
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={(notes) => handleSectionUpdate('contract', { notes })}
            />

            <SignatureSection
              contract={contract}
              onboardingData={currentData}
              onSave={(data) => handleSectionUpdate('consents', data)}
            />
          </div>

          {/* Actions sidebar - 1 column */}
          <div className="lg:col-span-1">
            <ContractActions
              contract={contract}
              onboardingData={currentData}
              onDelete={handleDelete}
              isDeleting={deleteContract.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
