
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContractData } from "@/hooks/useContractData";
import { useContractEdit } from "@/hooks/useContractEdit";
import { useToast } from "@/hooks/use-toast";
import ContractHeader from "./contract-detail/ContractHeader";
import ClientOperationsSection from "./contract-detail/ClientOperationsSection";
import DevicesServicesSection from "./contract-detail/DevicesServicesSection";
import CalculationFeesSection from "./contract-detail/CalculationFeesSection";
import AuthorizedPersonsSection from "./contract-detail/AuthorizedPersonsSection";
import SignatureSection from "./contract-detail/SignatureSection";
import ContractActions from "./contract-detail/ContractActions";

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const contractDataResult = useContractData(id!);
  const { saveContract, updateDeviceCount, removeDevice, isSaving } = useContractEdit();

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

  // Initialize edit data when switching to edit mode
  if (isEditMode && !editData) {
    setEditData(onboardingData);
  }

  const handleSave = async (data?: any) => {
    try {
      const dataToSave = data || editData || onboardingData;
      const result = await saveContract(contract.id, dataToSave);
      
      if (result.success) {
        setIsEditMode(false);
        setEditData(null);
        // Refresh the data
        contractDataResult.refetch();
      }
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa uložiť zmeny.",
        variant: "destructive",
      });
    }
  };

  const handleDeviceUpdate = async (deviceName: string, newCount: number) => {
    const result = await updateDeviceCount(contract.id, deviceName, newCount);
    if (result.success) {
      contractDataResult.refetch();
    }
  };

  const handleDeviceRemove = async (deviceName: string) => {
    const result = await removeDevice(contract.id, deviceName);
    if (result.success) {
      contractDataResult.refetch();
    }
  };

  const handleDataUpdate = (newData: any) => {
    setEditData({ ...editData, ...newData });
  };

  const currentData = isEditMode ? editData : onboardingData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ContractHeader
        contract={contract}
        onboardingData={currentData}
        isEditMode={isEditMode}
        onToggleEdit={() => {
          if (isEditMode) {
            setEditData(null);
          }
          setIsEditMode(!isEditMode);
        }}
        onBack={() => navigate('/admin')}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main content - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            <ClientOperationsSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={handleDataUpdate}
            />

            <DevicesServicesSection
              onboardingData={currentData}
              isEditMode={isEditMode}
              onSave={handleDataUpdate}
              onDeviceUpdate={handleDeviceUpdate}
              onDeviceRemove={handleDeviceRemove}
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
