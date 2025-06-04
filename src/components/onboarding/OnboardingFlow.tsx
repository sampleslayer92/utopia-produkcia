
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingData } from "./hooks/useOnboardingData";
import { useOnboardingNavigation } from "./hooks/useOnboardingNavigation";
import { useContractManagement } from "@/hooks/useContractManagement";
import { onboardingSteps } from "./config/onboardingSteps";
import OnboardingSidebar from "./ui/OnboardingSidebar";
import OnboardingNavigation from "./ui/OnboardingNavigation";
import OnboardingHeader from "./ui/OnboardingHeader";
import OnboardingStepRenderer from "./components/OnboardingStepRenderer";

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { onboardingData, updateData, clearData } = useOnboardingData();
  const [currentStep, setCurrentStep] = useState(onboardingData.currentStep);
  const { deleteContract, createNewContract, isDeleting } = useContractManagement();

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

  const handleNewContract = async () => {
    // Clear current data
    clearData();
    
    // Create new contract
    const result = await createNewContract();
    
    if (result.success) {
      // Update data with new contract info and reset to step 0
      updateData({
        contractId: result.contractId,
        contractNumber: result.contractNumber,
        currentStep: 0
      });
      setCurrentStep(0);
      
      // Scroll to top
      window.scrollTo(0, 0);
    }
  };

  const handleDeleteContract = async () => {
    if (onboardingData.contractId) {
      const result = await deleteContract(onboardingData.contractId);
      
      if (result.success) {
        // Clear all data and navigate to welcome
        clearData();
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <OnboardingHeader 
        contractNumber={onboardingData.contractNumber} 
        contractId={onboardingData.contractId}
        onNewContract={handleNewContract}
        onDeleteContract={handleDeleteContract}
        isDeleting={isDeleting}
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
