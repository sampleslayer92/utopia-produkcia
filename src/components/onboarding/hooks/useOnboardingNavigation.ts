
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
    
    // Check if contract is signed
    if (!onboardingData.consents.isSigned) {
      toast.error("Zmluva musí byť podpísaná pred dokončením registrácie");
      return;
    }
    
    if (!onboardingData.contractId) {
      toast.error("Chyba: ID zmluvy nebolo nájdené");
      return;
    }
    
    try {
      // Submit contract to Supabase
      console.log('Ukladám zmluvu do databázy...');
      const contractResult = await submitContract(onboardingData);
      
      if (!contractResult.success) {
        toast.error("Chyba pri ukladaní zmluvy", {
          description: "Skúste to znovu alebo kontaktujte podporu"
        });
        return;
      }
      
      // Create merchant account
      console.log('Vytváram merchant účet...');
      const userResult = await createMerchantAccount(onboardingData);
      
      if (userResult.success) {
        // Store success data for potential future use
        const contractData = {
          ...onboardingData,
          completedAt: new Date().toISOString(),
          status: 'signed',
          contractId: contractResult.contractId,
          contractNumber: contractResult.contractNumber
        };
        
        localStorage.setItem('contract_data', JSON.stringify(contractData));
        
        // Clear onboarding data
        clearData();
        
        // Navigate to merchant dashboard
        navigate('/merchant');
        
        toast.success('Registrácia úspešne dokončená!', {
          description: `Číslo zmluvy: ${contractResult.contractNumber}. Váš účet bol vytvorený.`
        });
      } else {
        toast.error("Chyba pri vytváraní účtu", {
          description: "Zmluva bola uložená, ale nepodarilo sa vytvoriť účet"
        });
      }
    } catch (error) {
      console.error('Chyba pri dokončovaní onboardingu:', error);
      toast.error("Neočakávaná chyba", {
        description: "Skúste to znovu alebo kontaktujte podporu"
      });
    }
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo(0, 0);
  };

  const handleSaveAndExit = () => {
    toast.success('Pokrok uložený', {
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
