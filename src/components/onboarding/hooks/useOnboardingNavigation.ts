
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OnboardingData } from "@/types/onboarding";
import { onboardingSteps } from "../config/onboardingSteps";

export const useOnboardingNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  onboardingData: OnboardingData
) => {
  const navigate = useNavigate();
  const totalSteps = onboardingSteps.length;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      toast.success("Krok uložený", {
        description: `Postupujete na krok: ${onboardingSteps[currentStep + 1].title}`
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleComplete = () => {
    console.log('Onboarding dokončený:', onboardingData);
    const contractData = {
      ...onboardingData,
      completedAt: new Date().toISOString(),
      status: 'completed'
    };
    localStorage.setItem('contract_data', JSON.stringify(contractData));
    
    localStorage.setItem('utopia_user_role', 'merchant');
    navigate('/merchant');
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo(0, 0);
  };

  const handleSaveAndExit = () => {
    navigate('/');
  };

  return {
    totalSteps,
    nextStep,
    prevStep,
    handleComplete,
    handleStepClick,
    handleSaveAndExit
  };
};
