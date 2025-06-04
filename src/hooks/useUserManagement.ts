
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { toast } from 'sonner';

export const useUserManagement = () => {
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const createMerchantAccount = async (onboardingData: OnboardingData) => {
    setIsCreatingUser(true);
    
    try {
      console.log('Vytváram merchant účet...', onboardingData);
      
      if (!onboardingData.contactInfo.email || !onboardingData.contractId) {
        throw new Error('Email a ID zmluvy sú povinné');
      }

      // Create user record in our users table first - we'll handle auth separately
      const { error: userError } = await supabase
        .from('users')
        .insert({
          email: onboardingData.contactInfo.email,
          full_name: `${onboardingData.contactInfo.firstName} ${onboardingData.contactInfo.lastName}`,
          role: 'merchant',
          contract_id: onboardingData.contractId,
          is_active: true
        });

      if (userError) {
        console.error('Chyba pri vytváraní používateľského záznamu:', userError);
        throw new Error(`Chyba pri vytváraní používateľského záznamu: ${userError.message}`);
      }

      // Update contract with signature information
      const { error: contractError } = await supabase
        .from('contracts')
        .update({
          status: 'signed',
          signed_at: new Date().toISOString(),
          signed_by: `${onboardingData.contactInfo.firstName} ${onboardingData.contactInfo.lastName}`,
          signature_ip: await getUserIP()
        })
        .eq('id', onboardingData.contractId);

      if (contractError) {
        console.error('Chyba pri aktualizácii zmluvy:', contractError);
        throw new Error(`Chyba pri aktualizácii zmluvy: ${contractError.message}`);
      }

      console.log('Merchant účet úspešne vytvorený');
      
      toast.success('Váš účet bol úspešne vytvorený!', {
        description: 'Registrácia bola dokončená úspešne'
      });

      return {
        success: true,
        email: onboardingData.contactInfo.email
      };

    } catch (error) {
      console.error('Chyba pri vytváraní merchant účtu:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Neočakávaná chyba';
      
      toast.error('Chyba pri vytváraní účtu', {
        description: errorMessage
      });

      return {
        success: false,
        error: error
      };
    } finally {
      setIsCreatingUser(false);
    }
  };

  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  return {
    createMerchantAccount,
    isCreatingUser
  };
};
