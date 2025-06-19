
import ContractHeader from "./ContractHeader";
import EnhancedClientOperationsSection from "./EnhancedClientOperationsSection";
import DevicesServicesSection from "./DevicesServicesSection";
import CalculationFeesSection from "./CalculationFeesSection";
import AuthorizedPersonsSection from "./AuthorizedPersonsSection";
import ActualOwnersSection from "./ActualOwnersSection";
import ContractNotesSection from "./ContractNotesSection";
import SignatureSection from "./SignatureSection";
import ContractActions from "./ContractActions";

interface ContractDetailContainerProps {
  contract: any;
  onboardingData: any;
  isEditMode: boolean;
  clientOperationsHasChanges: boolean;
  updateContract: any;
  deleteContract: any;
  onBack: () => void;
  onToggleEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onClientOperationsUpdate: (data: any) => void;
  onClientOperationsLocalChanges: (hasChanges: boolean) => void;
}

const ContractDetailContainer = ({
  contract,
  onboardingData,
  isEditMode,
  clientOperationsHasChanges,
  updateContract,
  deleteContract,
  onBack,
  onToggleEdit,
  onSave,
  onDelete,
  onClientOperationsUpdate,
  onClientOperationsLocalChanges
}: ContractDetailContainerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ContractHeader
        contract={contract}
        onboardingData={onboardingData}
        isEditMode={isEditMode}
        onToggleEdit={onToggleEdit}
        onBack={onBack}
        onSave={onSave}
        isDirty={clientOperationsHasChanges}
        isSaving={updateContract.isPending}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <EnhancedClientOperationsSection
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onUpdate={onClientOperationsUpdate}
              onLocalChanges={onClientOperationsLocalChanges}
            />

            <DevicesServicesSection
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={async (data) => console.log('Device section save:', data)}
            />

            <CalculationFeesSection
              onboardingData={onboardingData}
              contract={contract}
            />

            <AuthorizedPersonsSection
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={async (data) => console.log('Authorized persons save:', data)}
            />

            <ActualOwnersSection
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={async (data) => console.log('Actual owners save:', data)}
            />

            <ContractNotesSection
              contract={contract}
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={async (notes) => console.log('Notes save:', notes)}
            />

            <SignatureSection
              contract={contract}
              onboardingData={onboardingData}
              onSave={async (data) => console.log('Signature save:', data)}
            />
          </div>

          <div className="lg:col-span-1">
            <ContractActions
              contract={contract}
              onboardingData={onboardingData}
              onDelete={onDelete}
              isDeleting={deleteContract.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailContainer;
