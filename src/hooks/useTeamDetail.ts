import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TeamDetail {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  organization_id: string;
  team_leader_id?: string;
  created_at: string;
  updated_at: string;
  organization?: {
    id: string;
    name: string;
    color?: string;
  };
  team_leader?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  member_count?: number;
}

export const useTeamDetail = (teamId: string) => {
  return useQuery({
    queryKey: ['team-detail', teamId],
    queryFn: async (): Promise<TeamDetail> => {
      const { data: team, error } = await supabase
        .from('teams')
        .select(`
          *,
          organization:organizations(id, name, color),
          team_leader:profiles(id, first_name, last_name, email)
        `)
        .eq('id', teamId)
        .single();

      if (error) throw error;

      // Get member count
      const { count: memberCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId)
        .eq('is_active', true);

      return {
        ...team,
        team_leader: team.team_leader?.[0] || null,
        member_count: memberCount || 0
      };
    },
    enabled: !!teamId,
  });
};