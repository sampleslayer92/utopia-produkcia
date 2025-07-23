
import { supabase } from '@/integrations/supabase/client';
import { useGenericBulkActions } from './useGenericBulkActions';

export const useBulkMerchantActions = () => {
  const bulkDelete = async (merchantIds: string[]) => {
    console.log('Bulk deleting merchants:', merchantIds);
    
    // Check if any merchant has contracts
    const { data: contractsCheck } = await supabase
      .from('contracts')
      .select('id, merchant_id')
      .in('merchant_id', merchantIds);
    
    if (contractsCheck && contractsCheck.length > 0) {
      throw new Error('Nemôžete vymazať obchodníkov, ktorí majú zmluvy. Najprv vymažte zmluvy.');
    }
    
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

  return useGenericBulkActions({
    entityName: 'obchodníka',
    queryKey: ['enhanced-merchants'],
    bulkDelete,
    bulkExport
  });
};
