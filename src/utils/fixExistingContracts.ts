
import { supabase } from '@/integrations/supabase/client';

export const fixExistingContractsWithoutMerchants = async () => {
  try {
    console.log('Finding contracts without merchants...');
    
    // Get all contracts without merchant_id that have company info
    const { data: contracts, error: contractsError } = await supabase
      .from('contracts')
      .select(`
        id,
        contract_number,
        merchant_id,
        contact_info (
          first_name,
          last_name,
          email,
          phone
        ),
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
        )
      `)
      .is('merchant_id', null);

    if (contractsError) {
      console.error('Error fetching contracts:', contractsError);
      return { success: false, error: contractsError };
    }

    console.log(`Found ${contracts.length} contracts without merchants`);

    const results = [];
    
    for (const contract of contracts) {
      if (!contract.company_info?.company_name || !contract.company_info?.ico) {
        console.log(`Skipping contract ${contract.contract_number} - missing company name or ICO`);
        continue;
      }

      console.log(`Processing contract ${contract.contract_number}...`);

      try {
        // Check if merchant already exists with same company name and ICO
        const { data: existingMerchant, error: searchError } = await supabase
          .from('merchants')
          .select('id')
          .eq('company_name', contract.company_info.company_name)
          .eq('ico', contract.company_info.ico)
          .maybeSingle();

        if (searchError) {
          console.error(`Error searching for existing merchant for ${contract.contract_number}:`, searchError);
          results.push({ contractId: contract.id, success: false, error: searchError });
          continue;
        }

        let merchantId;

        if (existingMerchant) {
          console.log(`Using existing merchant for ${contract.contract_number}:`, existingMerchant.id);
          merchantId = existingMerchant.id;
        } else {
          console.log(`Creating new merchant for ${contract.contract_number}`);
          
          // Create new merchant
          const { data: newMerchant, error: createError } = await supabase
            .from('merchants')
            .insert({
              company_name: contract.company_info.company_name,
              ico: contract.company_info.ico,
              dic: contract.company_info.dic || null,
              vat_number: contract.company_info.vat_number || null,
              contact_person_name: contract.contact_info ? 
                `${contract.contact_info.first_name || ''} ${contract.contact_info.last_name || ''}`.trim() : 
                `${contract.company_info.contact_person_first_name || ''} ${contract.company_info.contact_person_last_name || ''}`.trim(),
              contact_person_email: contract.contact_info?.email || contract.company_info.contact_person_email || '',
              contact_person_phone: contract.contact_info?.phone || contract.company_info.contact_person_phone || '',
              address_street: contract.company_info.address_street || null,
              address_city: contract.company_info.address_city || null,
              address_zip_code: contract.company_info.address_zip_code || null
            })
            .select('id')
            .single();

          if (createError) {
            console.error(`Error creating merchant for ${contract.contract_number}:`, createError);
            results.push({ contractId: contract.id, success: false, error: createError });
            continue;
          }

          merchantId = newMerchant.id;
        }

        // Link contract to merchant
        const { error: linkError } = await supabase
          .from('contracts')
          .update({ merchant_id: merchantId })
          .eq('id', contract.id);

        if (linkError) {
          console.error(`Error linking contract ${contract.contract_number} to merchant:`, linkError);
          results.push({ contractId: contract.id, success: false, error: linkError });
          continue;
        }

        console.log(`Successfully processed contract ${contract.contract_number}`);
        results.push({ 
          contractId: contract.id, 
          contractNumber: contract.contract_number,
          merchantId, 
          success: true, 
          created: !existingMerchant 
        });

      } catch (error) {
        console.error(`Error processing contract ${contract.contract_number}:`, error);
        results.push({ contractId: contract.id, success: false, error });
      }
    }

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`Batch processing complete: ${successful.length} successful, ${failed.length} failed`);

    return {
      success: true,
      processed: results.length,
      successful: successful.length,
      failed: failed.length,
      results
    };

  } catch (error) {
    console.error('Error in batch processing:', error);
    return { success: false, error };
  }
};
