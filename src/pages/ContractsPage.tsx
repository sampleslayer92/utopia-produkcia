
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import EnhancedContractsTable from "@/components/admin/EnhancedContractsTable";
import ContractFilters from "@/components/admin/ContractFilters";
import MerchantTestingPanel from "@/components/admin/MerchantTestingPanel";
import CollapsibleFilters from "@/components/admin/shared/CollapsibleFilters";
import StatsCardsSection from "@/components/admin/shared/StatsCardsSection";
import { useContractsStats } from "@/hooks/useAdminStats";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileText, Euro, Clock, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContractMerchantFix } from "@/hooks/useContractMerchantFix";

const ContractsPage = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useContractsStats();
  const { fixAllContractsWithoutMerchants, isFixing } = useContractMerchantFix();
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    merchant: 'all',
    source: 'all'
  });

  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== 'all').length;

  const statsCards = [
    {
      title: t('contracts.stats.activeContracts'),
      value: stats?.activeContracts || 0,
      subtitle: t('contracts.stats.approvedSigned'),
      icon: FileText,
      iconColor: "bg-blue-500"
    },
    {
      title: t('contracts.stats.totalValue'),
      value: `€${(stats?.totalValue || 0).toFixed(2)}`,
      subtitle: t('contracts.stats.monthlyIncome'),
      icon: Euro,
      iconColor: "bg-emerald-500"
    },
    {
      title: t('contracts.stats.expiringContracts'),
      value: stats?.expiringContracts || 0,
      subtitle: t('contracts.stats.olderThan11Months'),
      icon: Clock,
      iconColor: "bg-orange-500"
    }
  ];

  const contractsActions = (
    <>
      <Button 
        variant="outline" 
        onClick={fixAllContractsWithoutMerchants}
        disabled={isFixing}
        className="hover:bg-slate-50"
      >
        <Settings className="h-4 w-4 mr-2" />
        {isFixing ? t('contracts.actions.fixing') : t('contracts.actions.fixMerchants')}
      </Button>
      <Button variant="outline" className="hover:bg-slate-50">
        <Download className="h-4 w-4 mr-2" />
        {t('contracts.export')}
      </Button>
      <Button 
        onClick={() => navigate('/admin/onboarding')}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('contracts.newContract')}
      </Button>
    </>
  );

  return (
    <>
      <AdminLayout 
        title={t('contracts.title')} 
        subtitle={t('contracts.subtitle')}
        actions={contractsActions}
      >
        <div className="space-y-6">
          <StatsCardsSection stats={statsCards} isLoading={statsLoading} />
          <CollapsibleFilters activeFiltersCount={activeFiltersCount}>
            <ContractFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </CollapsibleFilters>
          <EnhancedContractsTable filters={filters} />
        </div>
      </AdminLayout>
      <MerchantTestingPanel />
    </>
  );
};

export default ContractsPage;
