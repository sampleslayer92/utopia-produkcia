
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import NewDashboardContent from "@/components/admin/dashboard/NewDashboardContent";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PartnerDashboard = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { profile } = useAuth();

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
      title={`Vitajte, ${profile?.first_name}!`}
      subtitle="Partner Dashboard - Vaše štatistiky a zmluvy"
      actions={dashboardActions}
    >
      <div className="space-y-6">
        {/* Partner Welcome Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Users className="h-5 w-5" />
              Partner Dashboard
            </CardTitle>
            <CardDescription className="text-blue-700">
              Správa vašich zmlúv a sledovanie výkonnosti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">0</div>
                <div className="text-sm text-blue-700">Aktívne zmluvy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">0</div>
                <div className="text-sm text-blue-700">Tento mesiac</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">€0</div>
                <div className="text-sm text-blue-700">Celkový príjem</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Standard Dashboard Content (will be filtered for partner) */}
        <NewDashboardContent />
      </div>
    </AdminLayout>
  );
};

export default PartnerDashboard;
