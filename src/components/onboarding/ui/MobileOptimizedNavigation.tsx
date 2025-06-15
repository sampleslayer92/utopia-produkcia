
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Loader2, Save, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileOptimizedNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  onComplete: () => void;
  onSaveAndExit: () => void;
  onSaveSignature?: () => void;
  isSubmitting?: boolean;
  stepValidation?: {
    isValid: boolean;
    errors: any[];
    warnings: any[];
    completionPercentage: number;
  };
}

const MobileOptimizedNavigation = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
  onComplete,
  onSaveAndExit,
  onSaveSignature,
  isSubmitting = false,
  stepValidation
}: MobileOptimizedNavigationProps) => {
  const { t } = useTranslation(['common', 'notifications']);
  const isMobile = useIsMobile();
  const isConsentsStep = currentStep === totalSteps - 1;
  
  if (!isMobile) {
    // Desktop navigation (existing design)
    return (
      <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm p-6 sticky bottom-0">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onPrevStep}
            disabled={currentStep === 0 || isSubmitting}
            className="flex items-center gap-2 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('common:buttons.back')}
          </Button>
          
          <div className="flex items-center gap-3">
            {stepValidation && (
              <Badge variant="outline" className="text-blue-600">
                {stepValidation.completionPercentage}% dokončené
              </Badge>
            )}
            
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
                disabled={isSubmitting || (stepValidation && !stepValidation.isValid)}
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
                disabled={isSubmitting || (stepValidation && stepValidation.errors.length > 0)}
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
  }

  // Mobile navigation
  return (
    <div className="border-t border-slate-200 bg-white/95 backdrop-blur-sm p-4 sticky bottom-0 z-50">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevStep}
          disabled={currentStep === 0 || isSubmitting}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Späť
        </Button>

        <div className="flex items-center gap-2">
          {stepValidation && (
            <Badge variant="outline" className="text-xs">
              {stepValidation.completionPercentage}%
            </Badge>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetHeader>
                <SheetTitle>Možnosti</SheetTitle>
              </SheetHeader>
              <div className="grid gap-3 py-4">
                <Button
                  variant="outline"
                  onClick={onSaveAndExit}
                  disabled={isSubmitting}
                  className="justify-start"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {t('common:buttons.saveAndExit')}
                </Button>
                
                {isConsentsStep && onSaveSignature && (
                  <Button
                    onClick={onSaveSignature}
                    disabled={isSubmitting}
                    variant="outline"
                    className="justify-start"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {t('common:buttons.saveSignature')}
                  </Button>
                )}
                
                {stepValidation && stepValidation.errors.length > 0 && (
                  <div className="text-sm text-red-600 p-3 bg-red-50 rounded-md">
                    <div className="font-medium mb-1">Opravte chyby:</div>
                    <ul className="text-xs space-y-1">
                      {stepValidation.errors.slice(0, 3).map((error, index) => (
                        <li key={index}>• {error.message}</li>
                      ))}
                      {stepValidation.errors.length > 3 && (
                        <li>• a ďalšie {stepValidation.errors.length - 3} chýb...</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {isConsentsStep ? (
          <Button
            onClick={onComplete}
            disabled={isSubmitting || (stepValidation && !stepValidation.isValid)}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Odosielam
              </>
            ) : (
              <>
                Dokončiť
                <Check className="ml-1 h-3 w-3" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onNextStep}
            disabled={isSubmitting || (stepValidation && stepValidation.errors.length > 0)}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Ďalej
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileOptimizedNavigation;
