import { useTranslation } from 'react-i18next';
import { Network, Building, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useTeams } from '@/hooks/useTeams';

const OrganizationalStructurePage = () => {
  const { t } = useTranslation('admin');
  const { data: organizations } = useOrganizations();
  const { data: teams } = useTeams();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('organizationalStructure.title')}</h1>
          <p className="text-muted-foreground">{t('organizationalStructure.subtitle')}</p>
        </div>
      </div>

      {/* Overview Cards */}
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
            <CardTitle className="text-sm font-medium">{t('teams.stats.totalTeams')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('organizationalStructure.totalMembers')}</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Organizational Structure Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            {t('organizationalStructure.visualization')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Network className="h-16 w-16 mx-auto mb-4" />
            <p>{t('organizationalStructure.comingSoon')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationalStructurePage;