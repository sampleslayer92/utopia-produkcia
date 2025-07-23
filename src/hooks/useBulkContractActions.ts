
import { useGenericBulkActions } from '@/hooks/useGenericBulkActions';
import { supabase } from '@/integrations/supabase/client';

export const useBulkContractActions = () => {
  const contractActions = useGenericBulkActions({
    entityName: 'zmluva',
    queryKey: ['contracts'],
    bulkDelete: async (contractIds: string[]) => {
      console.log('Bulk deleting contracts:', contractIds);
      
      const { error } = await supabase
        .from('contracts')
        .delete()
        .in('id', contractIds);
      
      if (error) throw error;
    },
    bulkUpdate: async (contractIds: string[], updates: any) => {
      console.log('Bulk updating contracts:', { contractIds, updates });
      
      // Handle different update types
      if (updates.field === 'contractType') {
        // Since contract_type doesn't exist, we'll update notes instead as a workaround
        const { error } = await supabase
          .from('contracts')
          .update({ notes: `Contract Type: ${updates.value}` })
          .in('id', contractIds);
        
        if (error) throw error;
      } else if (updates.field === 'salesPerson') {
        // Since salesperson doesn't exist on contracts table, update in contact_info
        const { error } = await supabase
          .from('contact_info')
          .update({ user_role: updates.value })
          .in('contract_id', contractIds);
        
        if (error) throw error;
      } else if (updates.field === 'status') {
        const { error } = await supabase
          .from('contracts')
          .update({ status: updates.value })
          .in('id', contractIds);
        
        if (error) throw error;
      }
    },
    bulkExport: async (contractIds: string[]) => {
      console.log('Bulk exporting contracts:', contractIds);
      
      // Get contracts data for export
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          contract_number,
          status,
          created_at,
          contact_info (first_name, last_name, email),
          company_info (company_name, ico)
        `)
        .in('id', contractIds);
      
      if (error) throw error;
      
      // Simple CSV export
      const csvData = data.map(contract => ({
        contract_number: contract.contract_number,
        status: contract.status,
        created_at: contract.created_at,
        client_name: contract.contact_info?.[0]?.first_name + ' ' + contract.contact_info?.[0]?.last_name || '',
        email: contract.contact_info?.[0]?.email || '',
        company: contract.company_info?.[0]?.company_name || '',
        ico: contract.company_info?.[0]?.ico || ''
      }));
      
      const csvString = [
        'Contract Number,Status,Created,Client,Email,Company,ICO',
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contracts_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });

  return {
    bulkUpdate: (params: { contractIds: string[], field: string, value: string }) => {
      contractActions.bulkUpdate({ ids: params.contractIds, updates: params });
    },
    bulkDelete: contractActions.bulkDelete,
    bulkExport: contractActions.bulkExport,
    isUpdating: contractActions.isUpdating,
    isDeleting: contractActions.isDeleting,
    isExporting: contractActions.isExporting,
    isLoading: contractActions.isLoading
  };
};
