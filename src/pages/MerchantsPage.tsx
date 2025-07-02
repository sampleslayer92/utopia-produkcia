
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import MerchantsTable from "@/components/admin/MerchantsTable";
import AddMerchantModal from "@/components/admin/AddMerchantModal";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

const MerchantsPage = () => {
  const { t } = useTranslation('admin');
  const [showAddMerchantModal, setShowAddMerchantModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMerchantCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const merchantsActions = (
    <>
      <Button variant="outline" className="hover:bg-slate-50">
        <Download className="h-4 w-4 mr-2" />
        {t('merchants.export')}
      </Button>
      <Button 
        onClick={() => setShowAddMerchantModal(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nový merchant
      </Button>
    </>
  );

  return (
    <AdminLayout 
      title={t('merchants.title')} 
      subtitle={t('merchants.subtitle')}
      actions={merchantsActions}
    >
      <MerchantsTable key={refreshKey} />
      <AddMerchantModal 
        open={showAddMerchantModal}
        onOpenChange={setShowAddMerchantModal}
        onSuccess={handleMerchantCreated}
      />
    </AdminLayout>
  );
};

export default MerchantsPage;
