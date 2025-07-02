import { useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import BusinessLocationDetail from "@/components/admin/BusinessLocationDetail";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BusinessLocationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const businessLocationActions = (
    <>
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/merchants/locations')}
        className="hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Späť na prevádzky
      </Button>
      <Button className="bg-blue-600 hover:bg-blue-700">
        <Edit className="h-4 w-4 mr-2" />
        Upraviť prevádzku
      </Button>
    </>
  );

  return (
    <AdminLayout 
      title="Detail prevádzky" 
      subtitle="Informácie o prevádzkovo mieste"
      actions={businessLocationActions}
    >
      <BusinessLocationDetail locationId={id!} />
    </AdminLayout>
  );
};

export default BusinessLocationDetailPage;