
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OnboardingData } from "@/types/onboarding";
import { onboardingSteps } from "../config/onboardingSteps";
import { useContractSubmission } from "@/hooks/useContractSubmission";
import { useAuth } from "@/contexts/AuthContext";

export const useOnboardingNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  onboardingData: OnboardingData,
  clearData: () => void,
  markStepAsVisited: (stepNumber: number) => void,
  createContract: () => Promise<any>,
  updateData: (data: Partial<OnboardingData>) => void,
  isBasicInfoComplete: boolean,
  onStepNavigate?: (fromStep: number, toStep: number) => void, // New callback for step navigation
  isAdminMode: boolean = false // New parameter for admin mode
) => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const totalSteps = 7; // Updated from 8 to 7 steps
  const { submitContract, isSubmitting } = useContractSubmission();

  const nextStep = async () => {
    const nextStepNumber = currentStep + 1;
    
    // Call the step navigation callback if provided (for triggering auto-fill)
    if (onStepNavigate) {
      onStepNavigate(currentStep, nextStepNumber);
    }
    
    // Mark current step as visited before moving to next
    markStepAsVisited(currentStep);
    
    // If moving from step 0 to step 1 and no contract exists yet, create it
    if (currentStep === 0 && !onboardingData.contractId && isBasicInfoComplete) {
      console.log('Creating contract before moving to step 1...');
      
      try {
        const result = await createContract();
        
        if (result.success) {
          updateData({
            contractId: result.contractId,
            contractNumber: result.contractNumber?.toString()
          });
          toast.success('Zmluva vytvorená!', {
            description: `Číslo zmluvy: ${result.contractNumber}`
          });
        } else {
          toast.error('Chyba pri vytváraní zmluvy', {
            description: 'Skúste to prosím znova'
          });
          return; // Don't proceed to next step if contract creation failed
        }
      } catch (error) {
        console.error('Failed to create contract:', error);
        toast.error('Chyba pri vytváraní zmluvy', {
          description: 'Skúste to prosím znova'
        });
        return; // Don't proceed to next step if contract creation failed
      }
    }
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(nextStepNumber);
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
      
      // Clear onboarding data
      clearData();
      
      // Navigate based on user role
      const currentRole = userRole?.role;
      let redirectPath = '/admin'; // default fallback
      
      if (currentRole === 'partner') {
        redirectPath = '/partner';
      } else if (currentRole === 'merchant') {
        redirectPath = '/merchant';
      } else if (currentRole === 'admin') {
        redirectPath = '/admin';
      }
      
      // Navigate to appropriate dashboard
      navigate(redirectPath);
      
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
    
    // Navigate based on user role or mode
    const currentRole = userRole?.role;
    
    if (isAdminMode) {
      navigate('/admin');
    } else if (currentRole === 'partner') {
      navigate('/partner');
    } else if (currentRole === 'merchant') {
      navigate('/merchant');
    } else {
      navigate('/');
    }
  };

  const handleSaveSignature = () => {
    // Mark step 6 (Consents) as visited when signature is saved
    markStepAsVisited(6);
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
