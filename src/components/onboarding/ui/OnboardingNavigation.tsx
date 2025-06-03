
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  onComplete: () => void;
  onSaveAndExit: () => void;
}

const OnboardingNavigation = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
  onComplete,
  onSaveAndExit
}: OnboardingNavigationProps) => {
  return (
    <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm p-6 sticky bottom-0">
      <div className="max-w-4xl mx-auto flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Späť
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onSaveAndExit}
            className="hover:bg-slate-50"
          >
            Uložiť a ukončiť
          </Button>
          
          {currentStep === totalSteps - 1 ? (
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              Dokončiť registráciu
              <Check className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={onNextStep}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
            >
              Ďalej
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingNavigation;
