import { useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import BusinessLocationDetail from "@/components/admin/BusinessLocationDetail";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const BusinessLocationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');

  const businessLocationActions = (
    <>
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/merchants/locations')}
        className="hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('businessLocation.detail.backToLocations')}
      </Button>
      <Button className="bg-blue-600 hover:bg-blue-700">
        <Edit className="h-4 w-4 mr-2" />
        {t('businessLocation.detail.editLocation')}
      </Button>
    </>
  );

  return (
    <AdminLayout 
      title={t('businessLocation.detail.title')}
      subtitle={t('businessLocation.detail.subtitle')}
      actions={businessLocationActions}
    >
      <BusinessLocationDetail locationId={id!} />
    </AdminLayout>
  );
};

export default BusinessLocationDetailPage;