
import { OnboardingData } from "@/types/onboarding";
import { ConsentsFieldRenderer } from "./ConsentsStep/ConsentsFieldRenderer";

interface ConsentsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onSaveSignature?: () => void;
}

const ConsentsStep = ({ data, updateData, onSaveSignature }: ConsentsStepProps) => {
  return (
    <ConsentsFieldRenderer
      data={data}
      updateData={updateData}
      onSaveSignature={onSaveSignature}
    />
  );
};

export default ConsentsStep;
