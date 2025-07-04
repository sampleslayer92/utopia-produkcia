import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTeamDetail } from '@/hooks/useTeamDetail';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Settings, BarChart, Edit } from 'lucide-react';
import { TeamMembersTab } from '@/components/admin/team/TeamMembersTab';
import { TeamOverviewTab } from '@/components/admin/team/TeamOverviewTab';
import { TeamStatsTab } from '@/components/admin/team/TeamStatsTab';
import { TeamSettingsTab } from '@/components/admin/team/TeamSettingsTab';

const TeamDetailPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: team, isLoading } = useTeamDetail(teamId!);

  if (isLoading) {
    return (
      <AdminLayout title={t('teams.loading')} subtitle="">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!team) {
    return (
      <AdminLayout title={t('teams.notFound')} subtitle="">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">{t('teams.notFound')}</h2>
          <Button onClick={() => navigate('/admin/organizations/teams')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('teams.backToTeams')}
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const teamActions = (
    <>
      <Button variant="outline" onClick={() => navigate('/admin/organizations/teams')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('teams.backToTeams')}
      </Button>
      <Button>
        <Edit className="h-4 w-4 mr-2" />
        {t('teams.editTeam')}
      </Button>
    </>
  );

  return (
    <AdminLayout 
      title={team.name}
      subtitle={team.description || t('teams.teamDetail')}
      actions={teamActions}
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-muted-foreground">
          <Link to="/admin/organizations" className="hover:text-primary">
            {t('organizations.title')}
          </Link>
          <span className="mx-2">/</span>
          <Link to="/admin/organizations/teams" className="hover:text-primary">
            {t('teams.title')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{team.name}</span>
        </nav>

        {/* Team Header Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                  {team.description && (
                    <p className="text-muted-foreground mt-1">{team.description}</p>
                  )}
                </div>
              </div>
              <Badge variant={team.is_active ? 'default' : 'secondary'}>
                {team.is_active ? t('common:status.active') : t('common:status.inactive')}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('teams.tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('teams.tabs.members')}
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              {t('teams.tabs.stats')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t('teams.tabs.settings')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <TeamOverviewTab team={team} />
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <TeamMembersTab teamId={team.id} />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <TeamStatsTab teamId={team.id} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <TeamSettingsTab team={team} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TeamDetailPage;