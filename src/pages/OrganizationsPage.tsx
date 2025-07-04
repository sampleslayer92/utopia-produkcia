import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Plus, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganizations } from '@/hooks/useOrganizations';
import { OrganizationCard } from '@/components/admin/organization/OrganizationCard';
import { CreateOrganizationModal } from '@/components/admin/organization/CreateOrganizationModal';

const OrganizationsPage = () => {
  const { t } = useTranslation('admin');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: organizations, isLoading } = useOrganizations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('organizations.title')}</h1>
          <p className="text-muted-foreground">{t('organizations.subtitle')}</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('organizations.createOrganization')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('organizations.stats.totalOrganizations')}</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('organizations.stats.activeOrganizations')}</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations?.filter(org => org.is_active)?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('organizations.stats.totalTeams')}</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations?.map((organization) => (
          <OrganizationCard key={organization.id} organization={organization} />
        ))}
      </div>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};

export default OrganizationsPage;