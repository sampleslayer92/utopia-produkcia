
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDirectMerchantCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const creationMutex = useRef<Set<string>>(new Set());

  const createMerchantIfNeeded = async (contractId: string, companyInfo: any, contactInfo?: any) => {
    // Prevent duplicate creation for the same contract
    if (creationMutex.current.has(contractId)) {
      console.log('Merchant creation already in progress for contract:', contractId);
      return { success: false, reason: 'creation_in_progress' };
    }

    // Only proceed if we have company name and ICO
    if (!companyInfo?.companyName?.trim() || !companyInfo?.ico?.trim()) {
      console.log('Merchant creation skipped - missing company name or ICO');
      return { success: false, reason: 'missing_data' };
    }

    // Add to mutex
    creationMutex.current.add(contractId);
    setIsCreating(true);
    
    try {
      console.log('Checking if contract already has merchant...', contractId);
      
      // Check if contract already has a merchant
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .select('merchant_id')
        .eq('id', contractId)
        .single();

      if (contractError) {
        console.error('Error checking contract:', contractError);
        throw contractError;
      }

      if (contract.merchant_id) {
        console.log('Contract already has merchant:', contract.merchant_id);
        return { success: true, merchantId: contract.merchant_id, existed: true };
      }

      // Check if merchant already exists with same company name and ICO
      const { data: existingMerchant, error: searchError } = await supabase
        .from('merchants')
        .select('id')
        .eq('company_name', companyInfo.companyName)
        .eq('ico', companyInfo.ico)
        .maybeSingle();

      if (searchError) {
        console.error('Error searching for existing merchant:', searchError);
        throw searchError;
      }

      let merchantId;

      if (existingMerchant) {
        console.log('Using existing merchant:', existingMerchant.id);
        merchantId = existingMerchant.id;
      } else {
        console.log('Creating new merchant for:', companyInfo.companyName);
        
        // Create new merchant
        const { data: newMerchant, error: createError } = await supabase
          .from('merchants')
          .insert({
            company_name: companyInfo.companyName,
            ico: companyInfo.ico,
            dic: companyInfo.dic || null,
            vat_number: companyInfo.vatNumber || null,
            contact_person_name: contactInfo ? 
              `${contactInfo.firstName || ''} ${contactInfo.lastName || ''}`.trim() : 
              `${companyInfo.contactPerson?.firstName || ''} ${companyInfo.contactPerson?.lastName || ''}`.trim(),
            contact_person_email: contactInfo?.email || companyInfo.contactPerson?.email || '',
            contact_person_phone: contactInfo?.phone || companyInfo.contactPerson?.phone || '',
            address_street: companyInfo.address?.street || null,
            address_city: companyInfo.address?.city || null,
            address_zip_code: companyInfo.address?.zipCode || null
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating merchant:', createError);
          throw createError;
        }

        merchantId = newMerchant.id;
        console.log('New merchant created:', merchantId);
      }

      // Link contract to merchant
      const { error: linkError } = await supabase
        .from('contracts')
        .update({ merchant_id: merchantId })
        .eq('id', contractId);

      if (linkError) {
        console.error('Error linking contract to merchant:', linkError);
        throw linkError;
      }

      console.log('Contract linked to merchant successfully');
      
      toast.success('Merchant vytvorený!', {
        description: `Spoločnosť ${companyInfo.companyName} bola pridaná`
      });

      return { success: true, merchantId, existed: !!existingMerchant };

    } catch (error) {
      console.error('Merchant creation error:', error);
      
      toast.error('Chyba pri vytváraní merchanta', {
        description: 'Skúste to prosím znova'
      });

      return { success: false, error };
    } finally {
      // Remove from mutex
      creationMutex.current.delete(contractId);
      setIsCreating(false);
    }
  };

  const createMerchantForExistingContract = async (contractId: string) => {
    try {
      console.log('Creating merchant for existing contract:', contractId);
      
      // Get contract data
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          id,
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
        .eq('id', contractId)
        .single();

      if (error) {
        console.error('Error fetching contract data:', error);
        throw error;
      }

      // Handle the case where contact_info or company_info might be arrays
      const contactInfoData = Array.isArray(data.contact_info) ? data.contact_info[0] : data.contact_info;
      const companyInfoData = Array.isArray(data.company_info) ? data.company_info[0] : data.company_info;

      if (!companyInfoData) {
        throw new Error('Company info not found for contract');
      }

      const companyInfo = {
        companyName: companyInfoData.company_name,
        ico: companyInfoData.ico,
        dic: companyInfoData.dic,
        vatNumber: companyInfoData.vat_number,
        address: {
          street: companyInfoData.address_street,
          city: companyInfoData.address_city,
          zipCode: companyInfoData.address_zip_code
        },
        contactPerson: {
          firstName: companyInfoData.contact_person_first_name,
          lastName: companyInfoData.contact_person_last_name,
          email: companyInfoData.contact_person_email,
          phone: companyInfoData.contact_person_phone
        }
      };

      const contactInfo = contactInfoData ? {
        firstName: contactInfoData.first_name,
        lastName: contactInfoData.last_name,
        email: contactInfoData.email,
        phone: contactInfoData.phone
      } : undefined;

      return await createMerchantIfNeeded(contractId, companyInfo, contactInfo);

    } catch (error) {
      console.error('Error creating merchant for existing contract:', error);
      return { success: false, error };
    }
  };

  return {
    createMerchantIfNeeded,
    createMerchantForExistingContract,
    isCreating
  };
};
