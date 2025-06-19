
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminOnboardingPage = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();

  const onboardingActions = (
    <Button 
      variant="outline"
      onClick={() => navigate('/admin')}
      className="hover:bg-slate-50"
    >
      <ChevronLeft className="h-4 w-4 mr-2" />
      {t('contractDetail.backToList')}
    </Button>
  );

  return (
    <AdminLayout 
      title="Nová zmluva" 
      subtitle="Vytvorenie novej zmluvy a merchanta"
      actions={onboardingActions}
    >
      <OnboardingFlow isAdminMode={true} />
    </AdminLayout>
  );
};

export default AdminOnboardingPage;
