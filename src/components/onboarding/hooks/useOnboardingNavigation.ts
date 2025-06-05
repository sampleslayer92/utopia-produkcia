
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OnboardingData } from "@/types/onboarding";
import { onboardingSteps } from "../config/onboardingSteps";
import { useContractSubmission } from "@/hooks/useContractSubmission";

export const useOnboardingNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  onboardingData: OnboardingData,
  clearData: () => void,
  markStepAsVisited: (stepNumber: number) => void
) => {
  const navigate = useNavigate();
  const totalSteps = onboardingSteps.length;
  const { submitContract, isSubmitting } = useContractSubmission();

  const nextStep = () => {
    // Mark current step as visited before moving to next
    markStepAsVisited(currentStep);
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleComplete = async () => {
    // Mark final step as visited
    markStepAsVisited(currentStep);
    
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
      localStorage.setItem('utopia_user_role', 'admin');
      
      // Clear onboarding data
      clearData();
      
      // Navigate to admin dashboard instead of merchant
      navigate('/admin');
      
      toast.success('Registrácia dokončená!', {
        description: `Číslo zmluvy: ${result.contractNumber}. Presmerováva sa na admin dashboard...`
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

  const handleSaveSignature = () => {
    // Mark step 7 (Consents) as visited when signature is saved
    markStepAsVisited(7);
    toast.success('Podpis uložený', {
      description: 'Elektronický podpis bol úspešne uložený'
    });
  };

  return {
    totalSteps,
    nextStep,
    prevStep,
    handleComplete,
    handleStepClick,
    handleSaveAndExit,
    handleSaveSignature,
    isSubmitting
  };
};
