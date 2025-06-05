
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown, Printer, X } from "lucide-react";
import ContractPreview from "./ContractPreview";
import { generateContractPDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";

interface ContractPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: any;
  onboardingData: any;
}

const ContractPreviewModal = ({ 
  isOpen, 
  onClose, 
  contract, 
  onboardingData 
}: ContractPreviewModalProps) => {
  const { toast } = useToast();
  const contractNumber = `CON-2024-${String(contract.contract_number).padStart(3, '0')}`;

  const handlePrintPDF = async () => {
    try {
      toast({
        title: "Generujem PDF",
        description: "Pripravujem súbor na stiahnutie...",
      });
      
      await generateContractPDF(contractNumber);
      
      toast({
        title: "PDF vygenerované",
        description: "Súbor bol úspešne vytvorený a stiahnutý.",
      });
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vygenerovať PDF súbor.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Náhľad zmluvy {contractNumber}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button onClick={handlePrintPDF} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <FileDown className="h-4 w-4 mr-2" />
                Stiahnuť PDF
              </Button>
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Tlačiť
              </Button>
              <Button onClick={onClose} variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <ContractPreview contract={contract} onboardingData={onboardingData} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractPreviewModal;
