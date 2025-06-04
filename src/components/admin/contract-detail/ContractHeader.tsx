
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Save } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/components/onboarding/utils/currencyUtils";

interface ContractHeaderProps {
  contract: any;
  onboardingData: any;
  isEditMode: boolean;
  onToggleEdit: () => void;
  onBack: () => void;
  onSave: (data: any) => void;
}

const ContractHeader = ({ 
  contract, 
  onboardingData, 
  isEditMode, 
  onToggleEdit, 
  onBack, 
  onSave 
}: ContractHeaderProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Odoslaná</Badge>;
      case 'approved':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Schválená</Badge>;
      case 'signed':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Podpísaná</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Vygenerovaná</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Calculate total contract value from device selection
  const calculateContractValue = () => {
    if (!onboardingData?.deviceSelection?.dynamicCards) return 0;
    
    return onboardingData.deviceSelection.dynamicCards.reduce((total: number, card: any) => {
      return total + (card.count * card.monthlyFee * 12); // Annual value
    }, 0);
  };

  const contractValue = calculateContractValue();

  // Format contract number as CON-2024-XXX
  const formattedContractNumber = `CON-2024-${String(contract.contract_number).padStart(3, '0')}`;
  
  // Get author name from contact info or default to Admin
  const authorName = onboardingData.contactInfo 
    ? `${onboardingData.contactInfo.firstName} ${onboardingData.contactInfo.lastName}`
    : (onboardingData.contactInfo?.user_role || 'Admin');

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200/60">
      <div className="container mx-auto px-6 py-4">
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="border-slate-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Späť na zoznam
                </Button>
                
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {formattedContractNumber}
                  </h1>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-600">
                      Zmluva pre {onboardingData.companyInfo?.companyName || 'Neuvedené'}
                    </p>
                    <p className="text-sm text-slate-500">
                      Zmluvu vytvoril: {authorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Stav zmluvy</p>
                    {getStatusBadge(contract.status)}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Dátum vytvorenia</p>
                    <p className="font-medium text-slate-900">
                      {format(new Date(contract.created_at), 'dd.MM.yyyy')}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Hodnota zmluvy</p>
                    <p className="font-bold text-emerald-600">
                      {formatCurrency(contractValue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={onToggleEdit}
                  className={isEditMode ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}
                >
                  {isEditMode ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Uložiť zmeny
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Upraviť zmluvu
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractHeader;
