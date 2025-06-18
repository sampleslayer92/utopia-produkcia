
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Loader2, Save, RefreshCw } from "lucide-react";

interface StepValidation {
  isValid: boolean;
  completionPercentage: number;
  requiredFields: string[];
  missingFields: string[];
}

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  onComplete: () => void;
  onSaveAndExit: () => void;
  onSaveSignature?: () => void;
  onChangeSolution?: () => void;
  isSubmitting?: boolean;
  stepValidation: StepValidation;
}

const OnboardingNavigation = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
  onComplete,
  onSaveAndExit,
  onSaveSignature,
  onChangeSolution,
  isSubmitting = false,
  stepValidation
}: OnboardingNavigationProps) => {
  const { t } = useTranslation(['common', 'notifications']);
  const isConsentsStep = currentStep === totalSteps - 1;
  const isDeviceSelectionStep = currentStep === 3;
  
  // For presentation: steps 2 and 3 should always allow proceeding
  const isPresentationStep = currentStep === 2 || currentStep === 3;
  const canProceed = isPresentationStep || stepValidation.isValid;
  
  // Debug logging for presentation steps
  if (isPresentationStep) {
    console.log(`=== NAVIGATION DEBUG: Step ${currentStep} ===`);
    console.log('isPresentationStep:', isPresentationStep);
    console.log('stepValidation.isValid:', stepValidation.isValid);
    console.log('canProceed:', canProceed);
    console.log('stepValidation.completionPercentage:', stepValidation.completionPercentage);
    console.log('stepValidation.missingFields:', stepValidation.missingFields);
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/90 backdrop-blur-sm p-6 z-50">
      <div className="max-w-7xl mx-auto flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevStep}
          disabled={currentStep === 0 || isSubmitting}
          className="flex items-center gap-2 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('common:buttons.back')}
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onSaveAndExit}
            disabled={isSubmitting}
            className="hover:bg-slate-50"
          >
            {t('common:buttons.saveAndExit')}
          </Button>
          
          {isDeviceSelectionStep && onChangeSolution && (
            <Button
              variant="outline"
              onClick={onChangeSolution}
              disabled={isSubmitting}
              className="text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Zmeniť riešenie
            </Button>
          )}
          
          {isConsentsStep && onSaveSignature && (
            <Button
              onClick={onSaveSignature}
              disabled={isSubmitting}
              variant="outline"
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <Save className="mr-2 h-4 w-4" />
              {t('common:buttons.saveSignature')}
            </Button>
          )}
          
          {isConsentsStep ? (
            <Button
              onClick={onComplete}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common:status.submitting')}
                </>
              ) : (
                <>
                  {t('common:buttons.complete')}
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onNextStep}
              disabled={isSubmitting || !canProceed}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {currentStep === 0 ? 'Vytvára sa zmluva...' : t('common:status.saving')}
                </>
              ) : (
                <>
                  {t('common:buttons.next')}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingNavigation;
