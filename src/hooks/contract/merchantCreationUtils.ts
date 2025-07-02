import { supabase } from '@/integrations/supabase/client';
import { CompanyInfo, ContactInfo } from '@/types/onboarding';

export const createMerchantIfNeeded = async (contractId: string, companyInfo: CompanyInfo, contactInfo?: ContactInfo) => {
  // Only proceed if we have company name and ICO
  if (!companyInfo?.companyName?.trim() || !companyInfo?.ico?.trim()) {
    console.log('Merchant creation skipped - missing company name or ICO');
    return { success: false, reason: 'missing_data' };
  }

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

    return { success: true, merchantId, existed: !!existingMerchant };

  } catch (error) {
    console.error('Merchant creation error:', error);
    return { success: false, error };
  }
};