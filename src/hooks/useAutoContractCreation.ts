
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAutoContractCreation = (
  contractId: string | undefined,
  updateData: (data: any) => void
) => {
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const createDraftContract = async () => {
      // Only create contract if we don't have one already
      if (contractId || isCreating) {
        return;
      }

      setIsCreating(true);
      
      try {
        console.log('Creating draft contract automatically...');
        
        const { data: contract, error } = await supabase
          .from('contracts')
          .insert({
            status: 'draft',
            notes: 'Contract created automatically during onboarding'
          })
          .select('id, contract_number')
          .single();

        if (error) {
          console.error('Error creating draft contract:', error);
          toast.error('Chyba pri vytváraní zmluvy', {
            description: 'Nepodarilo sa vytvoriť zmluvu. Skúste obnoviť stránku.'
          });
          return;
        }

        console.log('Draft contract created:', contract);
        
        // Update onboarding data with new contract info
        updateData({
          contractId: contract.id,
          contractNumber: contract.contract_number
        });

        toast.success('Zmluva vytvorená', {
          description: `Číslo zmluvy: ${contract.contract_number}`
        });

      } catch (error) {
        console.error('Unexpected error creating contract:', error);
        toast.error('Neočakávaná chyba pri vytváraní zmluvy');
      } finally {
        setIsCreating(false);
      }
    };

    createDraftContract();
  }, [contractId, updateData, isCreating]);

  return { isCreating };
};
