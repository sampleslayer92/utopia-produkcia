
import { OnboardingData } from "@/types/onboarding";
import RealTimeProfitCalculator from "./fees/RealTimeProfitCalculator";

interface FeesStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isReadOnly?: boolean;
}

const FeesStep = ({ data, updateData, isReadOnly = false }: FeesStepProps) => {
  return (
    <div className="space-y-6">
      {/* Real-time Profit Calculator with two-column layout */}
      <RealTimeProfitCalculator data={data} updateData={updateData} isReadOnly={isReadOnly} />
    </div>
  );
};

export default FeesStep;
