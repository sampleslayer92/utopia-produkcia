
import { ArrowLeft, Edit, Save, X, FileText, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface ContractHeaderProps {
  contract: any;
  onboardingData: any;
  isEditMode: boolean;
  onToggleEdit: () => void;
  onBack: () => void;
  onSave: () => void;
  isDirty?: boolean;
}

const ContractHeader = ({ 
  contract, 
  onboardingData, 
  isEditMode, 
  onToggleEdit, 
  onBack, 
  onSave,
  isDirty = false
}: ContractHeaderProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Odoslané</Badge>;
      case 'approved':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Schválené</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Zamietnuté</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Koncept</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na zoznam
            </Button>
            
            <div className="h-6 w-px bg-slate-300" />
            
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold text-slate-900">
                  Zmluva #{contract.contract_number}
                </h1>
                {getStatusBadge(contract.status)}
                {isDirty && (
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    Neuložené zmeny
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                <span className="flex items-center">
                  {getStatusIcon(contract.status)}
                  <span className="ml-1">
                    {onboardingData.companyInfo?.companyName || 
                     `${onboardingData.contactInfo?.firstName} ${onboardingData.contactInfo?.lastName}` || 
                     'Neznámy klient'}
                  </span>
                </span>
                <span>•</span>
                <span>Vytvorené: {format(new Date(contract.created_at), 'dd.MM.yyyy HH:mm')}</span>
                {contract.submitted_at && (
                  <>
                    <span>•</span>
                    <span>Odoslané: {format(new Date(contract.submitted_at), 'dd.MM.yyyy HH:mm')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isEditMode && isDirty && (
              <Button 
                onClick={onSave}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Uložiť zmeny
              </Button>
            )}
            
            <Button 
              variant={isEditMode ? "destructive" : "outline"}
              size="sm"
              onClick={onToggleEdit}
              className={isEditMode ? "hover:bg-red-700" : "hover:bg-slate-50"}
            >
              {isEditMode ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Zrušiť editáciu
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Editovať
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractHeader;
