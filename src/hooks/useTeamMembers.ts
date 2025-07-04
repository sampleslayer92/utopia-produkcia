import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role?: 'admin' | 'partner' | 'merchant';
}

export const useTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: async (): Promise<TeamMember[]> => {
      // First get profiles for this team
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        return [];
      }

      // Get roles for each profile
      const membersWithRoles: TeamMember[] = [];
      
      for (const profile of profiles) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.id)
          .maybeSingle();

        if (roleError) {
          console.error('Error fetching role for user:', profile.id, roleError);
        }

        membersWithRoles.push({
          ...profile,
          role: roleData?.role || 'merchant'
        });
      }

      return membersWithRoles;
    },
    enabled: !!teamId,
  });
};