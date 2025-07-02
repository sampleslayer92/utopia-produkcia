import EnhancedClientOperationsSection from "../contract-detail/EnhancedClientOperationsSection";
import AuthorizedPersonsSection from "../contract-detail/AuthorizedPersonsSection";
import ActualOwnersSection from "../contract-detail/ActualOwnersSection";

interface ContractClientTabProps {
  onboardingData: any;
  isEditMode: boolean;
  onUpdate: (data: any) => Promise<void>;
  onLocalChanges: (hasChanges: boolean) => void;
}

const ContractClientTab = ({
  onboardingData,
  isEditMode,
  onUpdate,
  onLocalChanges
}: ContractClientTabProps) => {
  return (
    <div className="space-y-8">
      <EnhancedClientOperationsSection
        onboardingData={onboardingData}
        isEditMode={isEditMode}
        onUpdate={onUpdate}
        onLocalChanges={onLocalChanges}
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
    </div>
  );
};

export default ContractClientTab;