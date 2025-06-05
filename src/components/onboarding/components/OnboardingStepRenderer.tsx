
import { OnboardingData } from "@/types/onboarding";
import ContactInfoStep from "../ContactInfoStep";
import CompanyInfoStep from "../CompanyInfoStep";
import BusinessLocationStep from "../BusinessLocationStep";
import DeviceSelectionStep from "../DeviceSelectionStep";
import FeesStep from "../FeesStep";
import AuthorizedPersonsStep from "../AuthorizedPersonsStep";
import ActualOwnersStep from "../ActualOwnersStep";
import ConsentsStep from "../ConsentsStep";

interface OnboardingStepRendererProps {
  currentStep: number;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onSaveSignature?: () => void;
}

const OnboardingStepRenderer = ({
  currentStep,
  data,
  updateData,
  onNext,
  onPrev,
  onComplete,
  onSaveSignature
}: OnboardingStepRendererProps) => {
  const commonProps = {
    data,
    updateData,
    onNext,
    onPrev
  };

  switch (currentStep) {
    case 0:
      return <ContactInfoStep {...commonProps} />;
    case 1:
      return <CompanyInfoStep {...commonProps} />;
    case 2:
      return <BusinessLocationStep {...commonProps} />;
    case 3:
      return <DeviceSelectionStep {...commonProps} />;
    case 4:
      return <FeesStep {...commonProps} />;
    case 5:
      return <AuthorizedPersonsStep {...commonProps} />;
    case 6:
      return <ActualOwnersStep {...commonProps} />;
    case 7:
      return <ConsentsStep {...commonProps} onComplete={onComplete} onSaveSignature={onSaveSignature} />;
    default:
      return null;
  }
};

export default OnboardingStepRenderer;
