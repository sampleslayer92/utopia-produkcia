import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTeamsStats = () => {
  return useQuery({
    queryKey: ['teams-stats'],
    queryFn: async () => {
      // Get all teams
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id, is_active, team_leader_id')
        .eq('is_active', true);

      if (teamsError) throw teamsError;

      // Get team members
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, team_id')
        .not('team_id', 'is', null);

      if (profilesError) throw profilesError;

      const totalTeams = teams?.length || 0;
      const activeTeams = teams?.filter(team => team.is_active).length || 0;
      const teamsWithLeaders = teams?.filter(team => team.team_leader_id).length || 0;
      const totalMembers = profiles?.length || 0;

      return {
        totalTeams,
        activeTeams,
        teamsWithLeaders,
        totalMembers
      };
    },
  });
};