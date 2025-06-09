
import { useTranslation } from 'react-i18next';
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useOnboardingContractDelete } from "@/hooks/useOnboardingContractDelete";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface OnboardingHeaderProps {
  contractNumber?: string;
  contractId?: string;
  onContractDeleted?: () => void;
  isCreatingContract?: boolean;
}

const OnboardingHeader = ({ 
  contractNumber, 
  contractId, 
  onContractDeleted,
  isCreatingContract = false 
}: OnboardingHeaderProps) => {
  const { t } = useTranslation(['common', 'notifications']);
  const { deleteContract, isDeleting } = useOnboardingContractDelete();

  const handleDeleteContract = async () => {
    if (!contractId) return;
    
    const confirmed = window.confirm(
      'Naozaj chcete zmazať túto zmluvu? Táto akcia sa nedá vrátiť späť.'
    );
    
    if (!confirmed) return;

    try {
      await deleteContract(contractId);
      toast.success(t('notifications:success.dataSaved'));
      onContractDeleted?.();
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error(t('notifications:error.saveFailed'));
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-slate-900">
            Utopia Registration
          </h1>
          
          {isCreatingContract && (
            <div className="flex items-center text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Vytváram zmluvu...
            </div>
          )}
          
          {contractNumber && (
            <div className="flex items-center text-sm text-slate-600">
              <span className="font-medium">{t('common:general.contractNumber')}:</span>
              <span className="ml-1 font-mono bg-slate-100 px-2 py-1 rounded">
                {contractNumber}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <LanguageSwitcher />
          
          {contractId && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteContract}
              disabled={isDeleting}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingHeader;
