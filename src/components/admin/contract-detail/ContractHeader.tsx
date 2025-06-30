
import { ArrowLeft, Edit, Save, X, FileText, Clock, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useTranslation } from 'react-i18next';
import { useContractStatusUpdate } from "@/hooks/useContractStatusUpdate";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface ContractHeaderProps {
  contract: any;
  onboardingData: any;
  isEditMode: boolean;
  onToggleEdit: () => void;
  onBack: () => void;
  onSave: () => void;
  isDirty?: boolean;
  isSaving?: boolean;
}

const ContractHeader = ({ 
  contract, 
  onboardingData, 
  isEditMode, 
  onToggleEdit, 
  onBack, 
  onSave,
  isDirty = false,
  isSaving = false
}: ContractHeaderProps) => {
  const { t } = useTranslation('admin');
  const updateContractStatus = useContractStatusUpdate();

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
    const statusMap = {
      'submitted': 'bg-blue-100 text-blue-700 border-blue-200',
      'approved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'rejected': 'bg-red-100 text-red-700 border-red-200',
      'draft': 'bg-gray-100 text-gray-700 border-gray-200'
    };

    return (
      <Badge className={statusMap[status as keyof typeof statusMap] || 'bg-gray-100 text-gray-700 border-gray-200'}>
        {t(`status.${status}`)}
      </Badge>
    );
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateContractStatus.mutateAsync({
      contractId: contract.id,
      newStatus: newStatus as any
    });
  };

  const statusOptions = [
    { value: 'draft', label: t('status.draft') },
    { value: 'submitted', label: t('status.submitted') },
    { value: 'approved', label: t('status.approved') },
    { value: 'rejected', label: t('status.rejected') },
    { value: 'in_progress', label: t('status.in_progress') },
    { value: 'sent_to_client', label: t('status.sent_to_client') },
    { value: 'signed', label: t('status.signed') },
    { value: 'lost', label: t('status.lost') }
  ];

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
              disabled={isSaving}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('contractDetail.backToList')}
            </Button>
            
            <div className="h-6 w-px bg-slate-300" />
            
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold text-slate-900">
                  {t('table.columns.contractNumber')} #{contract.contract_number}
                </h1>
                {getStatusBadge(contract.status)}
                {isDirty && (
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    {t('contractDetail.unsavedChanges')}
                  </Badge>
                )}
                {isSaving && (
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    {t('contractDetail.saving')}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                <span className="flex items-center">
                  {getStatusIcon(contract.status)}
                  <span className="ml-1">
                    {onboardingData.companyInfo?.companyName || 
                     `${onboardingData.contactInfo?.firstName} ${onboardingData.contactInfo?.lastName}` || 
                     t('contractDetail.unknownClient')}
                  </span>
                </span>
                <span>•</span>
                <span>{t('contractDetail.created')} {format(new Date(contract.created_at), 'dd.MM.yyyy HH:mm')}</span>
                {contract.submitted_at && (
                  <>
                    <span>•</span>
                    <span>{t('contractDetail.submitted')} {format(new Date(contract.submitted_at), 'dd.MM.yyyy HH:mm')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            
            {/* Status Change Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">{t('table.columns.status')}:</span>
              <Select value={contract.status} onValueChange={handleStatusChange} disabled={updateContractStatus.isPending}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isEditMode && isDirty && (
              <Button 
                onClick={onSave}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('contractDetail.saving')}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t('contractDetail.save')}
                  </>
                )}
              </Button>
            )}
            
            <Button 
              variant={isEditMode ? "destructive" : "outline"}
              size="sm"
              onClick={onToggleEdit}
              className={isEditMode ? "hover:bg-red-700" : "hover:bg-slate-50"}
              disabled={isSaving}
            >
              {isEditMode ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  {t('contractDetail.cancelEdit')}
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  {t('contractDetail.edit')}
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
