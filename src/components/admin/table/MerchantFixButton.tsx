
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MerchantFixButton = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [fixResults, setFixResults] = useState<{
    fixed: number;
    skipped: number;
    errors: number;
  } | null>(null);

  const fixMerchants = async () => {
    setIsFixing(true);
    setFixResults(null);
    
    let fixed = 0;
    let skipped = 0;
    let errors = 0;
    
    try {
      console.log('Starting merchant fix process...');
      
      // Get all contracts without merchant_id that have both contact and company info
      const { data: contractsToFix, error: contractsError } = await supabase
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
            address_zip_code
          )
        `)
        .is('merchant_id', null);

      if (contractsError) {
        console.error('Error fetching contracts:', contractsError);
        throw contractsError;
      }

      console.log('Found contracts to potentially fix:', contractsToFix?.length || 0);

      for (const contract of contractsToFix || []) {
        try {
          // Check if we have the required data
          const contactInfo = Array.isArray(contract.contact_info) 
            ? contract.contact_info[0] 
            : contract.contact_info;
          const companyInfo = Array.isArray(contract.company_info) 
            ? contract.company_info[0] 
            : contract.company_info;

          if (!contactInfo || !companyInfo || 
              !contactInfo.first_name || !contactInfo.last_name || 
              !contactInfo.email || !companyInfo.company_name || !companyInfo.ico) {
            console.log(`Skipping contract ${contract.contract_number} - incomplete data`);
            skipped++;
            continue;
          }

          // Check if merchant already exists
          const { data: existingMerchant } = await supabase
            .from('merchants')
            .select('id')
            .eq('company_name', companyInfo.company_name)
            .eq('ico', companyInfo.ico)
            .maybeSingle();

          let merchantId;

          if (existingMerchant) {
            merchantId = existingMerchant.id;
            console.log(`Using existing merchant ${merchantId} for contract ${contract.contract_number}`);
          } else {
            // Create new merchant
            const { data: newMerchant, error: merchantError } = await supabase
              .from('merchants')
              .insert({
                company_name: companyInfo.company_name,
                ico: companyInfo.ico,
                dic: companyInfo.dic || null,
                vat_number: companyInfo.vat_number || null,
                contact_person_name: `${contactInfo.first_name} ${contactInfo.last_name}`,
                contact_person_email: contactInfo.email,
                contact_person_phone: contactInfo.phone || null,
                address_street: companyInfo.address_street || null,
                address_city: companyInfo.address_city || null,
                address_zip_code: companyInfo.address_zip_code || null
              })
              .select('id')
              .single();

            if (merchantError) {
              console.error(`Error creating merchant for contract ${contract.contract_number}:`, merchantError);
              errors++;
              continue;
            }

            merchantId = newMerchant.id;
            console.log(`Created new merchant ${merchantId} for contract ${contract.contract_number}`);
          }

          // Link contract to merchant
          const { error: linkError } = await supabase
            .from('contracts')
            .update({ merchant_id: merchantId })
            .eq('id', contract.id);

          if (linkError) {
            console.error(`Error linking contract ${contract.contract_number} to merchant:`, linkError);
            errors++;
            continue;
          }

          console.log(`Successfully linked contract ${contract.contract_number} to merchant ${merchantId}`);
          fixed++;

        } catch (error) {
          console.error(`Error processing contract ${contract.contract_number}:`, error);
          errors++;
        }
      }

      setFixResults({ fixed, skipped, errors });

      if (fixed > 0) {
        toast.success(`Merchant fix completed!`, {
          description: `Fixed: ${fixed}, Skipped: ${skipped}, Errors: ${errors}`
        });
      } else if (skipped > 0) {
        toast.info(`No merchants to fix`, {
          description: `All contracts either have merchants or incomplete data`
        });
      } else {
        toast.warning(`Merchant fix completed with issues`, {
          description: `Fixed: ${fixed}, Skipped: ${skipped}, Errors: ${errors}`
        });
      }

    } catch (error) {
      console.error('Merchant fix process failed:', error);
      toast.error('Merchant fix failed', {
        description: 'An unexpected error occurred'
      });
      errors++;
      setFixResults({ fixed, skipped, errors });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={fixMerchants}
        disabled={isFixing}
        variant="outline"
        size="sm"
        className="text-xs"
      >
        {isFixing ? (
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <CheckCircle className="h-3 w-3 mr-1" />
        )}
        {isFixing ? 'Fixing...' : 'Fix Merchants'}
      </Button>
      
      {fixResults && (
        <div className="flex items-center gap-1 text-xs text-slate-600">
          {fixResults.fixed > 0 && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-3 w-3" />
              {fixResults.fixed}
            </span>
          )}
          {fixResults.errors > 0 && (
            <span className="flex items-center gap-1 text-red-600">
              <AlertCircle className="h-3 w-3" />
              {fixResults.errors}
            </span>
          )}
          {fixResults.skipped > 0 && (
            <span className="text-slate-500">
              {fixResults.skipped} skipped
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MerchantFixButton;
