import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOrganizationsStats = () => {
  return useQuery({
    queryKey: ['organizations-stats'],
    queryFn: async () => {
      // Get total organizations
      const { data: organizations, error: orgsError } = await supabase
        .from('organizations')
        .select('id, is_active')
        .eq('is_active', true);

      if (orgsError) throw orgsError;

      // Get total teams
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id, is_active')
        .eq('is_active', true);

      if (teamsError) throw teamsError;

      // Get total members
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, organization_id')
        .not('organization_id', 'is', null);

      if (profilesError) throw profilesError;

      const totalOrganizations = organizations?.length || 0;
      const activeOrganizations = organizations?.filter(org => org.is_active).length || 0;
      const totalTeams = teams?.length || 0;
      const totalMembers = profiles?.length || 0;

      return {
        totalOrganizations,
        activeOrganizations,
        totalTeams,
        totalMembers
      };
    },
  });
};