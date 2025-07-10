
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
      className="gradient-primary hover:scale-105 transition-all duration-300 shadow-lg font-semibold px-6 py-3 h-auto"
    >
      <Plus className="h-5 w-5 mr-2" />
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
