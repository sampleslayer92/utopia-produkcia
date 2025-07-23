
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import NewDashboardContent from "@/components/admin/dashboard/NewDashboardContent";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();

  const dashboardActions = (
    <Button 
      onClick={() => navigate('/admin/onboarding')}
      className="bg-blue-600 hover:bg-blue-700"
    >
      <Plus className="h-4 w-4 mr-2" />
      {t('dashboard.newContract')}
    </Button>
  );

  return (
    <AdminLayout 
      title={t('dashboard.title')} 
      subtitle={t('dashboard.subtitle')}
      actions={dashboardActions}
    >
      <NewDashboardContent />
    </AdminLayout>
  );
};

export default AdminDashboard;
