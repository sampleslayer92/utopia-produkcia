import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Building, Calendar, User } from 'lucide-react';
import { TeamDetail } from '@/hooks/useTeamDetail';
import { format } from 'date-fns';

interface TeamOverviewTabProps {
  team: TeamDetail;
}

export const TeamOverviewTab = ({ team }: TeamOverviewTabProps) => {
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('teams.overview.members')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.member_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t('teams.overview.activeMembersCount')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('teams.overview.organization')}
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {team.organization?.name || t('teams.overview.noOrganization')}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('teams.overview.parentOrganization')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('teams.overview.teamLeader')}
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {team.team_leader 
                ? `${team.team_leader.first_name} ${team.team_leader.last_name}`
                : t('teams.overview.noLeader')
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {team.team_leader?.email || t('teams.overview.assignLeader')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('teams.overview.status')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={team.is_active ? 'default' : 'secondary'}>
                {team.is_active ? t('common:status.active') : t('common:status.inactive')}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('teams.overview.since')} {format(new Date(team.created_at), 'dd.MM.yyyy')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teams.overview.teamInformation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">{t('teams.overview.description')}</h4>
            <p className="text-muted-foreground">
              {team.description || t('teams.overview.noDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">{t('teams.overview.createdAt')}</h4>
              <p className="text-muted-foreground">
                {format(new Date(team.created_at), 'dd.MM.yyyy HH:mm')}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">{t('teams.overview.lastUpdated')}</h4>
              <p className="text-muted-foreground">
                {format(new Date(team.updated_at), 'dd.MM.yyyy HH:mm')}
              </p>
            </div>
          </div>

          {team.organization && (
            <div>
              <h4 className="font-medium mb-2">{t('teams.overview.organizationDetails')}</h4>
              <div className="flex items-center gap-2">
                {team.organization.color && (
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: team.organization.color }}
                  />
                )}
                <span className="text-muted-foreground">{team.organization.name}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};