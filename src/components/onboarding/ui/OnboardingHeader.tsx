
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, FileText, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useOnboardingContractDelete } from "@/hooks/useOnboardingContractDelete";
import { useNavigate } from "react-router-dom";

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
  const { deleteContract, isDeleting } = useOnboardingContractDelete();
  const navigate = useNavigate();

  const handleDeleteContract = async () => {
    if (!contractId) return;
    
    const result = await deleteContract(contractId);
    if (result.success) {
      // Clear local storage and reset onboarding state
      localStorage.removeItem('onboarding_data');
      
      // Call the callback to reset the parent state
      if (onContractDeleted) {
        onContractDeleted();
      }
      
      // Navigate to welcome page
      navigate('/');
    }
  };

  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Utopia
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isCreatingContract && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">Vytvára sa zmluva...</span>
                </Badge>
              </div>
            )}
            {contractNumber && contractId && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Zmluva č. {contractNumber}
                </Badge>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Vymazať zmluvu</AlertDialogTitle>
                      <AlertDialogDescription>
                        Naozaj chcete vymazať zmluvu č. {contractNumber}? Táto akcia sa nedá vrátiť späť a všetky údaje budú trvalo odstránené.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteContract}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Vymazávam...' : 'Vymazať zmluvu'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
            <Badge variant="outline" className="border-blue-200 text-blue-700">
              Registrácia obchodníka
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};

export default OnboardingHeader;
