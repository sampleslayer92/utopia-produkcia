import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useOnboardingData } from "../hooks/useOnboardingData";
import { useOnboardingNavigation } from "../hooks/useOnboardingNavigation";
import { useAutoSave } from "../hooks/useAutoSave";
import { useProgressTracking } from "../hooks/useProgressTracking";
import { useStepValidation } from "../hooks/useStepValidation";
import { useOnboardingConfig } from "@/hooks/useOnboardingConfig";
import OnboardingTopBar from "../ui/OnboardingTopBar";
import OnboardingNavigation from "../ui/OnboardingNavigation";
import MobileOptimizedNavigation from "../ui/MobileOptimizedNavigation";
import OnboardingHeader from "../ui/OnboardingHeader";
import { OnboardingErrorBoundary } from "../components/OnboardingErrorBoundary";
import AutoSaveIndicator from "../ui/AutoSaveIndicator";
import MobileStepper from "../ui/MobileStepper";
import { useContractCreation } from "@/hooks/useContractCreation";
import { useContractPersistence } from "@/hooks/useContractPersistence";
import { useIsMobile } from "@/hooks/use-mobile";
import DynamicStepRenderer from "./DynamicStepRenderer";

interface ConfigurableOnboardingFlowProps {
  isAdminMode?: boolean;
}

const ConfigurableOnboardingFlow = ({ isAdminMode = false }: ConfigurableOnboardingFlowProps) => {
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
  
  // Load configuration from database
  const { steps: configSteps, loading: configLoading } = useOnboardingConfig();
  
  // Convert database steps to UI format
  const onboardingSteps = useMemo(() => {
    return configSteps
      .filter(step => step.isEnabled)
      .sort((a, b) => a.position - b.position)
      .map((step, index) => ({
        number: index,
        title: step.title,
        description: step.description
      }));
  }, [configSteps]);

  const enabledSteps = useMemo(() => {
    return configSteps
      .filter(step => step.isEnabled)
      .sort((a, b) => a.position - b.position);
  }, [configSteps]);

  const currentStepConfig = enabledSteps[currentStep];

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

  const handleStepNavigation = useCallback((fromStep: number, toStep: number) => {
    console.log('Dynamic step navigation triggered:', { fromStep, toStep });
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
    handleStepNavigation,
    isAdminMode
  );

  // Override totalSteps with configuration
  const actualTotalSteps = enabledSteps.length;

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

  // Show loading while configuration is loading
  if (configLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If in admin mode, render simplified layout
  if (isAdminMode) {
    return (
      <OnboardingErrorBoundary onReset={handleErrorReset}>
        <div className="flex flex-col min-h-full">
          {/* Mobile Stepper for admin mode */}
          {isMobile && (
            <MobileStepper
              currentStep={currentStep}
              totalSteps={actualTotalSteps}
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

              <DynamicStepRenderer
                currentStep={currentStep}
                stepConfig={currentStepConfig}
                data={onboardingData}
                updateData={handleUpdateData}
                onNext={nextStep}
                onPrev={prevStep}
                onComplete={handleComplete}
                onSaveSignature={handleSaveSignature}
                onStepNavigate={handleStepNavigation}
              />
            </div>
          </div>
          
          {/* Desktop Navigation for admin mode */}
          {!isMobile && (
            <div className="border-t border-slate-200 bg-white py-6">
              <div className="max-w-7xl mx-auto px-6">
                <OnboardingNavigation
                  currentStep={currentStep}
                  totalSteps={actualTotalSteps}
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
          
          {/* Mobile Navigation for admin mode */}
          {isMobile && (
            <div className="border-t border-slate-200 bg-white p-4">
              <MobileOptimizedNavigation
                currentStep={currentStep}
                totalSteps={actualTotalSteps}
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
            totalSteps={actualTotalSteps}
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

            <DynamicStepRenderer
              currentStep={currentStep}
              stepConfig={currentStepConfig}
              data={onboardingData}
              updateData={handleUpdateData}
              onNext={nextStep}
              onPrev={prevStep}
              onComplete={handleComplete}
              onSaveSignature={handleSaveSignature}
              onStepNavigate={handleStepNavigation}
            />
          </div>
        </div>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <OnboardingNavigation
            currentStep={currentStep}
            totalSteps={actualTotalSteps}
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
          totalSteps={actualTotalSteps}
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

export default ConfigurableOnboardingFlow;