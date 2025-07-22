
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import NewDashboardContent from "@/components/admin/dashboard/NewDashboardContent";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminDashboard = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const dashboardActions = (
    <Button 
      onClick={() => navigate('/admin/onboarding')}
      variant={isMobile ? "mobile-optimized" : "primary-action"}
      size={isMobile ? "mobile-touch" : "default"}
    >
      <Plus className={isMobile ? "h-5 w-5 mr-2" : "h-4 w-4 mr-2"} />
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
