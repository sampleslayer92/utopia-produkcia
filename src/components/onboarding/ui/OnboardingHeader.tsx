
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useOnboardingContractDelete } from "@/hooks/useOnboardingContractDelete";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface OnboardingHeaderProps {
  contractNumber?: string;
  contractId?: string;
  onContractDeleted: () => void;
  isCreatingContract?: boolean;
}

const OnboardingHeader = ({ 
  contractNumber, 
  contractId, 
  onContractDeleted,
  isCreatingContract = false 
}: OnboardingHeaderProps) => {
  const { t } = useTranslation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteContract, isDeleting } = useOnboardingContractDelete();

  const handleDeleteContract = async () => {
    if (!contractId) return;
    
    const result = await deleteContract(contractId);
    if (result.success) {
      setShowDeleteDialog(false);
      onContractDeleted();
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img 
              src="https://famouscreative.eu/wp-content/uploads/2025/06/logo_utopia_svg.svg" 
              alt="Utopia Logo" 
              className="h-8 w-auto"
            />
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-slate-900">
                {t('onboarding.header.title')}
              </h1>
            </div>
          </div>

          {/* Contract Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* Contract Status */}
            {isCreatingContract && (
              <div className="flex items-center text-sm text-blue-600">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">{t('onboarding.header.creatingContract')}</span>
              </div>
            )}
            
            {contractNumber && (
              <div className="hidden sm:flex items-center text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                <span className="font-medium">
                  {t('onboarding.header.contractNumber', { number: contractNumber })}
                </span>
              </div>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Delete Contract Button */}
            {contractId && !isCreatingContract && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="hidden sm:ml-2 sm:inline">{t('common.delete')}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-slate-900">
                {t('common.confirm')} {t('common.delete')}
              </h3>
            </div>
            <p className="text-slate-600 mb-6">
              {t('onboarding.deleteConfirmation')}
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleDeleteContract}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {t('common.delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingHeader;
