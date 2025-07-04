import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/admin/AdminLayout';
import { OrganizationCard } from '@/components/admin/organization/OrganizationCard';
import { CreateOrganizationModal } from '@/components/admin/organization/CreateOrganizationModal';
import OrganizationFilters from '@/components/admin/organization/OrganizationFilters';
import CollapsibleFilters from '@/components/admin/shared/CollapsibleFilters';
import StatsCardsSection from '@/components/admin/shared/StatsCardsSection';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useOrganizationsStats } from '@/hooks/useOrganizationsStats';
import { Button } from '@/components/ui/button';
import { Plus, Download, Building, Users, Network } from 'lucide-react';

const OrganizationsPage = () => {
  const { t } = useTranslation('admin');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: organizations, isLoading } = useOrganizations();
  const { data: stats, isLoading: statsLoading } = useOrganizationsStats();
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });

  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== 'all').length;

  // Filter organizations based on filters
  const filteredOrganizations = organizations?.filter(org => {
    if (filters.search && !org.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all') {
      if (filters.status === 'active' && !org.is_active) return false;
      if (filters.status === 'inactive' && org.is_active) return false;
    }
    return true;
  });

  const statsCards = [
    {
      title: t('organizations.stats.totalOrganizations'),
      value: stats?.totalOrganizations || 0,
      subtitle: t('organizations.stats.allRegistered'),
      icon: Building,
      iconColor: "bg-blue-500"
    },
    {
      title: t('organizations.stats.activeOrganizations'),
      value: stats?.activeOrganizations || 0,
      subtitle: t('organizations.stats.currentlyActive'),
      icon: Network,
      iconColor: "bg-emerald-500"
    },
    {
      title: t('organizations.stats.totalMembers'),
      value: stats?.totalMembers || 0,
      subtitle: t('organizations.stats.acrossAllOrgs'),
      icon: Users,
      iconColor: "bg-purple-500"
    }
  ];

  const organizationsActions = (
    <>
      <Button variant="outline" className="hover:bg-slate-50">
        <Download className="h-4 w-4 mr-2" />
        {t('organizations.export')}
      </Button>
      <Button 
        onClick={() => setShowCreateModal(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('organizations.createOrganization')}
      </Button>
    </>
  );

  return (
    <>
      <AdminLayout 
        title={t('organizations.title')} 
        subtitle={t('organizations.subtitle')}
        actions={organizationsActions}
      >
        <div className="space-y-6">
          <StatsCardsSection stats={statsCards} isLoading={statsLoading} />
          
          <CollapsibleFilters activeFiltersCount={activeFiltersCount}>
            <OrganizationFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </CollapsibleFilters>

          {/* Organizations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg animate-pulse" />
              ))
            ) : (
              filteredOrganizations?.map((organization) => (
                <OrganizationCard key={organization.id} organization={organization} />
              ))
            )}
          </div>

          {filteredOrganizations?.length === 0 && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <Building className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>{t('organizations.noResults')}</p>
            </div>
          )}
        </div>
      </AdminLayout>

      <CreateOrganizationModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
};

export default OrganizationsPage;