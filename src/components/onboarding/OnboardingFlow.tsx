
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useOnboardingData } from "./hooks/useOnboardingData";
import { useOnboardingNavigation } from "./hooks/useOnboardingNavigation";
import { useAutoSave } from "./hooks/useAutoSave";
import { useProgressTracking } from "./hooks/useProgressTracking";
import { useStepValidation } from "./hooks/useStepValidation";
import { useOnboardingSteps } from "./config/onboardingSteps";
import OnboardingTopBar from "./ui/OnboardingTopBar";
import OnboardingNavigation from "./ui/OnboardingNavigation";
import MobileOptimizedNavigation from "./ui/MobileOptimizedNavigation";
import OnboardingHeader from "./ui/OnboardingHeader";
import OnboardingStepRenderer from "./components/OnboardingStepRenderer";
import { OnboardingErrorBoundary } from "./components/OnboardingErrorBoundary";
import AutoSaveIndicator from "./ui/AutoSaveIndicator";
import MobileStepper from "./ui/MobileStepper";
import { useContractCreation } from "@/hooks/useContractCreation";
import { useContractPersistence } from "@/hooks/useContractPersistence";
import { useIsMobile } from "@/hooks/use-mobile";

interface OnboardingFlowProps {
  isAdminMode?: boolean;
  customSteps?: Array<{
    id: string;
    stepKey: string;
    title: string;
    description: string;
    position: number;
    isEnabled: boolean;
    isRequired: boolean;
  }>;
}

const OnboardingFlow = ({ isAdminMode = false, customSteps }: OnboardingFlowProps) => {
  const { t } = useTranslation(['common', 'notifications']);
  const { onboardingData, updateData, markStepAsVisited, clearData } = useOnboardingData();
  const [currentStep, setCurrentStep] = useState(onboardingData.currentStep);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date>();
  
  const { createContract, isCreating } = useContractCreation();
  const { saveContractData } = useContractPersistence();
  const { overallProgress } = useProgressTracking(onboardingData, currentStep);
  const stepValidation = useStepValidation(currentStep, onboardingData);
  const isMobile = useIsMobile();
  const defaultSteps = useOnboardingSteps();
  
  // Use custom steps in admin mode if provided, otherwise use default steps
  const onboardingSteps = useMemo(() => {
    if (isAdminMode && customSteps) {
      // Convert custom steps to the format expected by the UI
      return customSteps
        .filter(step => step.isEnabled)
        .sort((a, b) => a.position - b.position)
        .map((step, index) => ({
          number: index,
          title: step.title,
          description: step.description
        }));
    }
    return defaultSteps;
  }, [isAdminMode, customSteps, defaultSteps]);

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

  // Enhanced step navigation callback for auto-fill
  const handleStepNavigation = useCallback((fromStep: number, toStep: number) => {
    console.log('Step navigation triggered:', { fromStep, toStep });
    
    // This callback will be passed to useOnboardingNavigation
    // and will trigger auto-fill in OnboardingStepRenderer
  }, []);

  const {
    totalSteps,
    nextStep,
    prevStep,
    handleComplete,
    handleStepClick,
    handleSaveAndExit,
    handleSaveSignature,
    isSubmitting
  } = useOnboardingNavigation(
    currentStep, 
    setCurrentStep, 
    onboardingData, 
    clearData, 
    markStepAsVisited,
    createContract,
    updateData,
    isBasicInfoComplete,
    handleStepNavigation, // Pass the callback
    isAdminMode // Pass admin mode flag
  );

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

  const handleUpdateData = useCallback((data: any) => {
    updateData({ ...data, currentStep });
  }, [updateData, currentStep]);

  const handleContractDeleted = useCallback(() => {
    clearData();
    setCurrentStep(0);
    setAutoSaveStatus('idle');
    setLastSaved(undefined);
  }, [clearData]);

  const handleErrorReset = useCallback(() => {
    setAutoSaveStatus('idle');
  }, []);

  const handleChangeSolution = useCallback(() => {
    updateData({
      deviceSelection: {
        ...onboardingData.deviceSelection,
        selectedSolutions: []
      }
    });
  }, [updateData, onboardingData.deviceSelection]);

  const currentStepData = onboardingSteps[currentStep];

  // If in admin mode, render simplified layout
  if (isAdminMode) {
    return (
      <OnboardingErrorBoundary onReset={handleErrorReset}>
        <div className="flex flex-col min-h-full">
          {/* Mobile Stepper for admin mode */}
          {isMobile && (
            <MobileStepper
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepTitle={currentStepData?.title || t('common:navigation.step')}
              progress={stepValidation.completionPercentage}
              onBack={prevStep}
              showBackButton={currentStep > 0}
            />
          )}
          
          {/* Desktop Top Bar for admin mode */}
          {!isMobile && (
            <OnboardingTopBar
              currentStep={currentStep}
              steps={onboardingSteps}
              onStepClick={handleStepClick}
              onboardingData={onboardingData}
            />
          )}
          
          {/* Main Content - flex-1 to take remaining space */}
          <div className="flex-1 py-6">
            <div className="max-w-7xl mx-auto px-6">
              {/* Auto-save indicator - Hide on mobile */}
              {!isMobile && (
                <div className="flex justify-end items-center mb-4">
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
                onStepNavigate={handleStepNavigation}
                customSteps={isAdminMode ? customSteps : undefined}
              />
            </div>
          </div>
          
          {/* Desktop Navigation for admin mode - NOT FIXED POSITION */}
          {!isMobile && (
            <div className="border-t border-slate-200 bg-white py-6">
              <div className="max-w-7xl mx-auto px-6">
                <OnboardingNavigation
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  onPrevStep={prevStep}
                  onNextStep={nextStep}
                  onComplete={handleComplete}
                  onSaveAndExit={handleSaveAndExit}
                  onSaveSignature={handleSaveSignature}
                  onChangeSolution={handleChangeSolution}
                  isSubmitting={isSubmitting || isSaving}
                  stepValidation={stepValidation}
                  isAdminMode={isAdminMode}
                />
              </div>
            </div>
          )}
          
          {/* Mobile Navigation for admin mode - NOT FIXED POSITION */}
          {isMobile && (
            <div className="border-t border-slate-200 bg-white p-4">
              <MobileOptimizedNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                onPrevStep={prevStep}
                onNextStep={nextStep}
                onComplete={handleComplete}
                onSaveAndExit={handleSaveAndExit}
                onSaveSignature={handleSaveSignature}
                onChangeSolution={handleChangeSolution}
                isSubmitting={isSubmitting || isSaving}
                stepValidation={stepValidation}
                isAdminMode={isAdminMode}
              />
            </div>
          )}
        </div>
      </OnboardingErrorBoundary>
    );
  }

  // Original standalone onboarding layout
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
            stepTitle={currentStepData?.title || t('common:navigation.step')}
            progress={stepValidation.completionPercentage}
            onBack={prevStep}
            showBackButton={currentStep > 0}
          />
        )}
        
        {/* Desktop Top Bar */}
        {!isMobile && (
          <OnboardingTopBar
            currentStep={currentStep}
            steps={onboardingSteps}
            onStepClick={handleStepClick}
            onboardingData={onboardingData}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 pb-24">
          <div className="max-w-7xl mx-auto">
            {/* Auto-save indicator - Hide on mobile */}
            {!isMobile && (
              <div className="flex justify-end items-center mb-4">
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
              onStepNavigate={handleStepNavigation}
              customSteps={undefined}
            />
          </div>
        </div>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <OnboardingNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onComplete={handleComplete}
            onSaveAndExit={handleSaveAndExit}
            onSaveSignature={handleSaveSignature}
            onChangeSolution={handleChangeSolution}
            isSubmitting={isSubmitting || isSaving}
            stepValidation={stepValidation}
          />
        )}
        
        {/* Mobile Navigation */}
        <MobileOptimizedNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onComplete={handleComplete}
          onSaveAndExit={handleSaveAndExit}
          onSaveSignature={handleSaveSignature}
          onChangeSolution={handleChangeSolution}
          isSubmitting={isSubmitting || isSaving}
          stepValidation={stepValidation}
        />
      </div>
    </OnboardingErrorBoundary>
  );
};

export default OnboardingFlow;
