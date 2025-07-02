import { useState } from "react";
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import BusinessLocationsTable from "@/components/admin/BusinessLocationsTable";
import BusinessLocationFilters from "@/components/admin/BusinessLocationFilters";
import CollapsibleFilters from "@/components/admin/shared/CollapsibleFilters";
import StatsCardsSection from "@/components/admin/shared/StatsCardsSection";
import { useBusinessLocationsStats } from "@/hooks/useAdminStats";
import { Button } from "@/components/ui/button";
import { Download, MapPin, CreditCard, TrendingUp } from "lucide-react";

const BusinessLocationsPage = () => {
  const { t } = useTranslation('admin');
  const { data: stats, isLoading: statsLoading } = useBusinessLocationsStats();
  const [filters, setFilters] = useState({
    merchant: 'all',
    sector: 'all',
    hasPos: 'all',
    search: ''
  });

  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== 'all').length;

  const statsCards = [
    {
      title: "Celkový počet",
      value: stats?.totalLocations || 0,
      subtitle: "Všetky prevádzky",
      icon: MapPin,
      iconColor: "bg-blue-500"
    },
    {
      title: "S POS terminálom",
      value: stats?.withPOS || 0,
      subtitle: "Majú platobné terminály",
      icon: CreditCard,
      iconColor: "bg-emerald-500"
    },
    {
      title: "Priemerný obrat",
      value: `€${(stats?.averageTurnover || 0).toFixed(0)}`,
      subtitle: "Mesačne na prevádzku",
      icon: TrendingUp,
      iconColor: "bg-purple-500"
    }
  ];

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
        <StatsCardsSection stats={statsCards} isLoading={statsLoading} />
        <CollapsibleFilters activeFiltersCount={activeFiltersCount}>
          <BusinessLocationFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CollapsibleFilters>
        <BusinessLocationsTable filters={filters} />
      </div>
    </AdminLayout>
  );
};

export default BusinessLocationsPage;