
import { OnboardingData } from "@/types/onboarding";
import RealTimeProfitCalculator from "./fees/RealTimeProfitCalculator";

interface FeesStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const FeesStep = ({ data, updateData }: FeesStepProps) => {
  return (
    <div className="space-y-6">
      {/* Real-time Two-Column Profit Calculator */}
      <RealTimeProfitCalculator data={data} updateData={updateData} />
    </div>
  );
};

export default FeesStep;
