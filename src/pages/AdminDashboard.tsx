
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import NewDashboardContent from "@/components/admin/dashboard/NewDashboardContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const AdminDashboard = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();

  const dashboardActions = (
    <>
      <LanguageSwitcher />
      <Badge className="bg-green-100 text-green-700 border-green-200">
        <Activity className="h-3 w-3 mr-1" />
        {t('dashboard.status.online')}
      </Badge>
      <Button 
        onClick={() => navigate('/admin/onboarding')}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('dashboard.newContract')}
      </Button>
    </>
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
