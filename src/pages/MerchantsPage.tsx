
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import MerchantsTable from "@/components/admin/MerchantsTable";
import AddMerchantModal from "@/components/admin/AddMerchantModal";
import StatsCardsSection from "@/components/admin/shared/StatsCardsSection";
import { useMerchantsStats } from "@/hooks/useAdminStats";
import { Button } from "@/components/ui/button";
import { Plus, Download, Building2, HandCoins, TrendingUp } from "lucide-react";
import { useViewport } from "@/hooks/useViewport";

const MerchantsPage = () => {
  const { t } = useTranslation('admin');
  const { data: stats, isLoading: statsLoading } = useMerchantsStats();
  const [showAddMerchantModal, setShowAddMerchantModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const viewport = useViewport();

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

  const getButtonSize = () => {
    if (viewport.width <= 1366) return "sm";
    return "default";
  };

  const merchantsActions = (
    <>
      <Button variant="outline" className="hover:bg-slate-50 min-h-touch" size={getButtonSize()}>
        <Download className="h-4 w-4 mr-2" />
        {viewport.width <= 1366 ? t('merchants.export') : t('merchants.export')}
      </Button>
      <Button 
        onClick={() => setShowAddMerchantModal(true)}
        className="bg-blue-600 hover:bg-blue-700 min-h-touch"
        size={getButtonSize()}
      >
        <Plus className="h-4 w-4 mr-2" />
        {viewport.width <= 1366 ? "Nový" : t('merchants.newMerchant')}
      </Button>
    </>
  );

  const getSpacing = () => {
    if (viewport.width <= 1366) return "space-y-3";
    if (viewport.width <= 1440) return "space-y-4";
    return "space-y-4 md:space-y-6";
  };

  return (
    <AdminLayout 
      title={t('merchants.title')} 
      subtitle={t('merchants.subtitle')}
      actions={merchantsActions}
    >
      <div className={getSpacing()}>
        <StatsCardsSection stats={statsCards} isLoading={statsLoading} />
        <MerchantsTable key={refreshKey} />
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
