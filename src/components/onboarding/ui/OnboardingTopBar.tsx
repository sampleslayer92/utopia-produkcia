
import { Check, AlertCircle, Clock, CircleDot } from "lucide-react";
import { toast } from "sonner";
import { useProgressTracking } from "../hooks/useProgressTracking";
import { OnboardingData } from "@/types/onboarding";
import { Progress } from "@/components/ui/progress";

interface OnboardingTopBarProps {
  currentStep: number;
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  onStepClick: (stepNumber: number) => void;
  onboardingData: OnboardingData;
}

const OnboardingTopBar = ({ 
  currentStep, 
  steps, 
  onStepClick,
  onboardingData 
}: OnboardingTopBarProps) => {
  const { stepProgress, overallProgress } = useProgressTracking(onboardingData, currentStep);

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep + 1) {
      onStepClick(stepNumber);
    } else {
      toast.warning("Najprv dokončite aktuálny krok", {
        description: "Nemôžete preskočiť viacero krokov naraz"
      });
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 sticky top-0 z-40">
      {/* Overall Progress Section - Simplified */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-slate-700">Registračný proces</h2>
          <div className="text-xs text-slate-500 font-medium">
            {overallProgress.overallPercentage}% • {overallProgress.completedSteps}/{overallProgress.totalSteps}
          </div>
        </div>
        <Progress value={overallProgress.overallPercentage} className="h-1.5 bg-slate-100" />
      </div>

      {/* Cleaner Steps Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const isClickable = step.number <= currentStep + 1;
            const progress = stepProgress[step.number];
            const isCurrentStep = step.number === currentStep;
            const isCompleted = progress?.isComplete ?? false;

            return (
              <div key={step.number} className="flex items-center">
                {/* Step Item - Horizontal Layout */}
                <div
                  onClick={() => isClickable && handleStepClick(step.number)}
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer group min-w-fit
                    ${isClickable ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}
                    ${isCurrentStep
                      ? "bg-blue-50/80 border border-blue-200/60"
                      : isCompleted
                      ? "bg-green-50/60 hover:bg-green-50/80"
                      : "hover:bg-slate-50/60"
                    }`}
                >
                  {/* Step Icon - Smaller and cleaner */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                      isCurrentStep
                        ? "bg-blue-500 text-white shadow-sm"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      step.number + 1
                    )}
                  </div>
                  
                  {/* Step Title - Inline */}
                  <div className="text-xs font-medium text-slate-700 whitespace-nowrap">
                    {step.title}
                  </div>
                </div>

                {/* Connector Line - Simplified */}
                {index < steps.length - 1 && (
                  <div className={`h-px w-8 mx-2 transition-colors duration-200 ${
                    isCompleted ? "bg-green-200" : "bg-slate-200"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTopBar;
