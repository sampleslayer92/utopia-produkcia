import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  FileText,
  User,
  Settings,
  Calculator,
  FolderOpen,
  Clock,
  Download,
  Edit,
  Loader2
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useContractDetailData } from "@/hooks/useContractDetailData";
import { useContractDetailOperations } from "@/hooks/useContractDetailOperations";
import ContractOverviewTab from "@/components/admin/contract-tabs/ContractOverviewTab";
import ContractClientTab from "@/components/admin/contract-tabs/ContractClientTab";
import ContractDevicesTab from "@/components/admin/contract-tabs/ContractDevicesTab";
import ContractFinanceTab from "@/components/admin/contract-tabs/ContractFinanceTab";
import ContractDocumentsTab from "@/components/admin/contract-tabs/ContractDocumentsTab";
import ContractHistoryTab from "@/components/admin/contract-tabs/ContractHistoryTab";
import { useTranslation } from 'react-i18next';

const ContractDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { t } = useTranslation('admin');
  
  const { contractDataResult } = useContractDetailData();
  
  const {
    isEditMode,
    clientOperationsHasChanges,
    updateContract,
    deleteContract,
    handleSave,
    handleToggleEdit,
    handleDelete,
    handleClientOperationsUpdate,
    handleClientOperationsLocalChanges
  } = useContractDetailOperations(id!, contractDataResult.data?.contract || null);

  if (contractDataResult.isLoading) {
    return (
      <AdminLayout title={t('contracts.detail.messages.loading')} subtitle={t('contracts.title')}>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>{t('contracts.detail.messages.loadingDetail')}</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (contractDataResult.isError || !contractDataResult.data) {
    return (
      <AdminLayout title={t('contracts.detail.messages.error')} subtitle={t('contracts.title')}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">
              {contractDataResult.error ? t('contracts.detail.messages.errorLoading') : t('contracts.detail.messages.contractNotFound')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {contractDataResult.error 
                ? `${t('contracts.detail.messages.errorMessage')} ${contractDataResult.error.message}`
                : t('contracts.detail.messages.contractNotExists', { id })
              }
            </p>
            <Button onClick={() => navigate('/admin/merchants/contracts')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('contracts.detail.actions.backToList')}
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const { contract, onboardingData } = contractDataResult.data;

  // Get client name for title
  const clientName = onboardingData.companyInfo?.companyName || 
    (onboardingData.contactInfo ? 
      `${onboardingData.contactInfo.firstName} ${onboardingData.contactInfo.lastName}` : 
      t('contracts.detail.messages.unknownClient'));

  // Calculate completion percentage
  const completionPercentage = contract.current_step ? Math.round((contract.current_step / 7) * 100) : 0;

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'text-gray-600',
      'submitted': 'text-blue-600',
      'approved': 'text-green-600',
      'rejected': 'text-red-600',
      'signed': 'text-emerald-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  const contractActions = [
    <Button 
      key="back"
      variant="outline" 
      onClick={() => navigate('/admin/merchants/contracts')}
      className="hover:bg-muted min-h-[44px] text-sm px-3"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">{t('contracts.detail.actions.backToList')}</span>
      <span className="sm:hidden">Späť</span>
    </Button>,
    <Button 
      key="export"
      variant="outline" 
      className="hover:bg-muted min-h-[44px] text-sm px-3"
    >
      <Download className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">{t('contracts.detail.actions.exportPdf')}</span>
      <span className="sm:hidden">PDF</span>
    </Button>,
    ...(isEditMode && clientOperationsHasChanges ? [
      <Button 
        key="save"
        onClick={handleSave}
        disabled={updateContract.isPending}
        className="bg-emerald-600 hover:bg-emerald-700 min-h-[44px] text-sm px-3"
      >
        {updateContract.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span className="hidden sm:inline">{t('contracts.detail.actions.saving')}</span>
            <span className="sm:hidden">...</span>
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('contracts.detail.actions.saveChanges')}</span>
            <span className="sm:hidden">Uložiť</span>
          </>
        )}
      </Button>
    ] : []),
    <Button 
      key="edit"
      onClick={handleToggleEdit}
      variant={isEditMode ? "destructive" : "outline"}
      className={`min-h-[44px] text-sm px-3 ${isEditMode ? "hover:bg-red-700" : "hover:bg-muted"}`}
    >
      {isEditMode ? (
        <>
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{t('contracts.detail.actions.cancelEdit')}</span>
          <span className="sm:hidden">Zrušiť</span>
        </>
      ) : (
        <>
          <Edit className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{t('contracts.detail.actions.edit')}</span>
          <span className="sm:hidden">Upraviť</span>
        </>
      )}
    </Button>
  ];

  return (
    <AdminLayout 
      title={`${t('contracts.title')} #${contract.contract_number}`}
      subtitle={`${clientName} • ${completionPercentage}% ${t('contracts.detail.status.completed')} • ${contract.status}`}
      actions={contractActions}
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full overflow-x-auto">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-full md:min-w-0">
              <TabsTrigger value="overview" className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 text-sm whitespace-nowrap min-h-[44px]">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{t('contracts.detail.tabs.overview')}</span>
                <span className="sm:hidden">Prehľad</span>
              </TabsTrigger>
              <TabsTrigger value="client" className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 text-sm whitespace-nowrap min-h-[44px]">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{t('contracts.detail.tabs.client')}</span>
                <span className="sm:hidden">Klient</span>
              </TabsTrigger>
              <TabsTrigger value="devices" className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 text-sm whitespace-nowrap min-h-[44px]">
                <Settings className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{t('contracts.detail.tabs.devices')}</span>
                <span className="sm:hidden">Zariadenia</span>
              </TabsTrigger>
              <TabsTrigger value="finance" className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 text-sm whitespace-nowrap min-h-[44px]">
                <Calculator className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{t('contracts.detail.tabs.finance')}</span>
                <span className="sm:hidden">Financie</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 text-sm whitespace-nowrap min-h-[44px]">
                <FolderOpen className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{t('contracts.detail.tabs.documents')}</span>
                <span className="sm:hidden">Dokumenty</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 text-sm whitespace-nowrap min-h-[44px]">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{t('contracts.detail.tabs.history')}</span>
                <span className="sm:hidden">História</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <ContractOverviewTab
              contract={contract}
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onDelete={handleDelete}
              isDeleting={deleteContract.isPending}
            />
          </TabsContent>

          <TabsContent value="client" className="mt-6">
            <ContractClientTab
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onUpdate={handleClientOperationsUpdate}
              onLocalChanges={handleClientOperationsLocalChanges}
            />
          </TabsContent>

          <TabsContent value="devices" className="mt-6">
            <ContractDevicesTab
              onboardingData={onboardingData}
              isEditMode={isEditMode}
              onSave={async (data) => console.log('Devices save:', data)}
            />
          </TabsContent>

          <TabsContent value="finance" className="mt-6">
            <ContractFinanceTab
              onboardingData={onboardingData}
              contract={contract}
            />
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <ContractDocumentsTab
              contractId={contract.id}
              contractNumber={contract.contract_number}
              documentUrl={contract.document_url}
              signedDocumentUrl={contract.signed_document_url}
              documentUploadedAt={contract.document_uploaded_at}
              documentSignedAt={contract.document_signed_at}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ContractHistoryTab contractId={contract.id} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ContractDetailPage;