
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
  const { formData, isDirty, updateField, updateSection, resetForm, markClean, markDirty } = useContractDetailForm();

  // Handle data loading and form initialization
  useEffect(() => {
    if (contractDataResult.data?.onboardingData) {
      console.log('Initializing form data from contract:', contractDataResult.data.onboardingData);
      resetForm(contractDataResult.data.onboardingData);
    }
  }, [contractDataResult.data?.onboardingData, resetForm]);

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

    if (!formData || Object.keys(formData).length === 0) {
      console.error('No form data to save');
      toast({
        title: "Chyba",
        description: "Nie sú dostupné žiadne dáta na uloženie.",
        variant: "destructive",
      });
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
      // Entering edit mode - ensure form has current data
      console.log('Entering edit mode, ensuring form has current data');
      if (!formData) {
        resetForm(onboardingData);
      }
      setIsEditMode(true);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Naozaj chcete zmazať zmluvu ${contract.contract_number}? Táto akcia sa nedá vrátiť späť.`
    );
    
    if (!confirmed) return;

    try {
      await deleteContract.mutateAsync(id!);
      toast({
        title: "Zmluva zmazaná",
        description: "Zmluva bola úspešne zmazaná.",
      });
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast({
        title: "Chyba pri mazaní",
        description: "Nepodarilo sa zmazať zmluvu. Skúste to znovu.",
        variant: "destructive",
      });
    }
  };

  // Use form data if available and in edit mode, otherwise use original data
  const currentData = (isEditMode && formData) ? formData : onboardingData;

  console.log('ContractDetail render:', {
    isEditMode,
    hasFormData: !!formData,
    formDataKeys: formData ? Object.keys(formData) : [],
    isDirty
  });

  const handleSectionUpdate = (sectionPath: string, sectionData: any) => {
    console.log(`Section ${sectionPath} updated:`, sectionData);
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
