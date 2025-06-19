import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContractData } from "@/hooks/useContractData";
import { useContractUpdate } from "@/hooks/useContractUpdate";
import { useContractDelete } from "@/hooks/useContractDelete";
import { useToast } from "@/hooks/use-toast";
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
  const [clientOperationsHasChanges, setClientOperationsHasChanges] = useState(false);
  
  const contractDataResult = useContractData(id!);
  const updateContract = useContractUpdate(id!);
  const deleteContract = useContractDelete();

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
    if (!clientOperationsHasChanges) {
      console.log('No changes to save');
      toast({
        title: "Informácia",
        description: "Nie sú žiadne zmeny na uloženie.",
      });
      return;
    }

    // Call the global commit function exposed by EnhancedClientOperationsSection
    const commitFunction = (window as any).__commitClientOperationsChanges;
    if (commitFunction) {
      try {
        console.log('Calling commit function...');
        const updatedData = await commitFunction();
        if (updatedData) {
          console.log('Commited data:', updatedData);
          // Use the contract update mutation with the committed data
          await updateContract.mutateAsync({
            data: updatedData
          });
          
          setClientOperationsHasChanges(false);
          // Automatically exit edit mode after successful save
          setIsEditMode(false);
          toast({
            title: "Zmluva uložená",
            description: "Zmeny boli úspešne uložené a editácia ukončená.",
          });
        } else {
          throw new Error('No data returned from commit');
        }
      } catch (error) {
        console.error('Error saving contract:', error);
        toast({
          title: "Chyba",
          description: "Nepodarilo sa uložiť zmeny.",
          variant: "destructive",
        });
      }
    } else {
      console.error('Commit function not available');
      toast({
        title: "Chyba",
        description: "Funkcia uloženia nie je dostupná.",
        variant: "destructive",
      });
    }
  };

  const handleToggleEdit = () => {
    console.log('Toggling edit mode. Current state:', { 
      isEditMode, 
      clientOperationsHasChanges
    });
    
    if (isEditMode && clientOperationsHasChanges) {
      const shouldSave = window.confirm('Máte neuložené zmeny. Chcete ich uložiť pred ukončením editácie?');
      if (shouldSave) {
        handleSave();
        return; // Don't toggle edit mode here, it will be done in handleSave after successful save
      } else {
        setClientOperationsHasChanges(false);
      }
    }
    
    setIsEditMode(!isEditMode);
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
      
      const errorMessage = error instanceof Error ? error.message : 'Neočakávaná chyba pri mazaní zmluvy';
      
      toast({
        title: "Chyba pri mazaní",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Simplified update handler - no longer used for auto-save
  const handleClientOperationsUpdate = async (updatedData: any) => {
    console.log('Client operations updated, saving:', updatedData);
    
    try {
      await updateContract.mutateAsync({
        data: updatedData
      });
      
      setClientOperationsHasChanges(false);
      
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

  const handleClientOperationsLocalChanges = (hasChanges: boolean) => {
    console.log('Client operations local changes:', hasChanges);
    setClientOperationsHasChanges(hasChanges);
  };

  console.log('ContractDetail render state:', {
    isEditMode,
    clientOperationsHasChanges,
    contractId: id
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ContractHeader
        contract={contract}
        onboardingData={onboardingData}
        isEditMode={isEditMode}
        onToggleEdit={handleToggleEdit}
        onBack={() => navigate('/admin')}
        onSave={handleSave}
        isDirty={clientOperationsHasChanges}
        isSaving={updateContract.isPending}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <EnhancedClientOperationsSection
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onUpdate={handleClientOperationsUpdate}
              onLocalChanges={handleClientOperationsLocalChanges}
            />

            <DevicesServicesSection
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={(data) => console.log('Device section save:', data)}
            />

            <CalculationFeesSection
              onboardingData={onboardingData}
              contract={contract}
            />

            <AuthorizedPersonsSection
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={(data) => console.log('Authorized persons save:', data)}
            />

            <ActualOwnersSection
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={(data) => console.log('Actual owners save:', data)}
            />

            <ContractNotesSection
              contract={contract}
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={(notes) => console.log('Notes save:', notes)}
            />

            <SignatureSection
              contract={contract}
              onboardingData={onboardingData}
              onSave={(data) => console.log('Signature save:', data)}
            />
          </div>

          <div className="lg:col-span-1">
            <ContractActions
              contract={contract}
              onboardingData={onboardingData}
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
