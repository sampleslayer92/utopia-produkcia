
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import EnhancedContractsTable from "@/components/admin/EnhancedContractsTable";
import ContractFilters from "@/components/admin/ContractFilters";
import MerchantTestingPanel from "@/components/admin/MerchantTestingPanel";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContractsPage = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    merchant: 'all',
    source: 'all'
  });

  const contractsActions = (
    <>
      <Button variant="outline" className="hover:bg-slate-50">
        <Download className="h-4 w-4 mr-2" />
        {t('contracts.export')}
      </Button>
      <Button 
        onClick={() => navigate('/admin/onboarding')}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('contracts.newContract')}
      </Button>
    </>
  );

  return (
    <>
      <AdminLayout 
        title={t('contracts.title')} 
        subtitle={t('contracts.subtitle')}
        actions={contractsActions}
      >
        <div className="space-y-6">
          <ContractFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          <EnhancedContractsTable filters={filters} />
        </div>
      </AdminLayout>
      <MerchantTestingPanel />
    </>
  );
};

export default ContractsPage;
