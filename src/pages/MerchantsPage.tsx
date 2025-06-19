
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import MerchantsTable from "@/components/admin/MerchantsTable";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MerchantsPage = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();

  const merchantsActions = (
    <>
      <Button variant="outline" className="hover:bg-slate-50">
        <Download className="h-4 w-4 mr-2" />
        {t('merchants.export')}
      </Button>
      <Button 
        onClick={() => navigate('/onboarding')}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('merchants.newContract')}
      </Button>
    </>
  );

  return (
    <AdminLayout 
      title={t('merchants.title')} 
      subtitle={t('merchants.subtitle')}
      actions={merchantsActions}
    >
      <MerchantsTable />
    </AdminLayout>
  );
};

export default MerchantsPage;
