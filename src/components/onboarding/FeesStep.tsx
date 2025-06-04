
import { OnboardingData } from "@/types/onboarding";
import ProfitCalculator from "./fees/ProfitCalculator";

interface FeesStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const FeesStep = ({ data, updateData }: FeesStepProps) => {
  return (
    <div className="space-y-6">
      {/* Only the Profit Calculator */}
      <ProfitCalculator data={data} updateData={updateData} />
    </div>
  );
};

export default FeesStep;
