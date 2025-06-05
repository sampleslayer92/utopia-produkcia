import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown, Printer, X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
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
  const [zoom, setZoom] = useState(100);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const contractNumber = `CON-2024-${String(contract.contract_number).padStart(3, '0')}`;
  const consents = onboardingData.consents;

  const handlePrintPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      toast({
        title: "Generujem PDF",
        description: "Pripravujem kompletný súbor zmluvy na stiahnutie...",
      });
      
      await generateContractPDF(contractNumber);
      
      toast({
        title: "PDF vygenerované",
        description: "Kompletná zmluva bola úspešne vytvorená a stiahnutá.",
      });
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vygenerovať PDF súbor.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => {
    if (zoom < 150) setZoom(prev => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(prev => prev - 10);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[95vh] overflow-hidden">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Kompletná zmluva {contractNumber}</DialogTitle>
              <p className="text-sm text-slate-600 mt-1">
                Všetky údaje zo zmluvy vrátane podpisu a detailných informácií
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 border rounded px-2 py-1">
                <Button onClick={handleZoomOut} variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm min-w-[3rem] text-center">{zoom}%</span>
                <Button onClick={handleZoomIn} variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                onClick={handlePrintPDF} 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={isGeneratingPDF}
              >
                <FileDown className="h-4 w-4 mr-2" />
                {isGeneratingPDF ? 'Generujem...' : 'Stiahnuť PDF'}
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
        
        <div className="flex-1 overflow-auto bg-slate-100 p-4">
          <div 
            className="mx-auto transition-transform duration-200"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center'
            }}
          >
            <ContractPreview contract={contract} onboardingData={onboardingData} />
          </div>
        </div>
        
        <div className="flex-shrink-0 border-t pt-4">
          <div className="flex justify-between items-center text-sm text-slate-600">
            <div>
              <p>Zmluva obsahuje všetky zadané údaje vrátane obchodných lokácií, oprávnených osôb, skutočných majiteľov a podpisu.</p>
            </div>
            <div className="text-right">
              {contract.status === 'signed' && consents?.signatureDate && (
                <p className="text-emerald-600 font-medium">
                  ✓ Podpísané {format(new Date(consents.signatureDate), 'dd.MM.yyyy')}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractPreviewModal;
