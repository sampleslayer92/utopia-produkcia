
import { Progress } from "@/components/ui/progress";
import { Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface OnboardingSidebarProps {
  currentStep: number;
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  onStepClick: (stepNumber: number) => void;
}

const OnboardingSidebar = ({ currentStep, steps, onStepClick }: OnboardingSidebarProps) => {
  const totalSteps = steps.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

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
        <Progress value={progressPercentage} className="h-2" />
        <div className="text-xs text-slate-600 mt-2 text-center">
          {Math.round(progressPercentage)}% dokončené
        </div>
      </div>

      {/* Vertical Steps */}
      <div className="space-y-2">
        {steps.map((step) => {
          const isClickable = step.number <= currentStep + 1;

          return (
            <div
              key={step.number}
              onClick={() => isClickable && handleStepClick(step.number)}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 
                ${isClickable ? "cursor-pointer" : "opacity-70 cursor-not-allowed"}
                ${
                  step.number === currentStep
                    ? "bg-blue-100 border-2 border-blue-300 shadow-sm"
                    : step.number < currentStep
                    ? "bg-sky-50 border border-sky-200 hover:bg-sky-100"
                    : step.number === currentStep + 1
                    ? "bg-indigo-50 border border-indigo-200 hover:bg-indigo-100"
                    : "bg-slate-50/50 border border-slate-200"
                }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                  step.number === currentStep
                    ? "bg-blue-600 text-white"
                    : step.number < currentStep
                    ? "bg-sky-600 text-white"
                    : step.number === currentStep + 1
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {step.number < currentStep ? <Check className="h-3 w-3" /> : step.number + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 mb-1">
                  {step.title}
                </div>

                {/* Next up indicator */}
                {step.number === currentStep + 1 && (
                  <div className="flex items-center mt-1 text-xs text-indigo-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>Nasledujúci</span>
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
