import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Edit, MoreHorizontal } from 'lucide-react';
import { Team } from '@/hooks/useTeams';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

interface TeamCardProps {
  team: Team;
}

export const TeamCard = ({ team }: TeamCardProps) => {
  const { t } = useTranslation('admin');

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <CardTitle className="text-lg font-semibold truncate">
            {team.name}
          </CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              {t('common:buttons.edit')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent>
        {team.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {team.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>0 {t('teams.members')}</span>
            </div>
          </div>
          
          <Badge variant={team.is_active ? 'default' : 'secondary'}>
            {team.is_active ? t('common:status.active') : t('common:status.inactive')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};