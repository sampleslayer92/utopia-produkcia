
import { useState, useEffect } from "react";
import { useOnboardingData } from "./hooks/useOnboardingData";
import { useOnboardingNavigation } from "./hooks/useOnboardingNavigation";
import { onboardingSteps } from "./config/onboardingSteps";
import OnboardingSidebar from "./ui/OnboardingSidebar";
import OnboardingNavigation from "./ui/OnboardingNavigation";
import OnboardingHeader from "./ui/OnboardingHeader";
import OnboardingStepRenderer from "./components/OnboardingStepRenderer";
import { useContractCreation } from "@/hooks/useContractCreation";

const OnboardingFlow = () => {
  const { onboardingData, updateData, clearData } = useOnboardingData();
  const [currentStep, setCurrentStep] = useState(onboardingData.currentStep);
  const { createContract, isCreating } = useContractCreation();

  const {
    totalSteps,
    nextStep,
    prevStep,
    handleComplete,
    handleStepClick,
    handleSaveAndExit,
    isSubmitting
  } = useOnboardingNavigation(currentStep, setCurrentStep, onboardingData, clearData);

  // Auto-create contract when basic contact info is complete
  useEffect(() => {
    const isBasicInfoComplete = () => {
      return onboardingData.contactInfo.firstName && 
             onboardingData.contactInfo.lastName && 
             onboardingData.contactInfo.email && 
             isEmailValid(onboardingData.contactInfo.email) &&
             onboardingData.contactInfo.phone;
    };

    const isEmailValid = (email: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const autoCreateContract = async () => {
      if (isBasicInfoComplete() && !onboardingData.contractId && !isCreating) {
        console.log('Basic contact info complete, creating contract...');
        const result = await createContract();
        
        if (result.success) {
          updateData({
            contractId: result.contractId,
            contractNumber: result.contractNumber?.toString()
          });
        }
      }
    };

    const timeoutId = setTimeout(autoCreateContract, 1000);
    return () => clearTimeout(timeoutId);
  }, [
    onboardingData.contactInfo.firstName, 
    onboardingData.contactInfo.lastName, 
    onboardingData.contactInfo.email, 
    onboardingData.contactInfo.phone, 
    onboardingData.contractId, 
    isCreating, 
    createContract, 
    updateData
  ]);

  // Update current step in data when it changes
  const handleUpdateData = (data: any) => {
    updateData({ ...data, currentStep });
  };

  const handleContractDeleted = () => {
    // Reset the onboarding state completely
    clearData();
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <OnboardingHeader 
        contractNumber={onboardingData.contractNumber} 
        contractId={onboardingData.contractId}
        onContractDeleted={handleContractDeleted}
        isCreatingContract={isCreating}
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
