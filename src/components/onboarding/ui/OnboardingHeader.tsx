
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, FileText, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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

interface OnboardingHeaderProps {
  contractNumber?: string;
  contractId?: string;
  onNewContract?: () => void;
  onDeleteContract?: () => void;
  isDeleting?: boolean;
}

const OnboardingHeader = ({ 
  contractNumber, 
  contractId, 
  onNewContract, 
  onDeleteContract,
  isDeleting = false 
}: OnboardingHeaderProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showNewContractDialog, setShowNewContractDialog] = useState(false);

  const handleNewContract = () => {
    setShowNewContractDialog(false);
    if (onNewContract) {
      onNewContract();
    }
  };

  const handleDeleteContract = () => {
    setShowDeleteDialog(false);
    if (onDeleteContract) {
      onDeleteContract();
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
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <AlertDialog open={showNewContractDialog} onOpenChange={setShowNewContractDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nová zmluva
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Vytvoriť novú zmluvu?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tým sa vytvorí nová zmluva a aktuálny postup sa stratí. Všetky neuložené údaje budú vymazané.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                    <AlertDialogAction onClick={handleNewContract}>
                      Vytvoriť novú zmluvu
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {contractId && (
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                      {isDeleting ? 'Maže sa...' : 'Vymazať zmluvu'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Vymazať zmluvu?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Táto akcia sa nedá vrátiť späť. Zmluva a všetky súvisiace údaje budú trvalo vymazané.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteContract}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Vymazať zmluvu
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            {/* Contract Info */}
            {contractNumber && (
              <Badge variant="outline" className="border-blue-200 text-blue-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Zmluva č. {contractNumber}
              </Badge>
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
