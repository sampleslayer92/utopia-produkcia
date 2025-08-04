
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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
import { useContractData } from "@/hooks/useContractData";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
    fields: Array<{
      id?: string;
      fieldKey: string;
      fieldLabel: string;
      fieldType: string;
      isRequired: boolean;
      isEnabled: boolean;
      position?: number;
      fieldOptions?: any;
    }>;
  }>;
}

const OnboardingFlow = ({ isAdminMode = false, customSteps }: OnboardingFlowProps) => {
  const { t } = useTranslation(['common', 'notifications']);
  const { contractId: urlContractId } = useParams<{ contractId: string }>();
  const { user } = useAuth();
  const { onboardingData, updateData, markStepAsVisited, clearData } = useOnboardingData(isAdminMode);
  const [currentStep, setCurrentStep] = useState(onboardingData.currentStep);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date>();
  const [isSharedMode, setIsSharedMode] = useState(false);
  
  const { createContract, isCreating } = useContractCreation();
  const { saveContractData } = useContractPersistence();
  const { overallProgress } = useProgressTracking(onboardingData, currentStep);
  const stepValidation = useStepValidation(currentStep, onboardingData);
  const isMobile = useIsMobile();
  const defaultSteps = useOnboardingSteps();
  
  // Load contract data if contractId is provided in URL
  const contractDataResult = useContractData(urlContractId || '');
  
  // Check if user is accessing shared link
  useEffect(() => {
    if (urlContractId && !user) {
      setIsSharedMode(true);
    }
  }, [urlContractId, user]);
  
  // Load contract data when available
  useEffect(() => {
    if (contractDataResult.data && !contractDataResult.isLoading) {
      const { onboardingData: loadedData } = contractDataResult.data;
      updateData(loadedData);
      setCurrentStep(loadedData.currentStep || 0);
    }
  }, [contractDataResult.data, contractDataResult.isLoading, updateData]);
  
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
    // In shared mode, prevent updates to restricted steps
    if (isSharedMode && (currentStep === 3 || currentStep === 4)) {
      return; // Prevent updates to Device Selection and Fees steps
    }
    updateData({ ...data, currentStep });
  }, [updateData, currentStep, isSharedMode]);

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
  
  // Show loading while loading contract data
  if (urlContractId && contractDataResult.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Načítavam údaje formulára...</p>
        </div>
      </div>
    );
  }
  
  // Show error if contract not found
  if (urlContractId && contractDataResult.isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Formulár nenájdený</h2>
          <p className="text-slate-600 mb-4">Požadovaný formulár neexistuje alebo bol odstránený.</p>
        </div>
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

              {/* Shared mode notification */}
              {isSharedMode && (
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Prezeráte zdieľaný formulár. Kroky "Zariadenia a služby" a "Poplatky" môže upravovať len prihlásený používateľ v portáli.
                  </AlertDescription>
                </Alert>
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
                isReadOnly={isSharedMode && (currentStep === 3 || currentStep === 4)}
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

            {/* Shared mode notification */}
            {isSharedMode && (
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Prezeráte zdieľaný formulár. Kroky "Zariadenia a služby" a "Poplatky" môže upravovať len prihlásený používateľ v portáli.
                </AlertDescription>
              </Alert>
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
              isReadOnly={isSharedMode && (currentStep === 3 || currentStep === 4)}
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
