
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
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner(role)
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const formattedMembers = profiles.map(profile => ({
        ...profile,
        role: profile.user_roles[0]?.role || 'merchant'
      }));

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
  }) => {
    setIsSaving(true);
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: memberData.email,
        password: memberData.password,
        user_metadata: {
          first_name: memberData.first_name,
          last_name: memberData.last_name,
        },
        email_confirm: true
      });

      if (authError) throw authError;

      // The profile will be created automatically by the trigger
      // But we need to assign the role manually
      if (authData.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: memberData.role
          });

        if (roleError) throw roleError;
      }

      await fetchTeamMembers();
      toast.success('Člen tímu bol úspešne vytvorený');
      
      return { data: authData, error: null };
    } catch (error: any) {
      console.error('Error creating team member:', error);
      toast.error('Chyba pri vytváraní člena tímu', {
        description: error.message
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
          .update({ role: updates.role })
          .eq('user_id', id);

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

  const deactivateTeamMember = async (id: string) => {
    return updateTeamMember(id, { is_active: false });
  };

  const activateTeamMember = async (id: string) => {
    return updateTeamMember(id, { is_active: true });
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
    deactivateTeamMember,
    activateTeamMember,
    refetch: fetchTeamMembers
  };
};
