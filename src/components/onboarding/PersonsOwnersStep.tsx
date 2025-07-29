import { OnboardingData } from "@/types/onboarding";
import { PersonsOwnersFieldRenderer } from "./PersonsOwnersStep/PersonsOwnersFieldRenderer";

interface PersonsOwnersStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PersonsOwnersStep = ({ data, updateData }: PersonsOwnersStepProps) => {
  return (
    <PersonsOwnersFieldRenderer
      data={data}
      updateData={updateData}
    />
  );
};

export default PersonsOwnersStep;