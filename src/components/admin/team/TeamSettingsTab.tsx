import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TeamDetail } from '@/hooks/useTeamDetail';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useUpdateTeam } from '@/hooks/useTeams';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { Settings, Save, Trash } from 'lucide-react';

interface TeamSettingsTabProps {
  team: TeamDetail;
}

export const TeamSettingsTab = ({ team }: TeamSettingsTabProps) => {
  const { t } = useTranslation('admin');
  const { data: organizations, isLoading: organizationsLoading } = useOrganizations();
  const { data: teamMembers, isLoading: membersLoading } = useTeamMembers(team.id);
  const updateTeamMutation = useUpdateTeam();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: team.name,
    description: team.description || '',
    is_active: team.is_active,
    team_leader_id: team.team_leader_id || '',
    organization_id: team.organization_id
  });

  const handleSave = async () => {
    try {
      await updateTeamMutation.mutateAsync({
        teamId: team.id,
        teamData: {
          name: formData.name,
          description: formData.description,
          is_active: formData.is_active,
          team_leader_id: formData.team_leader_id || null,
          organization_id: formData.organization_id
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: team.name,
      description: team.description || '',
      is_active: team.is_active,
      team_leader_id: team.team_leader_id || '',
      organization_id: team.organization_id
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Basic Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('teams.settings.basicSettings')}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  {t('common:buttons.cancel')}
                </Button>
                <Button onClick={handleSave} disabled={updateTeamMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateTeamMutation.isPending ? t('common:buttons.saving') : t('common:buttons.save')}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                {t('common:buttons.edit')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="team-name">{t('teams.settings.teamName')}</Label>
            <Input
              id="team-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="team-description">{t('teams.settings.description')}</Label>
            <Textarea
              id="team-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={!isEditing}
              placeholder={t('teams.settings.descriptionPlaceholder')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('teams.settings.activeStatus')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('teams.settings.activeStatusDescription')}
              </p>
            </div>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Organization */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teams.settings.organization')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="organization">{t('teams.settings.selectOrganization')}</Label>
            <Select 
              value={formData.organization_id} 
              onValueChange={(value) => setFormData({ ...formData, organization_id: value })}
              disabled={!isEditing || organizationsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('teams.settings.selectOrganizationPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {organizations?.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              {t('teams.settings.organizationDescription')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Team Leader */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teams.settings.teamLeader')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="team-leader">{t('teams.settings.selectTeamLeader')}</Label>
            <Select 
              value={formData.team_leader_id} 
              onValueChange={(value) => setFormData({ ...formData, team_leader_id: value })}
              disabled={!isEditing || membersLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('teams.settings.selectTeamLeaderPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t('teams.settings.selectTeamLeaderPlaceholder')}
                </SelectItem>
                {teamMembers?.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              {t('teams.settings.teamLeaderDescription')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">{t('teams.settings.dangerZone')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{t('teams.settings.deleteTeam')}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {t('teams.settings.deleteTeamDescription')}
              </p>
              <Button variant="destructive" size="sm">
                <Trash className="h-4 w-4 mr-2" />
                {t('teams.settings.deleteTeam')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};