
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
    <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/60 py-2 px-4 sticky top-0 z-40">
      {/* Overall Progress Section - More Compact */}
      <div className="max-w-7xl mx-auto mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-sm font-semibold text-slate-900">Registračný proces</h2>
          <div className="text-xs text-slate-600">
            {overallProgress.overallPercentage}% dokončené • {overallProgress.completedSteps}/{overallProgress.totalSteps} krokov
          </div>
        </div>
        <Progress value={overallProgress.overallPercentage} className="h-1" />
      </div>

      {/* Horizontal Steps - Redesigned for All Steps to Fit */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {steps.map((step, index) => {
            const isClickable = step.number <= currentStep + 1;
            const progress = stepProgress[step.number];
            const isCurrentStep = step.number === currentStep;
            const isCompleted = progress?.isComplete ?? false;
            const isNext = step.number === currentStep + 1;
            const isPartiallyComplete = progress && progress.completionPercentage > 0 && progress.completionPercentage < 100;

            return (
              <div key={step.number} className="flex items-center min-w-0 flex-1">
                {/* Step Circle and Content - Compact Modern Design */}
                <div
                  onClick={() => isClickable && handleStepClick(step.number)}
                  className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg transition-all duration-300 min-w-0 flex-1 group hover:scale-[1.02]
                    ${isClickable ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}
                    ${
                      isCurrentStep
                        ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm ring-1 ring-blue-300/30"
                        : isCompleted
                        ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-200 hover:shadow-md"
                        : isPartiallyComplete
                        ? "bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 hover:shadow-md"
                        : isNext
                        ? "bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 hover:shadow-md"
                        : "bg-slate-50/50 border border-slate-100 hover:bg-slate-100/80"
                    }`}
                >
                  {/* Step Icon - Smaller and More Modern */}
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all duration-300 ${
                      isCurrentStep
                        ? "bg-blue-600 text-white shadow-sm"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : isPartiallyComplete
                        ? "bg-amber-500 text-white"
                        : isNext
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-400 text-slate-50"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-2 w-2" />
                    ) : isPartiallyComplete ? (
                      <CircleDot className="h-2 w-2" />
                    ) : (
                      step.number + 1
                    )}
                  </div>
                  
                  {/* Step Title and Status - Compact */}
                  <div className="min-w-0 flex-1 hidden sm:block">
                    <div className="text-xs font-medium text-slate-900 truncate leading-tight">
                      {step.title}
                    </div>
                    
                    {/* Status indicators - Very Compact */}
                    <div className="flex items-center mt-0.5">
                      {isNext && !isPartiallyComplete && (
                        <div className="flex items-center text-xs text-indigo-600">
                          <AlertCircle className="h-2 w-2 mr-1" />
                          <span className="text-xs">Nasledujúci</span>
                        </div>
                      )}

                      {isCurrentStep && progress && progress.completionPercentage > 0 && !isCompleted && (
                        <div className="flex items-center text-xs text-blue-600">
                          <Clock className="h-2 w-2 mr-1" />
                          <span className="text-xs">Prebieha</span>
                        </div>
                      )}

                      {isPartiallyComplete && !isCurrentStep && (
                        <div className="flex items-center text-xs text-amber-600">
                          <CircleDot className="h-2 w-2 mr-1" />
                          <span className="text-xs">Čiastočne</span>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="flex items-center text-xs text-green-600">
                          <Check className="h-2 w-2 mr-1" />
                          <span className="text-xs">Dokončené</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile: Show only step number and icon */}
                  <div className="sm:hidden">
                    <div className="text-xs font-medium text-slate-700">
                      {step.number + 1}
                    </div>
                  </div>
                </div>

                {/* Connector Line - Thinner and More Elegant */}
                {index < steps.length - 1 && (
                  <div className={`h-px w-1.5 mx-0.5 flex-shrink-0 transition-colors duration-300 ${
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
