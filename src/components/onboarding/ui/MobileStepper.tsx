
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
    <div className="bg-white border-b border-slate-200 p-4">
      <div className="flex items-center gap-3 mb-3">
        {showBackButton && currentStep > 0 && onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="font-medium">{stepTitle}</span>
            <span>{currentStep + 1} / {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>
    </div>
  );
};

export default MobileStepper;
