
import { useContractDetailData } from "@/hooks/useContractDetailData";
import { useContractDetailOperations } from "@/hooks/useContractDetailOperations";
import ContractDetailLoading from "./contract-detail/ContractDetailLoading";
import ContractDetailError from "./contract-detail/ContractDetailError";
import ContractDetailContainer from "./contract-detail/ContractDetailContainer";

const ContractDetail = () => {
  const { id, contractDataResult, handleBack, t } = useContractDetailData();

  // Always call the hook, but pass null contract when data is not available
  const {
    isEditMode,
    clientOperationsHasChanges,
    updateContract,
    deleteContract,
    handleSave,
    handleToggleEdit,
    handleDelete,
    handleClientOperationsUpdate,
    handleClientOperationsLocalChanges
  } = useContractDetailOperations(id!, contractDataResult.data?.contract || null);

  console.log('ContractDetail render state:', {
    isEditMode,
    clientOperationsHasChanges,
    contractId: id
  });

  if (contractDataResult.isLoading) {
    return <ContractDetailLoading />;
  }

  if (contractDataResult.isError || !contractDataResult.data) {
    return <ContractDetailError />;
  }

  const { contract, onboardingData } = contractDataResult.data;

  return (
    <ContractDetailContainer
      contract={contract}
      onboardingData={onboardingData}
      isEditMode={isEditMode}
      clientOperationsHasChanges={clientOperationsHasChanges}
      updateContract={updateContract}
      deleteContract={deleteContract}
      onBack={handleBack}
      onToggleEdit={handleToggleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      onClientOperationsUpdate={handleClientOperationsUpdate}
      onClientOperationsLocalChanges={handleClientOperationsLocalChanges}
    />
  );
};

export default ContractDetail;
