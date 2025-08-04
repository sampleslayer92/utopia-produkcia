
import { supabase } from '@/integrations/supabase/client';
import { useGenericBulkActions } from './useGenericBulkActions';

export const useBulkMerchantActions = () => {
  const bulkDelete = async (merchantIds: string[], forceCascade: boolean = false) => {
    console.log('Bulk deleting merchants:', merchantIds, 'forceCascade:', forceCascade);
    
    // Get detailed info about what will be deleted
    const { data: contractsCheck } = await supabase
      .from('contracts')
      .select('id, contract_number, merchant_id')
      .in('merchant_id', merchantIds);
    
    if (contractsCheck && contractsCheck.length > 0 && !forceCascade) {
      const contractNumbers = contractsCheck.map(c => c.contract_number).join(', ');
      throw new Error(`Obchodníci majú ${contractsCheck.length} zmlúv (${contractNumbers}). Potvrďte mazanie s cascade delete.`);
    }
    
    // If force cascade, delete contracts first
    if (forceCascade && contractsCheck && contractsCheck.length > 0) {
      const contractIds = contractsCheck.map(c => c.id);
      const { error: contractError } = await supabase
        .from('contracts')
        .delete()
        .in('id', contractIds);
      
      if (contractError) throw new Error(`Chyba pri mazaní zmlúv: ${contractError.message}`);
    }
    
    // Delete merchants
    const { error } = await supabase
      .from('merchants')
      .delete()
      .in('id', merchantIds);
    
    if (error) throw error;
  };

  const bulkExport = async (merchantIds: string[]) => {
    console.log('Bulk exporting merchants:', merchantIds);
    
    const { data: merchants, error } = await supabase
      .from('merchants')
      .select('*')
      .in('id', merchantIds);
    
    if (error) throw error;
    
    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Firma,IČO,DIČ,DPH,Kontakt,Email,Telefón,Adresa,Mesto,PSČ\n"
      + merchants.map(merchant => 
          `"${merchant.company_name}","${merchant.ico || ''}","${merchant.dic || ''}","${merchant.vat_number || ''}","${merchant.contact_person_name}","${merchant.contact_person_email}","${merchant.contact_person_phone || ''}","${merchant.address_street || ''}","${merchant.address_city || ''}","${merchant.address_zip_code || ''}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `merchants_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    ...useGenericBulkActions({
      entityName: 'obchodníka',
      queryKey: ['enhanced-merchants'],
      bulkDelete,
      bulkExport
    }),
    bulkDeleteWithCascade: bulkDelete
  };
};
