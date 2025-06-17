
import React from 'react';
import { OnboardingData } from '@/types/onboarding';
import ContactInfoStep from '@/components/onboarding/ContactInfoStep';
import CompanyInfoStep from '@/components/onboarding/CompanyInfoStep';
import BusinessLocationStep from '@/components/onboarding/BusinessLocationStep';
import DeviceSelectionStep from '@/components/onboarding/DeviceSelectionStep';
import FeesStep from '@/components/onboarding/FeesStep';
import PersonsAndOwnersStep from '@/components/onboarding/PersonsAndOwnersStep';
import ConsentsStep from '@/components/onboarding/ConsentsStep';

interface ContractEditStepRendererProps {
  currentStep: number;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

const ContractEditStepRenderer = ({
  currentStep,
  data,
  updateData,
  onNext,
  onPrev,
  onComplete
}: ContractEditStepRendererProps) => {
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ContactInfoStep
            data={data}
            updateData={updateData}
            onNext={onNext}
            onPrev={onPrev}
          />
        );
      case 1:
        return (
          <CompanyInfoStep
            data={data}
            updateData={updateData}
            onNext={onNext}
            onPrev={onPrev}
            hideContactPerson={false}
          />
        );
      case 2:
        return (
          <BusinessLocationStep
            data={data}
            updateData={updateData}
            onNext={onNext}
            onPrev={onPrev}
          />
        );
      case 3:
        return (
          <DeviceSelectionStep
            data={data}
            updateData={updateData}
            onNext={onNext}
            onPrev={onPrev}
          />
        );
      case 4:
        return (
          <FeesStep
            data={data}
            updateData={updateData}
            onNext={onNext}
            onPrev={onPrev}
          />
        );
      case 5:
        return (
          <PersonsAndOwnersStep
            data={data}
            updateData={updateData}
            onNext={onNext}
            onPrev={onPrev}
          />
        );
      case 6:
        return (
          <ConsentsStep
            data={data}
            updateData={updateData}
            onNext={onNext}
            onPrev={onPrev}
            onComplete={onComplete}
          />
        );
      default:
        return <div>Neplatný krok</div>;
    }
  };

  return (
    <div className="w-full">
      {renderStep()}
    </div>
  );
};

export default ContractEditStepRenderer;
