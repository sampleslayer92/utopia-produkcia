
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import MerchantsTable from "@/components/admin/MerchantsTable";
import MerchantFilters from "@/components/admin/MerchantFilters";
import AddMerchantModal from "@/components/admin/AddMerchantModal";
import CollapsibleFilters from "@/components/admin/shared/CollapsibleFilters";
import StatsCardsSection from "@/components/admin/shared/StatsCardsSection";
import { useMerchantsStats } from "@/hooks/useAdminStats";
import { Button } from "@/components/ui/button";
import { Plus, Download, Building2, HandCoins, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const MerchantsPage = () => {
  const { t } = useTranslation('admin');
  const { data: stats, isLoading: statsLoading } = useMerchantsStats();
  const [showAddMerchantModal, setShowAddMerchantModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    city: 'all',
    hasContracts: 'all',
    profitRange: 'all'
  });
  const isMobile = useIsMobile();

  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== 'all').length;

  const statsCards = [
    {
      title: t('merchants.stats.totalCount'),
      value: stats?.totalMerchants || 0,
      subtitle: t('merchants.stats.allRegistered'),
      icon: Building2,
      iconColor: "bg-blue-500"
    },
    {
      title: t('merchants.stats.activeWithContracts'),
      value: stats?.activeWithContracts || 0,
      subtitle: t('merchants.stats.haveSignedContracts'),
      icon: HandCoins,
      iconColor: "bg-emerald-500"
    },
    {
      title: t('merchants.stats.averageProfit'),
      value: `€${(stats?.averageProfit || 0).toFixed(2)}`,
      subtitle: t('merchants.stats.monthlyPerMerchant'),
      icon: TrendingUp,
      iconColor: "bg-purple-500"
    }
  ];

  const handleMerchantCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const merchantsActions = (
    <>
      {!isMobile && (
        <Button variant="outline" className="hover:bg-slate-50 min-h-touch">
          <Download className="h-4 w-4 mr-2" />
          {t('merchants.export')}
        </Button>
      )}
      <Button 
        onClick={() => setShowAddMerchantModal(true)}
        className="bg-blue-600 hover:bg-blue-700 min-h-touch"
        size={isMobile ? "sm" : "default"}
      >
        <Plus className="h-4 w-4 mr-2" />
        {isMobile ? t('merchants.add') : t('merchants.newMerchant')}
      </Button>
    </>
  );

  return (
    <AdminLayout 
      title={t('merchants.title')} 
      subtitle={t('merchants.subtitle')}
      actions={merchantsActions}
    >
      <div className="space-y-4 md:space-y-6">
        <StatsCardsSection stats={statsCards} isLoading={statsLoading} />
        <CollapsibleFilters activeFiltersCount={activeFiltersCount}>
          <MerchantFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CollapsibleFilters>
        <MerchantsTable key={refreshKey} filters={filters} />
      </div>
      <AddMerchantModal 
        open={showAddMerchantModal}
        onOpenChange={setShowAddMerchantModal}
        onSuccess={handleMerchantCreated}
      />
    </AdminLayout>
  );
};

export default MerchantsPage;
