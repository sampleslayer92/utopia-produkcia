
import { useState } from 'react';
import { Check, AlertCircle, Clock, CircleDot, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useProgressTracking } from "../hooks/useProgressTracking";
import { useOnboardingContractDelete } from "@/hooks/useOnboardingContractDelete";
import { OnboardingData } from "@/types/onboarding";
import { Progress } from "@/components/ui/progress";
import ConfirmDeleteModal from "@/components/admin/contract-detail/ConfirmDeleteModal";

interface OnboardingTopBarProps {
  currentStep: number;
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  onStepClick: (stepNumber: number) => void;
  onboardingData: OnboardingData;
  isAdminMode?: boolean;
  onContractDeleted?: () => void;
}

const OnboardingTopBar = ({ 
  currentStep, 
  steps, 
  onStepClick,
  onboardingData,
  isAdminMode = false,
  onContractDeleted
}: OnboardingTopBarProps) => {
  const { stepProgress, overallProgress } = useProgressTracking(onboardingData, currentStep);
  const { deleteContract, isDeleting } = useOnboardingContractDelete();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep + 1) {
      onStepClick(stepNumber);
    } else {
      toast.warning("Najprv dokončite aktuálny krok", {
        description: "Nemôžete preskočiť viacero krokov naraz"
      });
    }
  };

  const handleDeleteContract = async () => {
    if (!onboardingData.contractId) return;

    try {
      const result = await deleteContract(onboardingData.contractId);
      if (result.success) {
        toast.success('Zmluva bola vymazaná');
        onContractDeleted?.();
        setShowDeleteModal(false);
      } else {
        toast.error('Chyba pri mazaní zmluvy');
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error('Chyba pri mazaní zmluvy');
    }
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-100/80 py-3 px-4 sticky top-0 z-40">
        {/* Header with delete button for admin mode */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold text-slate-800">Registračný proces</h2>
            {onboardingData.contractNumber && (
              <div className="flex items-center text-sm text-slate-600">
                <span className="font-medium">Zmluva:</span>
                <span className="ml-1 font-mono bg-slate-100 px-2 py-1 rounded text-xs">
                  {onboardingData.contractNumber}
                </span>
              </div>
            )}
          </div>
          
          {/* Delete button for admin mode */}
          {isAdminMode && onboardingData.contractId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="ml-1 hidden sm:inline">Vymazať</span>
            </Button>
          )}
        </div>

        {/* Overall Progress Section - Simplified */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-500 font-medium">
              {overallProgress.overallPercentage}% • {overallProgress.completedSteps}/{overallProgress.totalSteps}
            </div>
          </div>
          <Progress value={overallProgress.overallPercentage} className="h-1.5 bg-slate-100" />
        </div>

        {/* Cleaner Steps Layout */}
        <div className="flex items-center justify-between overflow-x-auto pb-1">
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
                  className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg transition-all duration-200 cursor-pointer group min-w-fit text-xs
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
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                      isCurrentStep
                        ? "bg-blue-500 text-white shadow-sm"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-2.5 w-2.5" />
                    ) : (
                      step.number + 1
                    )}
                  </div>
                  
                  {/* Step Title - Inline */}
                  <div className="font-medium text-slate-700 whitespace-nowrap">
                    {step.title}
                  </div>
                </div>

                {/* Connector Line - Simplified */}
                {index < steps.length - 1 && (
                  <div className={`h-px w-6 mx-1.5 transition-colors duration-200 ${
                    isCompleted ? "bg-green-200" : "bg-slate-200"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteContract}
        title={onboardingData.contractNumber || 'zmluvu'}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default OnboardingTopBar;
