import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createMerchantIfNeeded } from '@/hooks/contract/merchantCreationUtils';

export const useContractMerchantFix = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [fixResults, setFixResults] = useState<{
    total: number;
    fixed: number;
    skipped: number;
    errors: number;
  } | null>(null);

  const fixAllContractsWithoutMerchants = async () => {
    setIsFixing(true);
    setFixResults(null);

    try {
      console.log('Starting comprehensive merchant fix for all contracts...');

      // Get all contracts without merchants that have company info
      const { data: contractsToFix, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          id,
          contract_number,
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

      if (contractsError) {
        console.error('Error fetching contracts:', contractsError);
        throw contractsError;
      }

      if (!contractsToFix || contractsToFix.length === 0) {
        toast.info('Žiadne zmluvy na opravu');
        setFixResults({ total: 0, fixed: 0, skipped: 0, errors: 0 });
        return;
      }

      console.log(`Found ${contractsToFix.length} contracts without merchants`);

      const results = {
        total: contractsToFix.length,
        fixed: 0,
        skipped: 0,
        errors: 0
      };

      // Process each contract
      for (const contract of contractsToFix) {
        try {
          // Handle the case where company_info might be an array
          const companyInfoData = Array.isArray(contract.company_info) ? 
            contract.company_info[0] : contract.company_info;
          
          const contactInfoData = Array.isArray(contract.contact_info) ? 
            contract.contact_info[0] : contract.contact_info;

          if (!companyInfoData) {
            console.log(`Skipping contract ${contract.contract_number} - no company info`);
            results.skipped++;
            continue;
          }

          const companyInfo = {
            companyName: companyInfoData.company_name,
            ico: companyInfoData.ico,
            dic: companyInfoData.dic,
            registryType: '' as const,
            isVatPayer: false,
            vatNumber: companyInfoData.vat_number,
            court: '',
            section: '',
            insertNumber: '',
            address: {
              street: companyInfoData.address_street,
              city: companyInfoData.address_city,
              zipCode: companyInfoData.address_zip_code
            },
            contactAddress: {
              street: '',
              city: '',
              zipCode: ''
            },
            contactAddressSameAsMain: true,
            headOfficeEqualsOperatingAddress: false,
            contactPerson: {
              firstName: companyInfoData.contact_person_first_name,
              lastName: companyInfoData.contact_person_last_name,
              email: companyInfoData.contact_person_email,
              phone: companyInfoData.contact_person_phone,
              isTechnicalPerson: false
            }
          };

          const contactInfo = contactInfoData ? {
            firstName: contactInfoData.first_name,
            lastName: contactInfoData.last_name,
            email: contactInfoData.email,
            phone: contactInfoData.phone,
            phonePrefix: '+421',
            salesNote: '',
            userRoles: [],
            userRole: ''
          } : undefined;

          console.log(`Processing contract ${contract.contract_number}...`);
          
          const result = await createMerchantIfNeeded(contract.id, companyInfo, contactInfo);
          
          if (result.success) {
            console.log(`✅ Fixed contract ${contract.contract_number}`);
            results.fixed++;
          } else {
            console.log(`⚠️ Skipped contract ${contract.contract_number}: ${result.reason}`);
            results.skipped++;
          }

        } catch (error) {
          console.error(`❌ Error processing contract ${contract.contract_number}:`, error);
          results.errors++;
        }
      }

      setFixResults(results);

      if (results.fixed > 0) {
        toast.success(`Opravených ${results.fixed} zmlúv`, {
          description: `Celkom: ${results.total}, Preskočených: ${results.skipped}, Chýb: ${results.errors}`
        });
      } else {
        toast.info('Žiadne zmluvy neboli opravené', {
          description: `Preskočených: ${results.skipped}, Chýb: ${results.errors}`
        });
      }

    } catch (error) {
      console.error('Fix process failed:', error);
      toast.error('Chyba pri oprave zmlúv', {
        description: error instanceof Error ? error.message : 'Neznáma chyba'
      });
    } finally {
      setIsFixing(false);
    }
  };

  return {
    fixAllContractsWithoutMerchants,
    isFixing,
    fixResults
  };
};