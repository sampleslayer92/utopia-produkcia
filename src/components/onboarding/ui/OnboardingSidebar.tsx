
import { Progress } from "@/components/ui/progress";
import { Check, AlertCircle, Clock, CircleDot } from "lucide-react";
import { toast } from "sonner";
import { useProgressTracking } from "../hooks/useProgressTracking";
import { OnboardingData } from "@/types/onboarding";

interface OnboardingSidebarProps {
  currentStep: number;
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  onStepClick: (stepNumber: number) => void;
  onboardingData: OnboardingData;
}

const OnboardingSidebar = ({ 
  currentStep, 
  steps, 
  onStepClick,
  onboardingData 
}: OnboardingSidebarProps) => {
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
    <div className="w-64 bg-white/60 backdrop-blur-sm border-r border-slate-200/60 p-4 sticky top-[77px] h-[calc(100vh-77px)] overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Registračný proces</h2>
        <Progress value={overallProgress.overallPercentage} className="h-2" />
        <div className="text-xs text-slate-600 mt-2 text-center">
          {overallProgress.overallPercentage}% dokončené
        </div>
        <div className="text-xs text-slate-500 text-center">
          {overallProgress.completedSteps}/{overallProgress.totalSteps} krokov
        </div>
      </div>

      {/* Vertical Steps */}
      <div className="space-y-2">
        {steps.map((step) => {
          const isClickable = step.number <= currentStep + 1;
          const progress = stepProgress[step.number];
          const isCurrentStep = step.number === currentStep;
          const isCompleted = progress?.isComplete ?? false;
          const isNext = step.number === currentStep + 1;
          const isPartiallyComplete = progress && progress.completionPercentage > 0 && progress.completionPercentage < 100;

          return (
            <div
              key={step.number}
              onClick={() => isClickable && handleStepClick(step.number)}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 
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
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
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
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 mb-1">
                  {step.title}
                </div>

                {/* Progress bar for current and incomplete steps */}
                {progress && !isCompleted && (
                  <div className="mt-2">
                    <Progress 
                      value={progress.completionPercentage} 
                      className="h-1"
                    />
                    <div className="text-xs text-slate-500 mt-1">
                      {progress.completionPercentage}% dokončené
                    </div>
                  </div>
                )}

                {/* Status indicators */}
                {isNext && !isPartiallyComplete && (
                  <div className="flex items-center mt-1 text-xs text-indigo-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>Nasledujúci</span>
                  </div>
                )}

                {isCurrentStep && progress && progress.completionPercentage > 0 && !isCompleted && (
                  <div className="flex items-center mt-1 text-xs text-blue-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Prebieha</span>
                  </div>
                )}

                {isPartiallyComplete && !isCurrentStep && (
                  <div className="flex items-center mt-1 text-xs text-amber-600">
                    <CircleDot className="h-3 w-3 mr-1" />
                    <span>Čiastočne vyplnené</span>
                  </div>
                )}

                {isCompleted && (
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <Check className="h-3 w-3 mr-1" />
                    <span>Dokončené</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <h3 className="font-medium text-blue-800 text-sm mb-2">Potrebujete pomoc?</h3>
        <p className="text-xs text-blue-700">
          V prípade otázok nás kontaktujte na čísle +421 911 123 456 alebo na info@utopia.sk
        </p>
      </div>
    </div>
  );
};

export default OnboardingSidebar;
