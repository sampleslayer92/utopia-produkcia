
import { useState, useEffect } from "react";
import { useOnboardingData } from "./hooks/useOnboardingData";
import { useOnboardingNavigation } from "./hooks/useOnboardingNavigation";
import { useAutoSave } from "./hooks/useAutoSave";
import { useProgressTracking } from "./hooks/useProgressTracking";
import { onboardingSteps } from "./config/onboardingSteps";
import OnboardingSidebar from "./ui/OnboardingSidebar";
import OnboardingNavigation from "./ui/OnboardingNavigation";
import OnboardingHeader from "./ui/OnboardingHeader";
import OnboardingStepRenderer from "./components/OnboardingStepRenderer";
import { OnboardingErrorBoundary } from "./components/OnboardingErrorBoundary";
import OnboardingLoadingState from "./ui/OnboardingLoadingState";
import AutoSaveIndicator from "./ui/AutoSaveIndicator";
import { useContractCreation } from "@/hooks/useContractCreation";
import { useContractPersistence } from "@/hooks/useContractPersistence";
import { toast } from "sonner";

const OnboardingFlow = () => {
  const { onboardingData, updateData, clearData } = useOnboardingData();
  const [currentStep, setCurrentStep] = useState(onboardingData.currentStep);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date>();
  
  const { createContract, isCreating } = useContractCreation();
  const { saveContractData } = useContractPersistence();
  const { overallProgress } = useProgressTracking(onboardingData, currentStep);

  const {
    totalSteps,
    nextStep,
    prevStep,
    handleComplete,
    handleStepClick,
    handleSaveAndExit,
    isSubmitting
  } = useOnboardingNavigation(currentStep, setCurrentStep, onboardingData, clearData);

  // Auto-save functionality
  const handleAutoSave = async (data: typeof onboardingData) => {
    if (!data.contractId) return;
    
    setAutoSaveStatus('saving');
    try {
      await saveContractData(data.contractId, data);
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
      throw error;
    }
  };

  const { isSaving } = useAutoSave(onboardingData, {
    enabled: Boolean(onboardingData.contractId),
    onSave: handleAutoSave,
    onError: () => setAutoSaveStatus('error')
  });

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
        setIsLoading(true);
        
        try {
          const result = await createContract();
          
          if (result.success) {
            updateData({
              contractId: result.contractId,
              contractNumber: result.contractNumber?.toString()
            });
            toast.success('Zmluva bola vytvorená');
          }
        } catch (error) {
          console.error('Failed to create contract:', error);
          toast.error('Nepodarilo sa vytvoriť zmluvu');
        } finally {
          setIsLoading(false);
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
    setAutoSaveStatus('idle');
    setLastSaved(undefined);
  };

  const handleErrorReset = () => {
    setAutoSaveStatus('idle');
    setIsLoading(false);
  };

  if (isLoading) {
    return <OnboardingLoadingState type="full" />;
  }

  return (
    <OnboardingErrorBoundary onReset={handleErrorReset}>
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
            onboardingData={onboardingData}
          />
          
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Progress and Auto-save indicator */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-slate-600">
                  Celkový postup: {overallProgress.overallPercentage}% 
                  ({overallProgress.completedSteps}/{overallProgress.totalSteps} krokov)
                </div>
                
                <AutoSaveIndicator 
                  status={autoSaveStatus}
                  lastSaved={lastSaved}
                />
              </div>

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
          isSubmitting={isSubmitting || isSaving}
        />
      </div>
    </OnboardingErrorBoundary>
  );
};

export default OnboardingFlow;
