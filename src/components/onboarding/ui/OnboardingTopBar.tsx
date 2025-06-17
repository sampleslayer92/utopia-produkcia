
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
    <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/60 p-4 sticky top-[77px] z-40">
      {/* Overall Progress Section */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900">Registračný proces</h2>
          <div className="text-sm text-slate-600">
            {overallProgress.overallPercentage}% dokončené • {overallProgress.completedSteps}/{overallProgress.totalSteps} krokov
          </div>
        </div>
        <Progress value={overallProgress.overallPercentage} className="h-2" />
      </div>

      {/* Horizontal Steps */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between space-x-2 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const isClickable = step.number <= currentStep + 1;
            const progress = stepProgress[step.number];
            const isCurrentStep = step.number === currentStep;
            const isCompleted = progress?.isComplete ?? false;
            const isNext = step.number === currentStep + 1;
            const isPartiallyComplete = progress && progress.completionPercentage > 0 && progress.completionPercentage < 100;

            return (
              <div key={step.number} className="flex items-center min-w-0">
                {/* Step Circle and Content */}
                <div
                  onClick={() => isClickable && handleStepClick(step.number)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 min-w-0 flex-shrink-0
                    ${isClickable ? "cursor-pointer" : "opacity-70 cursor-not-allowed"}
                    ${
                      isCurrentStep
                        ? "bg-blue-100 border-2 border-blue-300 shadow-sm"
                        : isCompleted
                        ? "bg-green-50 border border-green-200 hover:bg-green-100"
                        : isPartiallyComplete
                        ? "bg-amber-50 border border-amber-200 hover:bg-amber-100"
                        : isNext
                        ? "bg-indigo-50 border border-indigo-200 hover:bg-indigo-100"
                        : "bg-slate-50/50 border border-slate-200"
                    }`}
                >
                  {/* Step Icon */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                      isCurrentStep
                        ? "bg-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : isPartiallyComplete
                        ? "bg-amber-500 text-white"
                        : isNext
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3 w-3" />
                    ) : isPartiallyComplete ? (
                      <CircleDot className="h-3 w-3" />
                    ) : (
                      step.number + 1
                    )}
                  </div>
                  
                  {/* Step Title and Status */}
                  <div className="min-w-0 hidden sm:block">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {step.title}
                    </div>
                    
                    {/* Status indicators */}
                    {isNext && !isPartiallyComplete && (
                      <div className="flex items-center text-xs text-indigo-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        <span>Nasledujúci</span>
                      </div>
                    )}

                    {isCurrentStep && progress && progress.completionPercentage > 0 && !isCompleted && (
                      <div className="flex items-center text-xs text-blue-600">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Prebieha</span>
                      </div>
                    )}

                    {isPartiallyComplete && !isCurrentStep && (
                      <div className="flex items-center text-xs text-amber-600">
                        <CircleDot className="h-3 w-3 mr-1" />
                        <span>Čiastočne vyplnené</span>
                      </div>
                    )}

                    {isCompleted && (
                      <div className="flex items-center text-xs text-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        <span>Dokončené</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-8 mx-2 flex-shrink-0 ${
                    isCompleted ? "bg-green-300" : "bg-slate-200"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Help Section */}
      <div className="max-w-5xl mx-auto mt-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
          <h3 className="font-medium text-blue-800 text-sm mb-1">Potrebujete pomoc?</h3>
          <p className="text-xs text-blue-700">
            V prípade otázok nás kontaktujte na čísle +421 911 123 456 alebo na info@utopia.sk
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTopBar;
