import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  User, 
  Building2, 
  Calculator, 
  Mail, 
  Phone, 
  Calendar,
  AlertTriangle,
  Trash2,
  CheckCircle,
  Clock,
  Euro
} from "lucide-react";
import { format } from "date-fns";
import ContractActions from "../contract-detail/ContractActions";
import { useTranslation } from 'react-i18next';

interface ContractOverviewTabProps {
  contract: any;
  onboardingData: any;
  isEditMode: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}

const ContractOverviewTab = ({
  contract,
  onboardingData,
  isEditMode,
  onDelete,
  isDeleting
}: ContractOverviewTabProps) => {
  const { t } = useTranslation('admin');
  // Calculate completion percentage
  const completionPercentage = contract.current_step ? Math.round((contract.current_step / 7) * 100) : 0;
  
  // Get monthly profit from calculations
  const monthlyProfit = onboardingData.contractCalculations?.totalMonthlyProfit || 0;
  
  // Count devices and services
  const devicesCount = onboardingData.contractItems?.filter((item: any) => item.itemType === 'device')?.length || 0;
  const servicesCount = onboardingData.contractItems?.filter((item: any) => item.itemType === 'service')?.length || 0;
  
  // Get client name
  const clientName = onboardingData.companyInfo?.companyName || 
    (onboardingData.contactInfo ? 
      `${onboardingData.contactInfo.firstName} ${onboardingData.contactInfo.lastName}` : 
      t('contracts.detail.overview.unknownClient'));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'signed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'signed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Euro className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{t('contracts.detail.overview.monthlyProfit')}</p>
                <p className="text-2xl font-bold">€{monthlyProfit.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{t('contracts.detail.overview.completion')}</p>
                <p className="text-2xl font-bold">{completionPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{t('contracts.detail.overview.devices')}</p>
                <p className="text-2xl font-bold">{devicesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{t('contracts.detail.overview.services')}</p>
                <p className="text-2xl font-bold">{servicesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {t('contracts.detail.overview.basicInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('contracts.detail.overview.contractNumber')}</label>
                    <p className="text-foreground font-medium">#{contract.contract_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('contracts.detail.overview.status')}</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(contract.status)}
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('contracts.detail.overview.source')}</label>
                    <p className="text-foreground">{contract.source || t('contracts.detail.overview.unknown')}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {t('contracts.detail.overview.created')}
                    </label>
                    <p className="text-foreground">{format(new Date(contract.created_at), 'dd.MM.yyyy HH:mm')}</p>
                  </div>
                  {contract.submitted_at && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('contracts.detail.overview.submitted')}</label>
                      <p className="text-foreground">{format(new Date(contract.submitted_at), 'dd.MM.yyyy HH:mm')}</p>
                    </div>
                  )}
                  {contract.signed_at && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('contracts.detail.overview.signed')}</label>
                      <p className="text-foreground">{format(new Date(contract.signed_at), 'dd.MM.yyyy HH:mm')}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                {t('contracts.detail.overview.clientInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('contracts.detail.overview.clientName')}</label>
                    <p className="text-foreground font-medium">{clientName}</p>
                  </div>
                  {onboardingData.companyInfo?.ico && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('contracts.detail.overview.ico')}</label>
                      <p className="text-foreground">{onboardingData.companyInfo.ico}</p>
                    </div>
                  )}
                  {onboardingData.contactInfo?.email && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {t('contracts.detail.overview.email')}
                      </label>
                      <p className="text-foreground">{onboardingData.contactInfo.email}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {onboardingData.contactInfo?.phone && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {t('contracts.detail.overview.phone')}
                      </label>
                      <p className="text-foreground">
                        {onboardingData.contactInfo.phonePrefix} {onboardingData.contactInfo.phone}
                      </p>
                    </div>
                  )}
                  {onboardingData.businessLocations?.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('contracts.detail.overview.businessLocationsCount')}</label>
                      <p className="text-foreground">{onboardingData.businessLocations.length}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel */}
        <div className="space-y-6">
          <ContractActions
            contract={contract}
            onboardingData={onboardingData}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('contracts.detail.overview.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                {t('contracts.detail.overview.generatePdf')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                {t('contracts.detail.overview.sendToClient')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calculator className="h-4 w-4 mr-2" />
                {t('contracts.detail.overview.recalculate')}
              </Button>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('contracts.detail.overview.progressStatus')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('contracts.detail.overview.progress')}</span>
                  <span>{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('contracts.detail.overview.stepOf', { current: contract.current_step || 1, total: 7 })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractOverviewTab;