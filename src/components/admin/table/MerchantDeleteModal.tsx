import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MerchantDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (forceCascade: boolean) => void;
  selectedMerchantIds: string[];
  selectedCount: number;
}

interface ContractInfo {
  id: string;
  contract_number: string;
  merchant_id: string;
}

const MerchantDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  selectedMerchantIds, 
  selectedCount 
}: MerchantDeleteModalProps) => {
  const [contracts, setContracts] = useState<ContractInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedMerchantIds.length > 0) {
      checkContracts();
    }
  }, [isOpen, selectedMerchantIds]);

  const checkContracts = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('contracts')
        .select('id, contract_number, merchant_id')
        .in('merchant_id', selectedMerchantIds);
      
      setContracts(data || []);
    } catch (error) {
      console.error('Error checking contracts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = (forceCascade: boolean = false) => {
    onConfirm(forceCascade);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white max-w-lg">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-semibold text-slate-900">
                Potvrdiť vymazanie obchodníkov
              </AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogDescription className="text-slate-600 mt-4">
          <div className="space-y-3">
            <p>
              Naozaj chcete vymazať <strong>{selectedCount}</strong> {selectedCount === 1 ? 'označeného obchodníka' : selectedCount < 5 ? 'označených obchodníkov' : 'označených obchodníkov'}?
            </p>
            
            {isLoading ? (
              <p className="text-blue-600">Kontrolujem súvisiace dáta...</p>
            ) : contracts.length > 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Pozor! Obchodníci majú {contracts.length} súvisiacich zmlúv:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      {contracts.slice(0, 5).map(contract => (
                        <li key={contract.id}>• {contract.contract_number}</li>
                      ))}
                      {contracts.length > 5 && (
                        <li>• ... a ďalších {contracts.length - 5} zmlúv</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-green-600">Obchodníci nemajú žiadne súvisiace zmluvy.</p>
            )}
            
            <p className="text-red-600 font-medium">
              {contracts.length > 0 
                ? "Ak pokračujete, všetky súvisiace zmluvy budú tiež vymazané. Táto akcia je nevratná."
                : "Táto akcia je nevratná."
              }
            </p>
          </div>
        </AlertDialogDescription>
        
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="bg-slate-100 text-slate-700 hover:bg-slate-200">
            Zrušiť
          </AlertDialogCancel>
          
          {contracts.length > 0 ? (
            <AlertDialogAction 
              onClick={() => handleConfirm(true)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Vymazať vrátane zmlúv
            </AlertDialogAction>
          ) : (
            <AlertDialogAction 
              onClick={() => handleConfirm(false)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Vymazať {selectedCount === 1 ? 'obchodníka' : 'obchodníkov'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MerchantDeleteModal;