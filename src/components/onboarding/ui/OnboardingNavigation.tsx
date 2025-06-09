
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Loader2, Save } from "lucide-react";

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  onComplete: () => void;
  onSaveAndExit: () => void;
  onSaveSignature?: () => void;
  isSubmitting?: boolean;
}

const OnboardingNavigation = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
  onComplete,
  onSaveAndExit,
  onSaveSignature,
  isSubmitting = false
}: OnboardingNavigationProps) => {
  const { t } = useTranslation(['common', 'notifications']);
  const isConsentsStep = currentStep === totalSteps - 1;
  
  return (
    <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm p-6 sticky bottom-0">
      <div className="max-w-5xl mx-auto flex justify-between">
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
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
            >
              {t('common:buttons.next')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingNavigation;
