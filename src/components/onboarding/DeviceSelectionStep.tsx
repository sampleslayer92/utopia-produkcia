
import { OnboardingData } from "@/types/onboarding";
import { DeviceSelectionFieldRenderer } from "./DeviceSelectionStep/DeviceSelectionFieldRenderer";

interface DeviceSelectionStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DeviceSelectionStep = ({ data, updateData }: DeviceSelectionStepProps) => {
  return (
    <DeviceSelectionFieldRenderer
      data={data}
      updateData={updateData}
    />
  );
};

export default DeviceSelectionStep;
