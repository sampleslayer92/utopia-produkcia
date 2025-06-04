
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OnboardingData } from "@/types/onboarding";
import { onboardingSteps } from "../config/onboardingSteps";
import { useContractSubmission } from "@/hooks/useContractSubmission";
import { useUserManagement } from "@/hooks/useUserManagement";

export const useOnboardingNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  onboardingData: OnboardingData,
  clearData: () => void
) => {
  const navigate = useNavigate();
  const totalSteps = onboardingSteps.length;
  const { submitContract, isSubmitting } = useContractSubmission();
  const { createMerchantAccount, isCreatingUser } = useUserManagement();

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
    
    // If contract is not signed yet, cannot complete
    if (!onboardingData.consents.isSigned) {
      toast.error("Musíte najprv podpísať zmluvu");
      return;
    }
    
    // Submit contract to Supabase
    const result = await submitContract(onboardingData);
    
    if (result.success) {
      // Create merchant account
      const userResult = await createMerchantAccount(onboardingData);
      
      if (userResult.success) {
        // Store success data for redirect
        const contractData = {
          ...onboardingData,
          completedAt: new Date().toISOString(),
          status: 'signed',
          contractId: result.contractId,
          contractNumber: result.contractNumber
        };
        
        localStorage.setItem('contract_data', JSON.stringify(contractData));
        localStorage.setItem('utopia_user_role', 'merchant');
        localStorage.setItem('utopia_user_email', onboardingData.contactInfo.email);
        
        // Clear onboarding data
        clearData();
        
        // Navigate to merchant dashboard
        navigate('/merchant');
        
        toast.success('Registrácia dokončená!', {
          description: `Číslo zmluvy: ${result.contractNumber}. Váš účet bol vytvorený.`
        });
      }
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
    isSubmitting: isSubmitting || isCreatingUser
  };
};
