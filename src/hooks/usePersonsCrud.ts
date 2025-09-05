import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Person, PersonRole, PersonRoleType, PersonWithRoles } from '@/types/person';

export const usePersonsCrud = (contractId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all persons
  const personsQuery = useQuery({
    queryKey: ['persons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('persons')
        .select('*')
        .order('is_predefined', { ascending: false })
        .order('first_name');
      
      if (error) throw error;
      return data as Person[];
    }
  });

  // Fetch person roles for specific contract
  const personRolesQuery = useQuery({
    queryKey: ['person-roles', contractId],
    queryFn: async () => {
      if (!contractId) return [];
      
      const { data, error } = await supabase
        .from('person_roles')
        .select('*')
        .eq('contract_id', contractId);
      
      if (error) throw error;
      return data as PersonRole[];
    },
    enabled: !!contractId
  });

  // Get persons with their roles for the contract
  const personsWithRoles = useQuery({
    queryKey: ['persons-with-roles', contractId],
    queryFn: async () => {
      if (!contractId || !personsQuery.data || !personRolesQuery.data) return [];
      
      return personsQuery.data.map(person => ({
        ...person,
        roles: personRolesQuery.data
          ?.filter(role => role.person_id === person.id)
          .map(role => role.role_type) || []
      })) as PersonWithRoles[];
    },
    enabled: !!contractId && !!personsQuery.data && !!personRolesQuery.data
  });

  // Create person
  const createPerson = useMutation({
    mutationFn: async (personData: Omit<Person, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('persons')
        .insert([personData])
        .select()
        .single();

      if (error) throw error;
      return data as Person;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      toast({
        title: "Osoba pridaná",
        description: "Osoba bola úspešne pridaná.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať osobu.",
        variant: "destructive",
      });
    },
  });

  // Update person
  const updatePerson = useMutation({
    mutationFn: async ({ personId, updates }: { personId: string; updates: Partial<Person> }) => {
      const { data, error } = await supabase
        .from('persons')
        .update(updates)
        .eq('id', personId)
        .select()
        .single();

      if (error) throw error;
      return data as Person;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      toast({
        title: "Osoba aktualizovaná",
        description: "Osoba bola úspešne aktualizovaná.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba", 
        description: "Nepodarilo sa aktualizovať osobu.",
        variant: "destructive",
      });
    },
  });

  // Delete person
  const deletePerson = useMutation({
    mutationFn: async (personId: string) => {
      const { error } = await supabase
        .from('persons')
        .delete()
        .eq('id', personId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      toast({
        title: "Osoba vymazaná",
        description: "Osoba bola úspešne vymazaná.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vymazať osobu.",
        variant: "destructive",
      });
    },
  });

  // Update person roles for contract
  const updatePersonRoles = useMutation({
    mutationFn: async ({ personId, roles }: { personId: string; roles: PersonRoleType[] }) => {
      if (!contractId) throw new Error('Contract ID is required');

      // First delete existing roles for this person and contract
      await supabase
        .from('person_roles')
        .delete()
        .eq('contract_id', contractId)
        .eq('person_id', personId);

      // Then insert new roles
      if (roles.length > 0) {
        const roleInserts = roles.map(role => ({
          contract_id: contractId,
          person_id: personId,
          role_type: role
        }));

        const { error } = await supabase
          .from('person_roles')
          .insert(roleInserts);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person-roles', contractId] });
      queryClient.invalidateQueries({ queryKey: ['persons-with-roles', contractId] });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať role osoby.",
        variant: "destructive",
      });
    },
  });

  return {
    persons: personsQuery.data || [],
    personRoles: personRolesQuery.data || [],
    personsWithRoles: personsWithRoles.data || [],
    isLoading: personsQuery.isLoading || personRolesQuery.isLoading,
    createPerson,
    updatePerson,
    deletePerson,
    updatePersonRoles,
    isCreating: createPerson.isPending,
    isUpdating: updatePerson.isPending,
    isDeleting: deletePerson.isPending,
    isUpdatingRoles: updatePersonRoles.isPending,
  };
};