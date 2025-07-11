
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import MerchantsTable from "@/components/admin/MerchantsTable";
import AddMerchantModal from "@/components/admin/AddMerchantModal";
import StatsCardsSection from "@/components/admin/shared/StatsCardsSection";
import { useMerchantsStats } from "@/hooks/useAdminStats";
import { Button } from "@/components/ui/button";
import { Plus, Download, Building2, HandCoins, TrendingUp } from "lucide-react";

const MerchantsPage = () => {
  const { t } = useTranslation('admin');
  const { data: stats, isLoading: statsLoading } = useMerchantsStats();
  const [showAddMerchantModal, setShowAddMerchantModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
      <Button variant="outline" className="hover:bg-slate-50 min-h-touch">
        <Download className="h-4 w-4 mr-2" />
        {t('merchants.export')}
      </Button>
      <Button 
        onClick={() => setShowAddMerchantModal(true)}
        className="bg-blue-600 hover:bg-blue-700 min-h-touch"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('merchants.newMerchant')}
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
