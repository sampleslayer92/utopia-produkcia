
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContractData } from "@/hooks/useContractData";
import { useContractUpdate } from "@/hooks/useContractUpdate";
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
  const [editData, setEditData] = useState<OnboardingData | null>(null);
  
  const contractDataResult = useContractData(id!);
  const updateContract = useContractUpdate(id!);

  // Initialize edit data when entering edit mode
  const initializeEditData = () => {
    if (contractDataResult.data?.onboardingData) {
      console.log('Initializing edit data for ContractDetail:', contractDataResult.data.onboardingData);
      setEditData(contractDataResult.data.onboardingData);
    }
  };

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

  const handleSave = async (data: Partial<OnboardingData>) => {
    if (!editData) {
      console.error('No edit data available for saving');
      return;
    }

    try {
      console.log('Saving contract section data:', data);
      
      // Merge the updated data with existing edit data
      const updatedData = { ...editData, ...data };
      setEditData(updatedData);
      
      await updateContract.mutateAsync({
        data: updatedData
      });

      toast({
        title: "Zmluva uložená",
        description: "Zmeny boli úspešne uložené.",
      });
    } catch (error) {
      console.error('Error saving contract section:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa uložiť zmeny.",
        variant: "destructive",
      });
    }
  };

  const handleToggleEdit = () => {
    if (isEditMode) {
      // Leaving edit mode - save all changes
      if (editData) {
        handleSave(editData);
      }
      setIsEditMode(false);
      setEditData(null);
    } else {
      // Entering edit mode - initialize edit data
      initializeEditData();
      setIsEditMode(true);
    }
  };

  const handleDataUpdate = (data: Partial<OnboardingData>) => {
    if (!editData) return;
    
    console.log('Updating section data:', data);
    const updatedData = { ...editData, ...data };
    setEditData(updatedData);
  };

  // Use edit data if in edit mode, otherwise use original data
  const currentData = isEditMode && editData ? editData : onboardingData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ContractHeader
        contract={contract}
        onboardingData={currentData}
        isEditMode={isEditMode}
        onToggleEdit={handleToggleEdit}
        onBack={() => navigate('/admin')}
        onSave={handleSave}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main content - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            <EnhancedClientOperationsSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={isEditMode ? handleDataUpdate : handleSave}
            />

            <DevicesServicesSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={isEditMode ? handleDataUpdate : handleSave}
            />

            <CalculationFeesSection
              onboardingData={currentData}
              contract={contract}
            />

            <AuthorizedPersonsSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={isEditMode ? handleDataUpdate : handleSave}
            />

            <ActualOwnersSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={isEditMode ? handleDataUpdate : handleSave}
            />

            <ContractNotesSection
              contract={contract}
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={isEditMode ? handleDataUpdate : handleSave}
            />

            <SignatureSection
              contract={contract}
              onboardingData={currentData}
              onSave={isEditMode ? handleDataUpdate : handleSave}
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
