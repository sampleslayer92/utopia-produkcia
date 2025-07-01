
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContractData {
  id: string;
  merchant_id: string | null;
  company_info: {
    company_name: string;
    ico: string;
    dic: string;
    vat_number: string;
    address_street: string;
    address_city: string;
    address_zip_code: string;
    contact_person_first_name: string;
    contact_person_last_name: string;
    contact_person_email: string;
    contact_person_phone: string;
  } | null;
  contact_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;
}

export const fixExistingContracts = async () => {
  console.log('Starting to fix existing contracts without merchants...');
  
  try {
    // Get all contracts that don't have merchant_id but have company_info
    const { data: contracts, error } = await supabase
      .from('contracts')
      .select(`
        id,
        merchant_id,
        company_info (
          company_name,
          ico,
          dic,
          vat_number,
          address_street,
          address_city,
          address_zip_code,
          contact_person_first_name,
          contact_person_last_name,
          contact_person_email,
          contact_person_phone
        ),
        contact_info (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .is('merchant_id', null);

    if (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }

    if (!contracts || contracts.length === 0) {
      console.log('No contracts found without merchants');
      toast.success('Všetky zmluvy už majú priradených merchantov');
      return { success: true, processed: 0 };
    }

    // Process each contract
    let processedCount = 0;
    let createdCount = 0;

    for (const contract of contracts) {
      // Handle the case where relations might be arrays or single objects
      const companyInfoData = Array.isArray(contract.company_info) ? contract.company_info[0] : contract.company_info;
      const contactInfoData = Array.isArray(contract.contact_info) ? contract.contact_info[0] : contract.contact_info;

      if (!companyInfoData?.company_name || !companyInfoData?.ico) {
        console.log(`Skipping contract ${contract.id} - missing company name or ICO`);
        continue;
      }

      try {
        // Check if merchant already exists
        const { data: existingMerchant, error: searchError } = await supabase
          .from('merchants')
          .select('id')
          .eq('company_name', companyInfoData.company_name)
          .eq('ico', companyInfoData.ico)
          .maybeSingle();

        if (searchError) {
          console.error(`Error searching merchant for contract ${contract.id}:`, searchError);
          continue;
        }

        let merchantId;

        if (existingMerchant) {
          merchantId = existingMerchant.id;
          console.log(`Using existing merchant ${merchantId} for contract ${contract.id}`);
        } else {
          // Create new merchant
          const { data: newMerchant, error: createError } = await supabase
            .from('merchants')
            .insert({
              company_name: companyInfoData.company_name,
              ico: companyInfoData.ico,
              dic: companyInfoData.dic,
              vat_number: companyInfoData.vat_number,
              contact_person_name: contactInfoData ? 
                `${contactInfoData.first_name || ''} ${contactInfoData.last_name || ''}`.trim() : 
                `${companyInfoData.contact_person_first_name || ''} ${companyInfoData.contact_person_last_name || ''}`.trim(),
              contact_person_email: contactInfoData?.email || companyInfoData.contact_person_email || '',
              contact_person_phone: contactInfoData?.phone || companyInfoData.contact_person_phone || '',
              address_street: companyInfoData.address_street,
              address_city: companyInfoData.address_city,
              address_zip_code: companyInfoData.address_zip_code
            })
            .select('id')
            .single();

          if (createError) {
            console.error(`Error creating merchant for contract ${contract.id}:`, createError);
            continue;
          }

          merchantId = newMerchant.id;
          createdCount++;
          console.log(`Created new merchant ${merchantId} for contract ${contract.id}`);
        }

        // Link contract to merchant
        const { error: linkError } = await supabase
          .from('contracts')
          .update({ merchant_id: merchantId })
          .eq('id', contract.id);

        if (linkError) {
          console.error(`Error linking contract ${contract.id} to merchant:`, linkError);
          continue;
        }

        processedCount++;
        console.log(`Successfully processed contract ${contract.id}`);

      } catch (contractError) {
        console.error(`Error processing contract ${contract.id}:`, contractError);
        continue;
      }
    }

    console.log(`Completed processing: ${processedCount} contracts processed, ${createdCount} merchants created`);
    
    toast.success(`Processing completed`, {
      description: `${processedCount} zmlúv spracovaných, ${createdCount} merchantov vytvorených`
    });

    return {
      success: true,
      processed: processedCount,
      created: createdCount,
      total: contracts.length
    };

  } catch (error) {
    console.error('Error in fixExistingContracts:', error);
    
    toast.error('Chyba pri spracovaní zmlúv', {
      description: 'Skúste to prosím znova'
    });

    return {
      success: false,
      error
    };
  }
};
