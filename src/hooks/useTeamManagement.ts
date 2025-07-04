import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_by?: string;
  is_active: boolean;
  created_at: string;
  role: 'admin' | 'partner' | 'merchant';
}

export const useTeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Then get roles for each profile
      const formattedMembers: TeamMember[] = [];
      
      for (const profile of profiles) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.id)
          .maybeSingle();

        if (roleError) {
          console.error('Error fetching role for user:', profile.id, roleError);
        }

        formattedMembers.push({
          ...profile,
          role: roleData?.role || 'merchant'
        });
      }

      setTeamMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Chyba pri načítavaní členov tímu');
    } finally {
      setIsLoading(false);
    }
  };

  const createTeamMember = async (memberData: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    role: 'admin' | 'partner' | 'merchant';
    team_id?: string;
  }) => {
    setIsSaving(true);
    try {
      console.log('Creating team member with data:', memberData);
      
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session - please log in again');
      }

      console.log('Session found, calling Edge Function...');

      // Call Edge Function to create user
      const { data, error } = await supabase.functions.invoke('create-team-member', {
        body: memberData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('Edge Function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Network error calling Edge Function');
      }

      if (!data) {
        throw new Error('No response from Edge Function');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create team member');
      }

      console.log('Team member created successfully:', data);

      // Refresh team members list
      await fetchTeamMembers();
      
      toast.success('Člen tímu bol úspešne vytvorený', {
        description: `Prihlasovacie údaje: ${memberData.email}`
      });
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating team member:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      
      // Provide more specific error messages
      let userMessage = 'Chyba pri vytváraní člena tímu';
      if (errorMessage.includes('admin role required')) {
        userMessage = 'Nemáte oprávnenie na vytvorenie člena tímu';
      } else if (errorMessage.includes('No active session')) {
        userMessage = 'Platnosť prihlásenia vypršala, prihláste sa znovu';
      } else if (errorMessage.includes('already registered')) {
        userMessage = 'Používateľ s týmto emailom už existuje';
      }
      
      toast.error(userMessage, {
        description: errorMessage
      });
      return { data: null, error };
    } finally {
      setIsSaving(false);
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    setIsSaving(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: updates.first_name,
          last_name: updates.last_name,
          email: updates.email,
          phone: updates.phone,
          is_active: updates.is_active
        })
        .eq('id', id);

      if (profileError) throw profileError;

      // Update role if provided
      if (updates.role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({ 
            user_id: id, 
            role: updates.role 
          }, {
            onConflict: 'user_id'
          });

        if (roleError) throw roleError;
      }

      await fetchTeamMembers();
      toast.success('Člen tímu bol aktualizovaný');
      
      return { error: null };
    } catch (error: any) {
      console.error('Error updating team member:', error);
      toast.error('Chyba pri aktualizácii člena tímu');
      return { error };
    } finally {
      setIsSaving(false);
    }
  };

  const resetMemberPassword = async (id: string, newPassword: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.admin.updateUserById(id, {
        password: newPassword
      });

      if (error) throw error;

      toast.success('Heslo bolo úspešne zmenené');
      return { error: null };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error('Chyba pri zmene hesla');
      return { error };
    } finally {
      setIsSaving(false);
    }
  };

  const deactivateTeamMember = async (id: string) => {
    return updateTeamMember(id, { is_active: false });
  };

  const activateTeamMember = async (id: string) => {
    return updateTeamMember(id, { is_active: true });
  };

  const deleteTeamMember = async (id: string) => {
    // Soft delete - just deactivate the user
    return updateTeamMember(id, { is_active: false });
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return {
    teamMembers,
    isLoading,
    isSaving,
    createTeamMember,
    updateTeamMember,
    resetMemberPassword,
    deactivateTeamMember,
    activateTeamMember,
    deleteTeamMember,
    refetch: fetchTeamMembers
  };
};
