
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Loader2, Save, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface StepValidation {
  isValid: boolean;
  completionPercentage: number;
  requiredFields: string[];
  missingFields: string[];
}

interface MobileOptimizedNavigationProps {
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
  isAdminMode?: boolean;
}

const MobileOptimizedNavigation = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
  onComplete,
  onSaveAndExit,
  onSaveSignature,
  onChangeSolution,
  isSubmitting = false,
  stepValidation,
  isAdminMode = false
}: MobileOptimizedNavigationProps) => {
  const { t } = useTranslation(['common', 'notifications']);
  const isMobile = useIsMobile();
  const isConsentsStep = currentStep === totalSteps - 1;
  const isDeviceSelectionStep = currentStep === 3;
  
  // For presentation: steps 1, 2 and 3 should always allow proceeding
  const isPresentationStep = currentStep === 1 || currentStep === 2 || currentStep === 3;
  const canProceed = isPresentationStep || stepValidation.isValid;
  
  // Debug logging for presentation steps
  if (isPresentationStep && isMobile) {
    console.log(`=== MOBILE NAVIGATION DEBUG: Step ${currentStep} ===`);
    console.log('isPresentationStep:', isPresentationStep);
    console.log('stepValidation.isValid:', stepValidation.isValid);
    console.log('canProceed:', canProceed);
    console.log('stepValidation.missingFields:', stepValidation.missingFields);
  }
  
  if (!isMobile) return null;

  // In admin mode, don't use fixed position
  if (isAdminMode) {
    return (
      <div className="flex justify-between items-center gap-3">
        <Button
          variant="outline"
          onClick={onPrevStep}
          disabled={currentStep === 0 || isSubmitting}
          className="flex items-center gap-2 hover:bg-slate-50 flex-shrink-0"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('common:buttons.back')}
        </Button>
        
        <div className="flex space-x-2 flex-shrink-0">
          {isDeviceSelectionStep && onChangeSolution && (
            <Button
              onClick={onChangeSolution}
              disabled={isSubmitting}
              variant="outline"
              size="sm"
              className="text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Zmeniť
            </Button>
          )}
          
          {isConsentsStep && onSaveSignature && (
            <Button
              onClick={onSaveSignature}
              disabled={isSubmitting}
              variant="outline"
              size="sm"
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <Save className="mr-1 h-3 w-3" />
              {t('common:buttons.saveSignature')}
            </Button>
          )}
          
          {isConsentsStep ? (
            <Button
              onClick={onComplete}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  {t('common:status.submitting')}
                </>
              ) : (
                <>
                  {t('common:buttons.complete')}
                  <Check className="ml-1 h-3 w-3" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onNextStep}
              disabled={isSubmitting || !canProceed}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {currentStep === 0 ? 'Vytvára sa zmluva...' : t('common:status.saving')}
                </>
              ) : (
                <>
                  {t('common:buttons.next')}
                  <ChevronRight className="h-3 w-3" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Original fixed mobile navigation for standalone mode
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur-sm safe-area-inset-bottom z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-3 p-4">
        <Button
          variant="outline"
          onClick={onPrevStep}
          disabled={currentStep === 0 || isSubmitting}
          className="flex items-center gap-2 hover:bg-slate-50 flex-shrink-0"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('common:buttons.back')}
        </Button>
        
        <div className="flex space-x-2 flex-shrink-0">
          {isDeviceSelectionStep && onChangeSolution && (
            <Button
              onClick={onChangeSolution}
              disabled={isSubmitting}
              variant="outline"
              size="sm"
              className="text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Zmeniť
            </Button>
          )}
          
          {isConsentsStep && onSaveSignature && (
            <Button
              onClick={onSaveSignature}
              disabled={isSubmitting}
              variant="outline"
              size="sm"
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <Save className="mr-1 h-3 w-3" />
              {t('common:buttons.saveSignature')}
            </Button>
          )}
          
          {isConsentsStep ? (
            <Button
              onClick={onComplete}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  {t('common:status.submitting')}
                </>
              ) : (
                <>
                  {t('common:buttons.complete')}
                  <Check className="ml-1 h-3 w-3" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onNextStep}
              disabled={isSubmitting || !canProceed}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {currentStep === 0 ? 'Vytvára sa zmluva...' : t('common:status.saving')}
                </>
              ) : (
                <>
                  {t('common:buttons.next')}
                  <ChevronRight className="h-3 w-3" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileOptimizedNavigation;
