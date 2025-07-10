import { useState } from "react";
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import EnhancedContractsTable from "@/components/admin/EnhancedContractsTable";
import ContractFilters from "@/components/admin/ContractFilters";
import CollapsibleFilters from "@/components/admin/shared/CollapsibleFilters";
import StatsCardsSection from "@/components/admin/shared/StatsCardsSection";
import { useContractsStats } from "@/hooks/useAdminStats";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileQuestion, Euro, Clock, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RequestsPage = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  
  // Initialize filters for requests (unsigned contracts)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    merchant: 'all',
    source: 'all'
  });

  // Get stats but filter for non-signed contracts only
  const { data: stats, isLoading: statsLoading } = useContractsStats();

  // Calculate active filters count
  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== 'all').length;

  // Stats cards specifically for requests
  const statsCards = [
    {
      title: t('requests.stats.pendingRequests'),
      value: stats?.activeContracts || 0,
      subtitle: t('requests.stats.awaitingReview'),
      icon: FileQuestion,
      iconColor: "bg-blue-500"
    },
    {
      title: t('requests.stats.inProgress'),
      value: 0,
      subtitle: t('requests.stats.beingProcessed'),
      icon: FileQuestion,
      iconColor: "bg-orange-500"
    },
    {
      title: t('requests.stats.waitingForSignature'),
      value: 0,
      subtitle: t('requests.stats.readyToSign'),
      icon: FileQuestion,
      iconColor: "bg-green-500"
    },
    {
      title: t('requests.stats.totalValue'),
      value: `€${(stats?.totalValue || 0).toFixed(2)}`,
      subtitle: t('requests.stats.estimatedValue'),
      icon: Euro,
      iconColor: "bg-emerald-500"
    }
  ];

  // Actions for requests
  const requestsActions = (
    <div className="flex gap-3">
      <Button
        onClick={() => navigate('/admin/onboarding')}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('requests.actions.newRequest')}
      </Button>
      <Button variant="outline">
        <Download className="h-4 w-4 mr-2" />
        {t('requests.actions.export')}
      </Button>
    </div>
  );

  return (
    <AdminLayout
      title={t('requests.title')}
      subtitle={t('requests.subtitle')}
      actions={requestsActions}
    >
      <div className="space-y-6">
        <StatsCardsSection stats={statsCards} isLoading={statsLoading} />
        
        <CollapsibleFilters activeFiltersCount={activeFiltersCount}>
          <ContractFilters 
            filters={filters} 
            onFiltersChange={setFilters}
          />
        </CollapsibleFilters>

        <EnhancedContractsTable 
          filters={filters}
        />
      </div>
    </AdminLayout>
  );
};

export default RequestsPage;