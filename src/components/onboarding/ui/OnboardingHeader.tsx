
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useOnboardingContractDelete } from "@/hooks/useOnboardingContractDelete";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ConfirmDeleteModal from "@/components/admin/contract-detail/ConfirmDeleteModal";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteContract = async () => {
    if (!contractId) return;

    try {
      await deleteContract(contractId);
      toast.success(t('notifications:success.dataSaved'));
      onContractDeleted?.();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error(t('notifications:error.saveFailed'));
    }
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 py-3 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between w-full relative">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <img 
                src="https://famouscreative.eu/wp-content/uploads/2025/07/logo_utopia_svg.svg" 
                alt="Utopia" 
                className="h-8 w-auto"
              />
            </div>
            
            {/* Center - Contract Number and Creating Status */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
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
            
            {/* Right side - Controls */}
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              
              {contractId && (
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
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteContract}
        title={contractNumber || 'zmluvu'}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default OnboardingHeader;
