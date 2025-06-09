
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OnboardingData } from "@/types/onboarding";
import { onboardingSteps } from "../config/onboardingSteps";
import { useContractSubmission } from "@/hooks/useContractSubmission";

export const useOnboardingNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  onboardingData: OnboardingData,
  clearData: () => void
) => {
  const navigate = useNavigate();
  const totalSteps = onboardingSteps.length;
  const { submitContract, isSubmitting } = useContractSubmission();

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

  const handleComplete = async () => {
    console.log('Onboarding dokončený:', onboardingData);
    
    // Submit contract to Supabase
    const result = await submitContract(onboardingData);
    
    if (result.success) {
      // Store success data for redirect
      const contractData = {
        ...onboardingData,
        completedAt: new Date().toISOString(),
        status: 'submitted',
        contractId: result.contractId,
        contractNumber: result.contractNumber
      };
      
      localStorage.setItem('contract_data', JSON.stringify(contractData));
      localStorage.setItem('utopia_user_role', 'merchant');
      
      // Clear onboarding data
      clearData();
      
      // Navigate to merchant dashboard
      navigate('/merchant');
      
      toast.success('Registrácia dokončená!', {
        description: `Číslo zmluvy: ${result.contractNumber}. Presmerováva sa na dashboard...`
      });
    }
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo(0, 0);
  };

  const handleSaveAndExit = () => {
    toast.success('Onboarding údaje uložené', {
      description: 'Môžete pokračovať neskôr z rovnakého miesta'
    });
    navigate('/');
  };

  return {
    totalSteps,
    nextStep,
    prevStep,
    handleComplete,
    handleStepClick,
    handleSaveAndExit,
    isSubmitting
  };
};
