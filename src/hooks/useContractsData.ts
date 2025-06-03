
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ContractWithInfo {
  id: string;
  contract_number: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  contact_info: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  company_info: {
    company_name: string;
    ico: string;
  } | null;
}

export const useContractsData = () => {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      console.log('Fetching contracts data...');
      
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          id,
          contract_number,
          status,
          created_at,
          submitted_at,
          contact_info (
            first_name,
            last_name,
            email
          ),
          company_info (
            company_name,
            ico
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contracts:', error);
        throw error;
      }

      console.log('Contracts data fetched:', data);
      return data as ContractWithInfo[];
    },
  });
};

export const useContractsStats = () => {
  return useQuery({
    queryKey: ['contracts-stats'],
    queryFn: async () => {
      console.log('Fetching contracts stats...');
      
      const { data: contracts, error } = await supabase
        .from('contracts')
        .select('status, created_at');

      if (error) {
        console.error('Error fetching contracts stats:', error);
        throw error;
      }

      const total = contracts.length;
      const submitted = contracts.filter(c => c.status === 'submitted').length;
      const draft = contracts.filter(c => c.status === 'draft').length;
      const approved = contracts.filter(c => c.status === 'approved').length;
      
      // Count contracts from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentContracts = contracts.filter(c => 
        new Date(c.created_at) > thirtyDaysAgo
      ).length;

      console.log('Contracts stats calculated:', {
        total,
        submitted,
        draft,
        approved,
        recentContracts
      });

      return {
        total,
        submitted,
        draft,
        approved,
        recentContracts
      };
    },
  });
};
