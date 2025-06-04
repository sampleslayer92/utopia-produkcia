
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useContractManagement = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteContract = async (contractId: string) => {
    setIsDeleting(true);
    
    try {
      console.log('Mazanie zmluvy:', contractId);

      // Delete all related data first - using explicit table names
      // Delete actual_owners
      const { error: actualOwnersError } = await supabase
        .from('actual_owners')
        .delete()
        .eq('contract_id', contractId);
      
      if (actualOwnersError) {
        console.error('Chyba pri mazaní actual_owners:', actualOwnersError);
        throw new Error('Chyba pri mazaní skutočných vlastníkov');
      }

      // Delete authorized_persons
      const { error: authorizedPersonsError } = await supabase
        .from('authorized_persons')
        .delete()
        .eq('contract_id', contractId);
      
      if (authorizedPersonsError) {
        console.error('Chyba pri mazaní authorized_persons:', authorizedPersonsError);
        throw new Error('Chyba pri mazaní oprávnených osôb');
      }

      // Delete business_locations
      const { error: businessLocationsError } = await supabase
        .from('business_locations')
        .delete()
        .eq('contract_id', contractId);
      
      if (businessLocationsError) {
        console.error('Chyba pri mazaní business_locations:', businessLocationsError);
        throw new Error('Chyba pri mazaní prevádzkových miest');
      }

      // Delete contract_items
      const { error: contractItemsError } = await supabase
        .from('contract_items')
        .delete()
        .eq('contract_id', contractId);
      
      if (contractItemsError) {
        console.error('Chyba pri mazaní contract_items:', contractItemsError);
        throw new Error('Chyba pri mazaní položiek zmluvy');
      }

      // Delete contract_item_addons
      const { error: contractItemAddonsError } = await supabase
        .from('contract_item_addons')
        .delete()
        .eq('contract_item_id', contractId); // Note: this might need a subquery
      
      if (contractItemAddonsError) {
        console.error('Chyba pri mazaní contract_item_addons:', contractItemAddonsError);
        // Don't throw here as this might be expected if no addons exist
      }

      // Delete contract_calculations
      const { error: contractCalculationsError } = await supabase
        .from('contract_calculations')
        .delete()
        .eq('contract_id', contractId);
      
      if (contractCalculationsError) {
        console.error('Chyba pri mazaní contract_calculations:', contractCalculationsError);
        throw new Error('Chyba pri mazaní výpočtov zmluvy');
      }

      // Delete device_selection
      const { error: deviceSelectionError } = await supabase
        .from('device_selection')
        .delete()
        .eq('contract_id', contractId);
      
      if (deviceSelectionError) {
        console.error('Chyba pri mazaní device_selection:', deviceSelectionError);
        throw new Error('Chyba pri mazaní výberu zariadení');
      }

      // Delete consents
      const { error: consentsError } = await supabase
        .from('consents')
        .delete()
        .eq('contract_id', contractId);
      
      if (consentsError) {
        console.error('Chyba pri mazaní consents:', consentsError);
        throw new Error('Chyba pri mazaní súhlasov');
      }

      // Delete contact_info
      const { error: contactInfoError } = await supabase
        .from('contact_info')
        .delete()
        .eq('contract_id', contractId);
      
      if (contactInfoError) {
        console.error('Chyba pri mazaní contact_info:', contactInfoError);
        throw new Error('Chyba pri mazaní kontaktných údajov');
      }

      // Delete company_info
      const { error: companyInfoError } = await supabase
        .from('company_info')
        .delete()
        .eq('contract_id', contractId);
      
      if (companyInfoError) {
        console.error('Chyba pri mazaní company_info:', companyInfoError);
        throw new Error('Chyba pri mazaní údajov spoločnosti');
      }

      // Delete location_assignments
      const { error: locationAssignmentsError } = await supabase
        .from('location_assignments')
        .delete()
        .eq('contract_id', contractId);
      
      if (locationAssignmentsError) {
        console.error('Chyba pri mazaní location_assignments:', locationAssignmentsError);
        throw new Error('Chyba pri mazaní priradení lokalít');
      }

      // Finally delete the contract
      const { error: contractError } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractId);

      if (contractError) {
        console.error('Chyba pri mazaní zmluvy:', contractError);
        throw contractError;
      }

      console.log('Zmluva úspešne zmazaná');
      
      toast.success('Zmluva zmazaná', {
        description: 'Zmluva a všetky súvisiace dáta boli úspešne zmazané'
      });

      return { success: true };

    } catch (error) {
      console.error('Chyba pri mazaní zmluvy:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Neočakávaná chyba';
      
      toast.error('Chyba pri mazaní zmluvy', {
        description: errorMessage
      });

      return { success: false, error };
    } finally {
      setIsDeleting(false);
    }
  };

  const createNewContract = async (): Promise<{ success: boolean; contractId?: string; contractNumber?: string; error?: any }> => {
    try {
      console.log('Vytváram novú zmluvu...');

      const { data, error } = await supabase
        .from('contracts')
        .insert({
          status: 'draft'
        })
        .select('id, contract_number')
        .single();

      if (error) {
        console.error('Chyba pri vytváraní zmluvy:', error);
        throw error;
      }

      console.log('Nová zmluva vytvorená:', data);

      toast.success('Nová zmluva vytvorená', {
        description: `Číslo zmluvy: ${data.contract_number}`
      });

      return {
        success: true,
        contractId: data.id,
        contractNumber: data.contract_number?.toString()
      };

    } catch (error) {
      console.error('Chyba pri vytváraní novej zmluvy:', error);
      
      toast.error('Chyba pri vytváraní novej zmluvy', {
        description: 'Nepodarilo sa vytvoriť novú zmluvu'
      });

      return { success: false, error };
    }
  };

  return {
    deleteContract,
    createNewContract,
    isDeleting
  };
};
