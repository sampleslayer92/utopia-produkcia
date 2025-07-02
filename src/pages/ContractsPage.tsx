
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
import { Plus, Download, FileText, Euro, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContractsPage = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useContractsStats();
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    merchant: 'all',
    source: 'all'
  });

  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== 'all').length;

  const statsCards = [
    {
      title: "Aktívne zmluvy",
      value: stats?.activeContracts || 0,
      subtitle: "Schválené a podpísané",
      icon: FileText,
      iconColor: "bg-blue-500"
    },
    {
      title: "Celková hodnota",
      value: `€${(stats?.totalValue || 0).toFixed(2)}`,
      subtitle: "Mesačný príjem",
      icon: Euro,
      iconColor: "bg-emerald-500"
    },
    {
      title: "Expirujúce",
      value: stats?.expiringContracts || 0,
      subtitle: "Staršie ako 11 mesiacov",
      icon: Clock,
      iconColor: "bg-orange-500"
    }
  ];

  const contractsActions = (
    <>
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
