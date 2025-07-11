
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
    <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/60 py-3 px-6 sticky top-0 z-40">
      {/* Overall Progress Section */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-900">Registračný proces</h2>
          <div className="text-xs text-slate-600">
            {overallProgress.overallPercentage}% dokončené • {overallProgress.completedSteps}/{overallProgress.totalSteps} krokov
          </div>
        </div>
        <Progress value={overallProgress.overallPercentage} className="h-1" />
      </div>

      {/* Vertical Steps Layout - Numbers Above Text */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-7 gap-3 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const isClickable = step.number <= currentStep + 1;
            const progress = stepProgress[step.number];
            const isCurrentStep = step.number === currentStep;
            const isCompleted = progress?.isComplete ?? false;

            return (
              <div key={step.number} className="flex flex-col items-center">
                {/* Step Content - Vertical Layout */}
                <div
                  onClick={() => isClickable && handleStepClick(step.number)}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-lg transition-all duration-300 w-full group h-20
                    ${isClickable ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}
                    ${
                      isCurrentStep
                        ? "bg-blue-50 border border-blue-200 shadow-sm"
                        : isCompleted
                        ? "bg-green-50 border border-green-200 hover:shadow-md"
                        : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                    }`}
                >
                  {/* Step Icon - Top Position */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-all duration-300 ${
                      isCurrentStep
                        ? "bg-blue-600 text-white shadow-sm"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-slate-400 text-white"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      step.number + 1
                    )}
                  </div>
                  
                  {/* Step Title - Below Icon */}
                  <div className="text-center w-full">
                    <div className="text-xs font-medium text-slate-900 leading-relaxed truncate px-1">
                      {step.title}
                    </div>
                  </div>

                  {/* Status indicator dots - Very minimal */}
                  <div className="flex justify-center">
                    {isCurrentStep && (
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    )}
                    {isCompleted && !isCurrentStep && (
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Connector Line - Between Steps */}
                {index < steps.length - 1 && (
                  <div className={`h-px w-6 mt-2 transition-colors duration-300 ${
                    isCompleted ? "bg-green-300" : "bg-slate-200"
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
