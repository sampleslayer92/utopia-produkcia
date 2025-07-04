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
import { Settings, Save, Trash } from 'lucide-react';

interface TeamSettingsTabProps {
  team: TeamDetail;
}

export const TeamSettingsTab = ({ team }: TeamSettingsTabProps) => {
  const { t } = useTranslation('admin');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: team.name,
    description: team.description || '',
    is_active: team.is_active,
    team_leader_id: team.team_leader_id || ''
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: team.name,
      description: team.description || '',
      is_active: team.is_active,
      team_leader_id: team.team_leader_id || ''
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
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {t('common:buttons.save')}
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
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('teams.settings.selectTeamLeaderPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {/* TODO: Load team members dynamically */}
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