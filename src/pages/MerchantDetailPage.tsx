import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ContractCopyModal from "@/components/admin/ContractCopyModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Plus, 
  Loader2, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  MapIcon,
  Euro,
  Download,
  Edit
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useMerchantDetail } from "@/hooks/useMerchantDetail";
import MerchantStats from "@/components/admin/MerchantStats";
import MerchantContracts from "@/components/admin/MerchantContracts";
import MerchantLocations from "@/components/admin/MerchantLocations";
import { useTranslation } from 'react-i18next';

const MerchantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showContractCopyModal, setShowContractCopyModal] = useState(false);
  const { data: merchantData, isLoading, error } = useMerchantDetail(id!);
  const { t } = useTranslation(['admin', 'ui']);

  if (isLoading) {
    return (
      <AdminLayout title={t('ui:table.loading')} subtitle={t('merchants.detail.title')}>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>{t('ui:table.loading')}...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !merchantData) {
    return (
      <AdminLayout title={t('ui:validation.error')} subtitle={t('merchants.detail.title')}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">
              {error ? t('ui:table.error') : t('admin:merchants.detail.messages.merchantNotFound')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error 
                ? `${t('ui:table.error')}. ${error.message}`
                : t('admin:merchants.detail.messages.merchantNotFoundDesc', { id })
              }
            </p>
            <Button onClick={() => navigate('/admin/merchants')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('ui:buttons.cancel')}
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const { merchant, statistics } = merchantData;

  const merchantActions = (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/merchants')}
        className="hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('ui:buttons.cancel')}
      </Button>
      <Button variant="outline" className="hover:bg-muted">
        <Download className="h-4 w-4 mr-2" />
        {t('ui:buttons.exportLocations')}
      </Button>
      <Button variant="outline" className="hover:bg-muted">
        <Edit className="h-4 w-4 mr-2" />
        {t('ui:buttons.edit')}
      </Button>
      <Button 
        onClick={() => setShowContractCopyModal(true)}
        className="bg-primary hover:bg-primary/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('admin:contracts.new')}
      </Button>
    </div>
  );

  return (
    <AdminLayout 
      title={merchant.company_name} 
      subtitle={`${t('ui:form.labels.ico')}: ${merchant.ico || 'N/A'} • ${statistics.total_contracts} ${t('admin:contracts.title').toLowerCase()} • ${statistics.total_locations} ${t('merchants.detail.locations.title').toLowerCase()}`}
      actions={merchantActions}
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('merchants.detail.tabs.overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center space-x-2">
              <MapIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{t('merchants.detail.tabs.locations')}</span>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{t('merchants.detail.tabs.contracts')}</span>
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center space-x-2">
              <Euro className="h-4 w-4" />
              <span className="hidden sm:inline">{t('merchants.detail.tabs.finance')}</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2 hidden lg:flex">
              <User className="h-4 w-4" />
              <span>{t('merchants.detail.tabs.activity')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Quick Stats */}
            <MerchantStats statistics={statistics} />
            
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  {t('merchants.detail.basicInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('ui:form.labels.companyName')}</label>
                      <p className="text-foreground font-medium">{merchant.company_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('ui:form.labels.ico')}</label>
                      <p className="text-foreground">{merchant.ico || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('ui:form.labels.dic')}</label>
                      <p className="text-foreground">{merchant.dic || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {t('ui:form.labels.contactPerson')}
                      </label>
                      <p className="text-foreground font-medium">{merchant.contact_person_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {t('ui:form.labels.email')}
                      </label>
                      <p className="text-foreground">{merchant.contact_person_email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {t('ui:form.labels.phone')}
                      </label>
                      <p className="text-foreground">{merchant.contact_person_phone || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {t('ui:form.labels.address')}
                      </label>
                      <div className="text-foreground">
                        {merchant.address_street && <p>{merchant.address_street}</p>}
                        {merchant.address_city && (
                          <p>
                            {merchant.address_zip_code && `${merchant.address_zip_code} `}
                            {merchant.address_city}
                          </p>
                        )}
                        {!merchant.address_street && !merchant.address_city && <p>N/A</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('merchants.detail.latestContracts')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {merchantData.contracts.slice(0, 3).map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">#{contract.contract_number}</p>
                        <p className="text-xs text-muted-foreground">{contract.status}</p>
                      </div>
                      <p className="text-sm font-medium text-primary">€{contract.total_monthly_profit.toFixed(2)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('merchants.detail.topLocations')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {merchantData.locations
                    .sort((a, b) => (b.estimated_turnover || 0) - (a.estimated_turnover || 0))
                    .slice(0, 3)
                    .map((location) => (
                    <div key={location.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">{location.name}</p>
                        <p className="text-xs text-muted-foreground">{location.business_sector}</p>
                      </div>
                      <p className="text-sm font-medium text-primary">€{(location.estimated_turnover || 0).toLocaleString()}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="locations" className="mt-6">
            <MerchantLocations locations={merchantData.locations} />
          </TabsContent>

          <TabsContent value="contracts" className="mt-6">
            <MerchantContracts contracts={merchantData.contracts} />
          </TabsContent>

          <TabsContent value="finance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('merchants.detail.financialOverview')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('merchants.detail.stats.monthlyProfit')}:</span>
                      <span className="font-bold text-primary">€{statistics.total_monthly_profit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('merchants.detail.stats.avgContractValue')}:</span>
                      <span className="font-medium">€{statistics.avg_contract_value.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('merchants.detail.stats.plannedTurnover')}:</span>
                      <span className="font-medium">€{statistics.total_estimated_turnover.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('merchants.detail.trends')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Euro className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('merchants.detail.analysis')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('merchants.detail.recentActivity')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('merchants.detail.activityHistory')}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <ContractCopyModal
        open={showContractCopyModal}
        onOpenChange={setShowContractCopyModal}
        contracts={merchantData.contracts}
        merchantId={merchant.id}
      />
    </AdminLayout>
  );
};

export default MerchantDetailPage;