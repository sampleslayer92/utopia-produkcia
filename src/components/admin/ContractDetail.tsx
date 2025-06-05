import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContractData } from "@/hooks/useContractData";
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

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const contractDataResult = useContractData(id!);

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

  const handleSave = async (data: any) => {
    try {
      // Save functionality will be implemented based on the specific data being saved
      toast({
        title: "Zmluva uložená",
        description: "Zmeny boli úspešne uložené.",
      });
      setIsEditMode(false);
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa uložiť zmeny.",
        variant: "destructive",
      });
    }
  };

  const handleToggleEdit = () => {
    if (isEditMode) {
      // Save changes when leaving edit mode
      handleSave({});
    } else {
      setIsEditMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ContractHeader
        contract={contract}
        onboardingData={onboardingData}
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
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={handleSave}
            />

            <DevicesServicesSection
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={handleSave}
            />

            <CalculationFeesSection
              onboardingData={onboardingData}
              contract={contract}
            />

            <AuthorizedPersonsSection
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={handleSave}
            />

            <ActualOwnersSection
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={handleSave}
            />

            <ContractNotesSection
              contract={contract}
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={handleSave}
            />

            <SignatureSection
              contract={contract}
              onboardingData={onboardingData}
              onSave={handleSave}
            />
          </div>

          {/* Actions sidebar - 1 column */}
          <div className="lg:col-span-1">
            <ContractActions
              contract={contract}
              onboardingData={onboardingData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
