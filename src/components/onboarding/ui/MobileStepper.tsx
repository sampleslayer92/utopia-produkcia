
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileStepperProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  progress: number;
  onBack?: () => void;
  showBackButton?: boolean;
}

const MobileStepper = ({ 
  currentStep, 
  totalSteps, 
  stepTitle, 
  progress, 
  onBack,
  showBackButton = true 
}: MobileStepperProps) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 p-4">
      <div className="flex items-center gap-3 mb-3">
        {showBackButton && currentStep > 0 && onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="h-8 w-8 p-0 hover:bg-slate-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span className="font-medium text-slate-700">{stepTitle}</span>
            <span className="text-slate-500">{currentStep + 1} / {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-slate-100" />
        </div>
      </div>
    </div>
  );
};

export default MobileStepper;
