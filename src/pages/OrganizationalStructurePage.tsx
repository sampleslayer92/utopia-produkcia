import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCardsSection from '@/components/admin/shared/StatsCardsSection';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useTeams } from '@/hooks/useTeams';
import { useOrganizationsStats } from '@/hooks/useOrganizationsStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Network, Building, Users, GitBranch } from 'lucide-react';

const OrganizationalStructurePage = () => {
  const { t } = useTranslation('admin');
  const { data: organizations } = useOrganizations();
  const { data: teams } = useTeams();
  const { data: stats, isLoading: statsLoading } = useOrganizationsStats();

  const statsCards = [
    {
      title: t('organizations.stats.totalOrganizations'),
      value: stats?.totalOrganizations || 0,
      subtitle: t('organizations.stats.hierarchyLevels'),
      icon: Building,
      iconColor: "bg-blue-500"
    },
    {
      title: t('teams.stats.totalTeams'),
      value: stats?.totalTeams || 0,
      subtitle: t('teams.stats.acrossAllOrgs'),
      icon: Users,
      iconColor: "bg-emerald-500"
    },
    {
      title: t('organizationalStructure.totalMembers'),
      value: stats?.totalMembers || 0,
      subtitle: t('organizationalStructure.activeUsers'),
      icon: Network,
      iconColor: "bg-purple-500"
    }
  ];

  const structureActions = (
    <>
      <Button variant="outline" className="hover:bg-slate-50">
        <FileText className="h-4 w-4 mr-2" />
        {t('organizationalStructure.exportStructure')}
      </Button>
      <Button variant="outline" className="hover:bg-slate-50">
        <Download className="h-4 w-4 mr-2" />
        {t('organizationalStructure.downloadChart')}
      </Button>
    </>
  );

  return (
    <AdminLayout 
      title={t('organizationalStructure.title')} 
      subtitle={t('organizationalStructure.subtitle')}
      actions={structureActions}
    >
      <div className="space-y-6">
        <StatsCardsSection stats={statsCards} isLoading={statsLoading} />

        {/* Organizational Structure Visualization */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              {t('organizationalStructure.visualization')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Organization List with Teams */}
              {organizations?.map((org) => (
                <div key={org.id} className="border rounded-lg p-4 bg-slate-50/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: org.color }}
                    />
                    <h3 className="text-lg font-semibold text-slate-900">{org.name}</h3>
                    <span className="text-sm text-slate-600">
                      ({teams?.filter(team => team.organization_id === org.id).length || 0} {t('teams.teams')})
                    </span>
                  </div>
                  
                  {org.description && (
                    <p className="text-sm text-slate-600 mb-4">{org.description}</p>
                  )}

                  {/* Teams in this organization */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {teams?.filter(team => team.organization_id === org.id).map((team) => (
                      <div key={team.id} className="bg-white p-3 rounded border">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-sm">{team.name}</span>
                        </div>
                        {team.description && (
                          <p className="text-xs text-slate-600 mt-1">{team.description}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {teams?.filter(team => team.organization_id === org.id).length === 0 && (
                    <div className="text-center py-6 text-slate-500">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{t('teams.noTeamsInOrganization')}</p>
                    </div>
                  )}
                </div>
              ))}

              {organizations?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Network className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>{t('organizationalStructure.noData')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default OrganizationalStructurePage;