
import { useContractDetailData } from "@/hooks/useContractDetailData";
import { useContractDetailOperations } from "@/hooks/useContractDetailOperations";
import ContractDetailLoading from "./contract-detail/ContractDetailLoading";
import ContractDetailError from "./contract-detail/ContractDetailError";
import ContractDetailContainer from "./contract-detail/ContractDetailContainer";

const ContractDetail = () => {
  const { id, contractDataResult, handleBack, t } = useContractDetailData();

  if (contractDataResult.isLoading) {
    return <ContractDetailLoading />;
  }

  if (contractDataResult.isError || !contractDataResult.data) {
    return <ContractDetailError />;
  }

  const { contract, onboardingData } = contractDataResult.data;

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
  } = useContractDetailOperations(id!, contract);

  console.log('ContractDetail render state:', {
    isEditMode,
    clientOperationsHasChanges,
    contractId: id
  });

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
