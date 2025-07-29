
import { OnboardingData } from "@/types/onboarding";
import { FeesFieldRenderer } from "./FeesStep/FeesFieldRenderer";

interface FeesStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const FeesStep = ({ data, updateData }: FeesStepProps) => {
  return (
    <FeesFieldRenderer data={data} updateData={updateData} />
  );
};

export default FeesStep;
