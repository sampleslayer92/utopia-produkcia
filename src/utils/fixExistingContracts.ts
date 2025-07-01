
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
  try {
    console.log('Starting to fix existing contracts without merchants...');
    
    // Get all contracts that have company info but no merchant
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

    const contractsToFix = (contracts as ContractData[]).filter(contract => 
      contract.company_info && 
      contract.company_info.company_name?.trim() && 
      contract.company_info.ico?.trim()
    );

    console.log(`Found ${contractsToFix.length} contracts that need merchants`);

    if (contractsToFix.length === 0) {
      toast.success('Všetky zmluvy už majú pridelených merchants');
      return { success: true, processed: 0 };
    }

    let processed = 0;
    let errors = 0;

    for (const contract of contractsToFix) {
      try {
        console.log(`Processing contract ${contract.id} - ${contract.company_info!.company_name}`);
        
        // Check if merchant already exists
        const { data: existingMerchant, error: searchError } = await supabase
          .from('merchants')
          .select('id')
          .eq('company_name', contract.company_info!.company_name)
          .eq('ico', contract.company_info!.ico)
          .maybeSingle();

        if (searchError) {
          console.error('Error searching for merchant:', searchError);
          errors++;
          continue;
        }

        let merchantId;

        if (existingMerchant) {
          console.log('Using existing merchant:', existingMerchant.id);
          merchantId = existingMerchant.id;
        } else {
          // Create new merchant
          const merchantData = {
            company_name: contract.company_info!.company_name,
            ico: contract.company_info!.ico,
            dic: contract.company_info!.dic || null,
            vat_number: contract.company_info!.vat_number || null,
            contact_person_name: contract.contact_info ? 
              `${contract.contact_info.first_name || ''} ${contract.contact_info.last_name || ''}`.trim() : 
              `${contract.company_info!.contact_person_first_name || ''} ${contract.company_info!.contact_person_last_name || ''}`.trim(),
            contact_person_email: contract.contact_info?.email || contract.company_info!.contact_person_email || '',
            contact_person_phone: contract.contact_info?.phone || contract.company_info!.contact_person_phone || '',
            address_street: contract.company_info!.address_street || null,
            address_city: contract.company_info!.address_city || null,
            address_zip_code: contract.company_info!.address_zip_code || null
          };

          const { data: newMerchant, error: createError } = await supabase
            .from('merchants')
            .insert(merchantData)
            .select('id')
            .single();

          if (createError) {
            console.error('Error creating merchant:', createError);
            errors++;
            continue;
          }

          merchantId = newMerchant.id;
          console.log('Created new merchant:', merchantId);
        }

        // Link contract to merchant
        const { error: linkError } = await supabase
          .from('contracts')
          .update({ merchant_id: merchantId })
          .eq('id', contract.id);

        if (linkError) {
          console.error('Error linking contract to merchant:', linkError);
          errors++;
          continue;
        }

        processed++;
        console.log(`Successfully processed contract ${contract.id}`);

      } catch (error) {
        console.error(`Error processing contract ${contract.id}:`, error);
        errors++;
      }
    }

    const message = `Spracované: ${processed} zmlúv, Chyby: ${errors}`;
    console.log(message);

    if (errors === 0) {
      toast.success('Všetky zmluvy úspešne opravené!', {
        description: message
      });
    } else {
      toast.warning('Oprava dokončená s chybami', {
        description: message
      });
    }

    return { 
      success: true, 
      processed, 
      errors,
      total: contractsToFix.length 
    };

  } catch (error) {
    console.error('Error in fixExistingContracts:', error);
    
    toast.error('Chyba pri opravovaní zmlúv', {
      description: 'Skúste to prosím znova'
    });

    return { success: false, error };
  }
};

// Export function to run the fix
export const runContractsFix = () => {
  console.log('Running contracts fix...');
  return fixExistingContracts();
};
