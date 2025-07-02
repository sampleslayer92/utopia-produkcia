import DevicesServicesSection from "../contract-detail/DevicesServicesSection";

interface ContractDevicesTabProps {
  onboardingData: any;
  isEditMode: boolean;
  onSave: (data: any) => Promise<void>;
}

const ContractDevicesTab = ({
  onboardingData,
  isEditMode,
  onSave
}: ContractDevicesTabProps) => {
  return (
    <div className="space-y-8">
      <DevicesServicesSection
        onboardingData={onboardingData}
        isEditMode={isEditMode}
        onSave={onSave}
      />
    </div>
  );
};

export default ContractDevicesTab;