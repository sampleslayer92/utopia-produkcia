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
      <AdminLayout title={t('detail.loading')} subtitle={t('detail.title')}>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>{t('detail.loadingDetail')}</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (contractDataResult.isError || !contractDataResult.data) {
    return (
      <AdminLayout title={t('detail.error')} subtitle={t('detail.title')}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">
              {contractDataResult.error ? t('detail.errorLoading') : t('detail.contractNotFound')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {contractDataResult.error 
                ? `${t('detail.errorMessage')} ${contractDataResult.error.message}`
                : t('detail.contractNotExists', { id })
              }
            </p>
            <Button onClick={() => navigate('/admin/merchants/contracts')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('detail.backToList')}
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
      t('detail.unknownClient'));

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

  const contractActions = (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/merchants/contracts')}
        className="hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('detail.backToList')}
      </Button>
      <Button variant="outline" className="hover:bg-muted">
        <Download className="h-4 w-4 mr-2" />
        {t('detail.exportPdf')}
      </Button>
      {isEditMode && clientOperationsHasChanges && (
        <Button 
          onClick={handleSave}
          disabled={updateContract.isPending}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {updateContract.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('detail.saving')}
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              {t('detail.saveChanges')}
            </>
          )}
        </Button>
      )}
      <Button 
        onClick={handleToggleEdit}
        variant={isEditMode ? "destructive" : "outline"}
        className={isEditMode ? "hover:bg-red-700" : "hover:bg-muted"}
      >
        {isEditMode ? (
          <>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('detail.cancelEdit')}
          </>
        ) : (
          <>
            <Edit className="h-4 w-4 mr-2" />
            {t('detail.edit')}
          </>
        )}
      </Button>
    </div>
  );

  return (
    <AdminLayout 
      title={`${t('contracts.title')} #${contract.contract_number}`}
      subtitle={`${clientName} • ${completionPercentage}% ${t('detail.completed')} • ${contract.status}`}
      actions={contractActions}
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{t('detail.tabs.overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="client" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t('detail.tabs.client')}</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t('detail.tabs.devices')}</span>
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">{t('detail.tabs.finance')}</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">{t('detail.tabs.documents')}</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2 hidden lg:flex">
              <Clock className="h-4 w-4" />
              <span>{t('detail.tabs.history')}</span>
            </TabsTrigger>
          </TabsList>

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