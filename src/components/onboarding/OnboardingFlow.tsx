
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
import AutoSaveIndicator from "./ui/AutoSaveIndicator";
import MobileStepper from "./ui/MobileStepper";
import { useContractCreation } from "@/hooks/useContractCreation";
import { useContractPersistence } from "@/hooks/useContractPersistence";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const OnboardingFlow = () => {
  const { t } = useTranslation();
  const { onboardingData, updateData, markStepAsVisited, clearData } = useOnboardingData();
  const [currentStep, setCurrentStep] = useState(onboardingData.currentStep);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date>();
  const [contractCreationAttempted, setContractCreationAttempted] = useState(false);
  
  const { createContract, isCreating } = useContractCreation();
  const { saveContractData } = useContractPersistence();
  const { overallProgress } = useProgressTracking(onboardingData, currentStep);
  const isMobile = useIsMobile();

  const {
    totalSteps,
    nextStep,
    prevStep,
    handleComplete,
    handleStepClick,
    handleSaveAndExit,
    handleSaveSignature,
    isSubmitting
  } = useOnboardingNavigation(currentStep, setCurrentStep, onboardingData, clearData, markStepAsVisited);

  const isBasicInfoComplete = useMemo(() => {
    const { contactInfo } = onboardingData;
    const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    return Boolean(
      contactInfo.firstName?.trim() &&
      contactInfo.lastName?.trim() &&
      contactInfo.email?.trim() &&
      isEmailValid(contactInfo.email) &&
      contactInfo.phone?.trim()
    );
  }, [
    onboardingData.contactInfo.firstName,
    onboardingData.contactInfo.lastName,
    onboardingData.contactInfo.email,
    onboardingData.contactInfo.phone
  ]);

  const handleAutoSave = useCallback(async (data: typeof onboardingData) => {
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
  }, [saveContractData]);

  const { isSaving } = useAutoSave(onboardingData, {
    enabled: Boolean(onboardingData.contractId),
    onSave: handleAutoSave,
    onError: () => setAutoSaveStatus('error')
  });

  useEffect(() => {
    if (!isBasicInfoComplete || onboardingData.contractId || isCreating || contractCreationAttempted) {
      return;
    }

    const createContractWithDelay = async () => {
      console.log('Basic contact info complete, creating contract...');
      setContractCreationAttempted(true);
      
      try {
        const result = await createContract();
        
        if (result.success) {
          updateData({
            contractId: result.contractId,
            contractNumber: result.contractNumber?.toString()
          });
          toast.success(t('onboarding.messages.contractCreationSuccess'));
        }
      } catch (error) {
        console.error('Failed to create contract:', error);
        toast.error(t('onboarding.messages.contractCreationError'));
        setContractCreationAttempted(false);
      }
    };

    const timeoutId = setTimeout(createContractWithDelay, 500);
    return () => clearTimeout(timeoutId);
  }, [
    isBasicInfoComplete,
    onboardingData.contractId,
    isCreating,
    contractCreationAttempted,
    createContract,
    updateData,
    t
  ]);

  const handleUpdateData = useCallback((data: any) => {
    updateData({ ...data, currentStep });
  }, [updateData, currentStep]);

  const handleContractDeleted = useCallback(() => {
    clearData();
    setCurrentStep(0);
    setAutoSaveStatus('idle');
    setLastSaved(undefined);
    setContractCreationAttempted(false);
  }, [clearData]);

  const handleErrorReset = useCallback(() => {
    setAutoSaveStatus('idle');
    setContractCreationAttempted(false);
  }, []);

  const currentStepData = onboardingSteps[currentStep];

  return (
    <OnboardingErrorBoundary onReset={handleErrorReset}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <OnboardingHeader 
          contractNumber={onboardingData.contractNumber} 
          contractId={onboardingData.contractId}
          onContractDeleted={handleContractDeleted}
          isCreatingContract={isCreating}
        />
        
        {/* Mobile Stepper */}
        {isMobile && (
          <MobileStepper
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepTitle={t(currentStepData?.title) || t('onboarding.steps.contactInfo.title')}
            progress={overallProgress.overallPercentage}
            onBack={prevStep}
            showBackButton={currentStep > 0}
          />
        )}
        
        <div className="flex">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <OnboardingSidebar
              currentStep={currentStep}
              steps={onboardingSteps}
              onStepClick={handleStepClick}
              onboardingData={onboardingData}
            />
          )}
          
          <div className="flex-1 p-4 md:p-6">
            <div className="max-w-5xl mx-auto">
              {/* Progress and Auto-save indicator - Hide on mobile */}
              {!isMobile && (
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-slate-600">
                    {t('onboarding.navigation.overallProgress')}: {overallProgress.overallPercentage}% 
                    ({overallProgress.completedSteps}/{overallProgress.totalSteps} {t('onboarding.navigation.stepsCompleted')})
                  </div>
                  
                  <AutoSaveIndicator 
                    status={autoSaveStatus}
                    lastSaved={lastSaved}
                  />
                </div>
              )}

              <OnboardingStepRenderer
                currentStep={currentStep}
                data={onboardingData}
                updateData={handleUpdateData}
                onNext={nextStep}
                onPrev={prevStep}
                onComplete={handleComplete}
                onSaveSignature={handleSaveSignature}
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
          onSaveSignature={handleSaveSignature}
          isSubmitting={isSubmitting || isSaving}
        />
      </div>
    </OnboardingErrorBoundary>
  );
};

export default OnboardingFlow;
