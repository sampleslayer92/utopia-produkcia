
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
  Eye,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/components/onboarding/utils/currencyUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContractPreviewModal from "./ContractPreviewModal";
import { generateContractPDF } from "@/utils/pdfGenerator";
import { useTranslation } from 'react-i18next';

interface ContractActionsProps {
  contract: any;
  onboardingData: any;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const ContractActions = ({ contract, onboardingData, onDelete, isDeleting = false }: ContractActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const contractNumber = `CON-2024-${String(contract.contract_number).padStart(3, '0')}`;

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      toast({
        title: "PDF Export",
        description: t('contractActions.generatingPdf'),
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
        } finally {
          setIsExporting(false);
        }
      }, 500);
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa inicializovať export PDF.",
        variant: "destructive",
      });
      setIsExporting(false);
    }
  };

  const handlePreviewContract = () => {
    setIsPreviewOpen(true);
  };

  const handleSendEmail = () => {
    toast({
      title: "Email",
      description: "Funkcia bude implementovaná neskôr.",
    });
    // TODO: Implement email sending
  };

  const handleMarkSigned = () => {
    toast({
      title: "Podpis",
      description: "Funkcia bude implementovaná neskôr.",
    });
    // TODO: Implement status update
  };

  const handleDeleteContract = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleDuplicateContract = () => {
    // Navigate to onboarding with current contract data pre-filled
    const contractData = {
      ...onboardingData,
      contractId: undefined, // Clear ID for new contract
      contractNumber: undefined
    };
    
    // Store data in localStorage for the onboarding flow
    localStorage.setItem('duplicate_contract_data', JSON.stringify(contractData));
    
    toast({
      title: "Duplikácia",
      description: "Presmerováva na vytvorenie novej zmluvy s prepísanými údajmi...",
    });
    
    navigate('/onboarding');
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
            <CardTitle className="text-slate-900 text-lg">{t('contractActions.quickSummary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">{t('contractActions.contractNumber')}:</span>
              <span className="font-mono font-medium">{contractNumber}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">{t('contractActions.client')}:</span>
              <span className="font-medium">{onboardingData.companyInfo?.companyName || t('contractActions.notSpecified')}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">{t('contractActions.monthlyRevenue')}:</span>
              <span className="font-medium text-emerald-600">{formatCurrency(totalMonthlyRevenue)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">{t('contractActions.deviceCount')}:</span>
              <span className="font-medium">{devices.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Actions */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 text-lg">{t('contractActions.mainActions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handlePreviewContract}
              className="w-full justify-start"
            >
              <Eye className="h-4 w-4 mr-2" />
              {t('contractActions.previewContract')}
            </Button>

            <Button 
              onClick={handleExportPDF}
              className="w-full justify-start bg-emerald-600 hover:bg-emerald-700"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('contractActions.generatingPdf')}
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4 mr-2" />
                  {t('contractActions.exportPdf')}
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleSendEmail}
              variant="outline" 
              className="w-full justify-start border-slate-300"
            >
              <Mail className="h-4 w-4 mr-2" />
              {t('contractActions.sendEmail')}
            </Button>
            
            {contract.status !== 'signed' && (
              <Button 
                onClick={handleMarkSigned}
                variant="outline" 
                className="w-full justify-start border-slate-300"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('contractActions.markAsSigned')}
              </Button>
            )}
            
            <Button 
              onClick={handleDuplicateContract}
              variant="outline" 
              className="w-full justify-start border-slate-300"
            >
              <Copy className="h-4 w-4 mr-2" />
              {t('contractActions.duplicateContract')}
            </Button>
          </CardContent>
        </Card>

        {/* Secondary Actions */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 text-lg">{t('contractActions.additionalActions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-slate-300"
              disabled
            >
              <History className="h-4 w-4 mr-2" />
              {t('contractActions.changeHistory')}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start border-slate-300"
              disabled
            >
              <Download className="h-4 w-4 mr-2" />
              {t('contractActions.downloadAttachments')}
            </Button>
            
            <div className="pt-3 border-t border-slate-200">
              <Button 
                onClick={handleDeleteContract}
                variant="outline" 
                className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('contractActions.deleting')}
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('contractActions.deleteContract')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contract Status Info */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 text-lg">{t('contractActions.statusInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">{t('contractActions.lastModified')}:</span>
              <span className="font-medium">
                {new Date(contract.updated_at || contract.created_at).toLocaleDateString('sk-SK')}
              </span>
            </div>
            
            {contract.submitted_at && (
              <div className="flex justify-between">
                <span className="text-slate-600">{t('contractActions.submitted')}:</span>
                <span className="font-medium">
                  {new Date(contract.submitted_at).toLocaleDateString('sk-SK')}
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-slate-600">{t('contractActions.version')}:</span>
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
