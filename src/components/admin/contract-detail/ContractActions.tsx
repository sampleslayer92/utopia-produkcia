import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileDown, 
  Mail, 
  CheckCircle, 
  Trash2, 
  Copy,
  History,
  Download,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/components/onboarding/utils/currencyUtils";
import { useState } from "react";
import ContractPreviewModal from "./ContractPreviewModal";
import { generateContractPDF } from "@/utils/pdfGenerator";

interface ContractActionsProps {
  contract: any;
  onboardingData: any;
}

const ContractActions = ({ contract, onboardingData }: ContractActionsProps) => {
  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const contractNumber = `CON-2024-${String(contract.contract_number).padStart(3, '0')}`;

  const handleExportPDF = async () => {
    try {
      toast({
        title: "PDF Export",
        description: "Generujem PDF súbor zmluvy...",
      });
      
      // Open preview modal first to render the content
      setIsPreviewOpen(true);
      
      // Wait a bit for the modal to render
      setTimeout(async () => {
        try {
          await generateContractPDF(contractNumber);
          toast({
            title: "PDF Export",
            description: "PDF súbor bol úspešne vygenerovaný a stiahnutý.",
          });
          setIsPreviewOpen(false);
        } catch (error) {
          toast({
            title: "Chyba",
            description: "Nepodarilo sa vygenerovať PDF súbor.",
            variant: "destructive",
          });
          setIsPreviewOpen(false);
        }
      }, 500);
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa inicializovať export PDF.",
        variant: "destructive",
      });
    }
  };

  const handlePreviewContract = () => {
    setIsPreviewOpen(true);
  };

  const handleSendEmail = () => {
    toast({
      title: "Email",
      description: "Odosielam zmluvu e-mailom...",
    });
    // TODO: Implement email sending
  };

  const handleMarkSigned = () => {
    toast({
      title: "Podpis",
      description: "Zmluva bola označená ako podpísaná.",
    });
    // TODO: Implement status update
  };

  const handleDeleteContract = () => {
    if (confirm('Naozaj chcete vymazať túto zmluvu? Táto akcia sa nedá vrátiť späť.')) {
      toast({
        title: "Zmluva vymazaná",
        description: "Zmluva bola úspešne vymazaná.",
        variant: "destructive",
      });
      // TODO: Implement contract deletion
    }
  };

  const handleDuplicateContract = () => {
    toast({
      title: "Duplikácia",
      description: "Vytváram kópiu zmluvy...",
    });
    // TODO: Implement contract duplication
  };

  // Calculate contract summary
  const devices = onboardingData.deviceSelection?.dynamicCards || [];
  const totalMonthlyRevenue = devices.reduce((sum: number, device: any) => {
    return sum + (device.count * device.monthlyFee);
  }, 0);

  return (
    <>
      <div className="space-y-6">
        {/* Quick Summary */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 text-lg">Rýchly prehľad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Číslo zmluvy:</span>
              <span className="font-mono font-medium">{contractNumber}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Klient:</span>
              <span className="font-medium">{onboardingData.companyInfo?.companyName || 'Neuvedené'}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Mesačný príjem:</span>
              <span className="font-medium text-emerald-600">{formatCurrency(totalMonthlyRevenue)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Počet zariadení:</span>
              <span className="font-medium">{devices.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Actions */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 text-lg">Hlavné akcie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handlePreviewContract}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="h-4 w-4 mr-2" />
              Náhľad zmluvy
            </Button>

            <Button 
              onClick={handleExportPDF}
              className="w-full justify-start bg-emerald-600 hover:bg-emerald-700"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Exportovať PDF
            </Button>
            
            <Button 
              onClick={handleSendEmail}
              variant="outline" 
              className="w-full justify-start border-slate-300"
            >
              <Mail className="h-4 w-4 mr-2" />
              Odoslať emailom
            </Button>
            
            {contract.status !== 'signed' && (
              <Button 
                onClick={handleMarkSigned}
                variant="outline" 
                className="w-full justify-start border-slate-300"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Označiť ako podpísanú
              </Button>
            )}
            
            <Button 
              onClick={handleDuplicateContract}
              variant="outline" 
              className="w-full justify-start border-slate-300"
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplikovať zmluvu
            </Button>
          </CardContent>
        </Card>

        {/* Secondary Actions */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 text-lg">Ďalšie akcie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-slate-300"
              disabled
            >
              <History className="h-4 w-4 mr-2" />
              História zmien
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start border-slate-300"
              disabled
            >
              <Download className="h-4 w-4 mr-2" />
              Stiahnuť prílohy
            </Button>
            
            <div className="pt-3 border-t border-slate-200">
              <Button 
                onClick={handleDeleteContract}
                variant="outline" 
                className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50"
              >
              <Trash2 className="h-4 w-4 mr-2" />
                Vymazať zmluvu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contract Status Info */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 text-lg">Informácie o stave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Posledná úprava:</span>
              <span className="font-medium">
                {new Date(contract.updated_at || contract.created_at).toLocaleDateString('sk-SK')}
              </span>
            </div>
            
            {contract.submitted_at && (
              <div className="flex justify-between">
                <span className="text-slate-600">Odoslané:</span>
                <span className="font-medium">
                  {new Date(contract.submitted_at).toLocaleDateString('sk-SK')}
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-slate-600">Verzia:</span>
              <span className="font-medium">1.0</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <ContractPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        contract={contract}
        onboardingData={onboardingData}
      />
    </>
  );
};

export default ContractActions;
