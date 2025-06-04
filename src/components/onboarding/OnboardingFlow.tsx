
import { useState } from "react";
import { useOnboardingData } from "./hooks/useOnboardingData";
import { useOnboardingNavigation } from "./hooks/useOnboardingNavigation";
import { onboardingSteps } from "./config/onboardingSteps";
import OnboardingSidebar from "./ui/OnboardingSidebar";
import OnboardingNavigation from "./ui/OnboardingNavigation";
import OnboardingHeader from "./ui/OnboardingHeader";
import OnboardingStepRenderer from "./components/OnboardingStepRenderer";

const OnboardingFlow = () => {
  const { onboardingData, updateData, clearData } = useOnboardingData();
  const [currentStep, setCurrentStep] = useState(onboardingData.currentStep);

  const {
    totalSteps,
    nextStep,
    prevStep,
    handleComplete,
    handleStepClick,
    handleSaveAndExit,
    isSubmitting
  } = useOnboardingNavigation(currentStep, setCurrentStep, onboardingData, clearData);

  // Update current step in data when it changes
  const handleUpdateData = (data: any) => {
    updateData({ ...data, currentStep });
  };

  const handleContractDeleted = () => {
    // Reset the onboarding state
    clearData();
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <OnboardingHeader 
        contractNumber={onboardingData.contractNumber} 
        contractId={onboardingData.contractId}
        onContractDeleted={handleContractDeleted}
      />
      
      <div className="flex">
        <OnboardingSidebar
          currentStep={currentStep}
          steps={onboardingSteps}
          onStepClick={handleStepClick}
        />
        
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <OnboardingStepRenderer
              currentStep={currentStep}
              data={onboardingData}
              updateData={handleUpdateData}
              onNext={nextStep}
              onPrev={prevStep}
              onComplete={handleComplete}
            />
          </div>
        </div>
      </div>
      
      <OnboardingNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevStep={prevStep}
        onNextStep={nextStep}
        onComplete={handleComplete}
        onSaveAndExit={handleSaveAndExit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default OnboardingFlow;
