import CalculationFeesSection from "../contract-detail/CalculationFeesSection";

interface ContractFinanceTabProps {
  onboardingData: any;
  contract: any;
}

const ContractFinanceTab = ({
  onboardingData,
  contract
}: ContractFinanceTabProps) => {
  return (
    <div className="space-y-8">
      <CalculationFeesSection
        onboardingData={onboardingData}
        contract={contract}
      />
    </div>
  );
};

export default ContractFinanceTab;