
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OnboardingData } from '@/types/onboarding';

export const useContractManagement = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteContract = async (contractId: string) => {
    setIsDeleting(true);
    
    try {
      console.log('Mazanie zmluvy:', contractId);

      // Delete all related data first
      const tables = [
        'actual_owners',
        'authorized_persons', 
        'business_locations',
        'contract_items',
        'contract_item_addons',
        'contract_calculations',
        'device_selection',
        'consents',
        'contact_info',
        'company_info',
        'location_assignments'
      ];

      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('contract_id', contractId);
        
        if (error) {
          console.error(`Chyba pri mazaní z tabuľky ${table}:`, error);
          throw new Error(`Chyba pri mazaní dát z tabuľky ${table}`);
        }
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
