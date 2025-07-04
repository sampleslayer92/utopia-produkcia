import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/admin/AdminLayout';
import { TeamCard } from '@/components/admin/team/TeamCard';
import { CreateTeamModal } from '@/components/admin/team/CreateTeamModal';
import TeamFilters from '@/components/admin/team/TeamFilters';
import CollapsibleFilters from '@/components/admin/shared/CollapsibleFilters';
import StatsCardsSection from '@/components/admin/shared/StatsCardsSection';
import { useTeams } from '@/hooks/useTeams';
import { useTeamsStats } from '@/hooks/useTeamsStats';
import { Button } from '@/components/ui/button';
import { Plus, Download, Users, Shield, Building } from 'lucide-react';

const OrganizationalTeamsPage = () => {
  const { t } = useTranslation('admin');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: teams, isLoading } = useTeams();
  const { data: stats, isLoading: statsLoading } = useTeamsStats();
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    organization: 'all'
  });

  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== 'all').length;

  // Filter teams based on filters
  const filteredTeams = teams?.filter(team => {
    if (filters.search && !team.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all') {
      if (filters.status === 'active' && !team.is_active) return false;
      if (filters.status === 'inactive' && team.is_active) return false;
    }
    if (filters.organization !== 'all' && team.organization_id !== filters.organization) {
      return false;
    }
    return true;
  });

  const statsCards = [
    {
      title: t('teams.stats.totalTeams'),
      value: stats?.totalTeams || 0,
      subtitle: t('teams.stats.allRegistered'),
      icon: Users,
      iconColor: "bg-blue-500"
    },
    {
      title: t('teams.stats.activeTeams'),
      value: stats?.activeTeams || 0,
      subtitle: t('teams.stats.currentlyActive'),
      icon: Building,
      iconColor: "bg-emerald-500"
    },
    {
      title: t('teams.stats.teamsWithLeaders'),
      value: stats?.teamsWithLeaders || 0,
      subtitle: t('teams.stats.haveAssignedLeaders'),
      icon: Shield,
      iconColor: "bg-purple-500"
    }
  ];

  const teamsActions = (
    <>
      <Button variant="outline" className="hover:bg-slate-50">
        <Download className="h-4 w-4 mr-2" />
        {t('teams.export')}
      </Button>
      <Button 
        onClick={() => setShowCreateModal(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('teams.createTeam')}
      </Button>
    </>
  );

  return (
    <>
      <AdminLayout 
        title={t('teams.title')} 
        subtitle={t('teams.subtitle')}
        actions={teamsActions}
      >
        <div className="space-y-6">
          <StatsCardsSection stats={statsCards} isLoading={statsLoading} />
          
          <CollapsibleFilters activeFiltersCount={activeFiltersCount}>
            <TeamFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </CollapsibleFilters>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg animate-pulse" />
              ))
            ) : (
              filteredTeams?.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))
            )}
          </div>

          {filteredTeams?.length === 0 && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>{t('teams.noResults')}</p>
            </div>
          )}
        </div>
      </AdminLayout>

      <CreateTeamModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
};

export default OrganizationalTeamsPage;