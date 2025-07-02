import { useState } from "react";
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import BusinessLocationsTable from "@/components/admin/BusinessLocationsTable";
import BusinessLocationFilters from "@/components/admin/BusinessLocationFilters";
import { Button } from "@/components/ui/button";
import { Download, MapPin } from "lucide-react";

const BusinessLocationsPage = () => {
  const { t } = useTranslation('admin');
  const [filters, setFilters] = useState({
    merchant: '',
    sector: '',
    hasPos: '',
    search: ''
  });

  const businessLocationsActions = (
    <>
      <Button variant="outline" className="hover:bg-slate-50">
        <Download className="h-4 w-4 mr-2" />
        Export prevádzkových miest
      </Button>
    </>
  );

  return (
    <AdminLayout 
      title="Prevádzky" 
      subtitle="Prehľad všetkých prevádzkových miest"
      actions={businessLocationsActions}
    >
      <div className="space-y-6">
        <BusinessLocationFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />
        <BusinessLocationsTable filters={filters} />
      </div>
    </AdminLayout>
  );
};

export default BusinessLocationsPage;