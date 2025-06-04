
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { toast } from 'sonner';

export const useContractEdit = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveContract = async (contractId: string, data: OnboardingData) => {
    setIsSaving(true);
    
    try {
      console.log('Ukladám zmeny zmluvy:', contractId, data);

      // Update contact info
      if (data.contactInfo) {
        const { error: contactError } = await supabase
          .from('contact_info')
          .upsert({
            contract_id: contractId,
            first_name: data.contactInfo.firstName,
            last_name: data.contactInfo.lastName,
            email: data.contactInfo.email,
            phone: data.contactInfo.phone,
            phone_prefix: data.contactInfo.phonePrefix,
            salutation: data.contactInfo.salutation || null,
            user_role: data.contactInfo.userRole,
            sales_note: data.contactInfo.salesNote
          }, {
            onConflict: 'contract_id'
          });

        if (contactError) {
          console.error('Chyba pri ukladaní kontaktných údajov:', contactError);
          throw new Error('Chyba pri ukladaní kontaktných údajov');
        }
      }

      // Update company info
      if (data.companyInfo) {
        const { error: companyError } = await supabase
          .from('company_info')
          .upsert({
            contract_id: contractId,
            company_name: data.companyInfo.companyName,
            ico: data.companyInfo.ico,
            dic: data.companyInfo.dic,
            is_vat_payer: data.companyInfo.isVatPayer,
            vat_number: data.companyInfo.vatNumber,
            registry_type: data.companyInfo.registryType || 'other',
            court: data.companyInfo.court,
            section: data.companyInfo.section,
            insert_number: data.companyInfo.insertNumber,
            address_street: data.companyInfo.address.street,
            address_city: data.companyInfo.address.city,
            address_zip_code: data.companyInfo.address.zipCode,
            contact_address_street: data.companyInfo.contactAddress?.street,
            contact_address_city: data.companyInfo.contactAddress?.city,
            contact_address_zip_code: data.companyInfo.contactAddress?.zipCode,
            contact_address_same_as_main: data.companyInfo.contactAddressSameAsMain,
            contact_person_first_name: data.companyInfo.contactPerson.firstName,
            contact_person_last_name: data.companyInfo.contactPerson.lastName,
            contact_person_email: data.companyInfo.contactPerson.email,
            contact_person_phone: data.companyInfo.contactPerson.phone,
            contact_person_is_technical: data.companyInfo.contactPerson.isTechnicalPerson,
            contact_person_name: `${data.companyInfo.contactPerson.firstName} ${data.companyInfo.contactPerson.lastName}`
          }, {
            onConflict: 'contract_id'
          });

        if (companyError) {
          console.error('Chyba pri ukladaní údajov spoločnosti:', companyError);
          throw new Error('Chyba pri ukladaní údajov spoločnosti');
        }
      }

      // Update device selection
      if (data.deviceSelection) {
        // Extract device counts from dynamic cards
        const deviceCards = data.deviceSelection.dynamicCards.filter(card => card.type === 'device');
        const paxA920Pro = deviceCards.find(card => card.name === 'PAX A920 PRO');
        const paxA80 = deviceCards.find(card => card.name === 'PAX A80');
        const tablet10 = deviceCards.find(card => card.name === 'Tablet 10"');
        const tablet15 = deviceCards.find(card => card.name === 'Tablet 15"');
        const tabletPro15 = deviceCards.find(card => card.name === 'Tablet Pro 15"');

        const { error: deviceError } = await supabase
          .from('device_selection')
          .upsert({
            contract_id: contractId,
            pax_a920_pro_count: paxA920Pro?.count || 0,
            pax_a920_pro_monthly_fee: paxA920Pro?.monthlyFee || 0,
            pax_a920_pro_sim_cards: (paxA920Pro as any)?.simCards || 0,
            pax_a80_count: paxA80?.count || 0,
            pax_a80_monthly_fee: paxA80?.monthlyFee || 0,
            tablet_10_count: tablet10?.count || 0,
            tablet_10_monthly_fee: tablet10?.monthlyFee || 0,
            tablet_15_count: tablet15?.count || 0,
            tablet_15_monthly_fee: tablet15?.monthlyFee || 0,
            tablet_pro_15_count: tabletPro15?.count || 0,
            tablet_pro_15_monthly_fee: tabletPro15?.monthlyFee || 0,
            software_licenses: data.deviceSelection.dynamicCards.filter(card => card.category === 'software').map(card => card.name),
            accessories: data.deviceSelection.dynamicCards.filter(card => card.category === 'accessories').map(card => card.name),
            ecommerce: data.deviceSelection.dynamicCards.filter(card => card.category === 'ecommerce').map(card => card.name),
            technical_service: data.deviceSelection.dynamicCards.filter(card => card.category === 'technical').map(card => card.name),
            mif_regulated_cards: data.fees?.regulatedCards || 0,
            mif_unregulated_cards: data.fees?.unregulatedCards || 0,
            note: data.deviceSelection.note
          }, {
            onConflict: 'contract_id'
          });

        if (deviceError) {
          console.error('Chyba pri ukladaní výberu zariadení:', deviceError);
          throw new Error('Chyba pri ukladaní výberu zariadení');
        }
      }

      console.log('Zmeny zmluvy úspešne uložené');
      
      toast.success('Zmeny uložené', {
        description: 'Zmluva bola úspešne aktualizovaná'
      });

      return { success: true };

    } catch (error) {
      console.error('Chyba pri ukladaní zmluvy:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Neočakávaná chyba';
      
      toast.error('Chyba pri ukladaní', {
        description: errorMessage
      });

      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  };

  const updateDeviceCount = async (contractId: string, deviceName: string, newCount: number) => {
    try {
      // Get current device selection
      const { data: currentSelection, error: fetchError } = await supabase
        .from('device_selection')
        .select('*')
        .eq('contract_id', contractId)
        .single();

      if (fetchError) {
        throw new Error('Chyba pri načítaní aktuálneho výberu zariadení');
      }

      // Update the specific device count
      let updateData: any = {};
      
      switch (deviceName) {
        case 'PAX A920 PRO':
          updateData.pax_a920_pro_count = newCount;
          break;
        case 'PAX A80':
          updateData.pax_a80_count = newCount;
          break;
        case 'Tablet 10"':
          updateData.tablet_10_count = newCount;
          break;
        case 'Tablet 15"':
          updateData.tablet_15_count = newCount;
          break;
        case 'Tablet Pro 15"':
          updateData.tablet_pro_15_count = newCount;
          break;
        default:
          throw new Error('Neznámy typ zariadenia');
      }

      const { error: updateError } = await supabase
        .from('device_selection')
        .update(updateData)
        .eq('contract_id', contractId);

      if (updateError) {
        throw new Error('Chyba pri aktualizácii počtu zariadení');
      }

      return { success: true };

    } catch (error) {
      console.error('Chyba pri aktualizácii zariadenia:', error);
      toast.error('Chyba pri aktualizácii zariadenia');
      return { success: false, error };
    }
  };

  const removeDevice = async (contractId: string, deviceName: string) => {
    return await updateDeviceCount(contractId, deviceName, 0);
  };

  return {
    saveContract,
    updateDeviceCount,
    removeDevice,
    isSaving
  };
};
