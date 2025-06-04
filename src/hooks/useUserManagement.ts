
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { toast } from 'sonner';

export const useUserManagement = () => {
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const createMerchantAccount = async (onboardingData: OnboardingData) => {
    setIsCreatingUser(true);
    
    try {
      console.log('Creating merchant account...', onboardingData);
      
      if (!onboardingData.contactInfo.email || !onboardingData.contractId) {
        throw new Error('Email and contract ID are required');
      }

      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: onboardingData.contactInfo.email,
        password: generateTemporaryPassword(),
        options: {
          emailRedirectTo: `${window.location.origin}/merchant`,
          data: {
            full_name: `${onboardingData.contactInfo.firstName} ${onboardingData.contactInfo.lastName}`,
            role: 'merchant'
          }
        }
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        throw new Error(`Chyba pri vytváraní účtu: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Nepodarilo sa vytvoriť používateľský účet');
      }

      // Create user record in our users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          auth_user_id: authData.user.id,
          email: onboardingData.contactInfo.email,
          full_name: `${onboardingData.contactInfo.firstName} ${onboardingData.contactInfo.lastName}`,
          role: 'merchant',
          contract_id: onboardingData.contractId,
          is_active: true
        });

      if (userError) {
        console.error('User record creation error:', userError);
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
        console.error('Contract update error:', contractError);
        throw new Error(`Chyba pri aktualizácii zmluvy: ${contractError.message}`);
      }

      console.log('Merchant account created successfully');
      
      toast.success('Váš účet bol úspešne vytvorený!', {
        description: 'Môžete sa teraz prihlásiť do portálu'
      });

      return {
        success: true,
        userId: authData.user.id,
        email: onboardingData.contactInfo.email
      };

    } catch (error) {
      console.error('Merchant account creation error:', error);
      
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

  const generateTemporaryPassword = () => {
    // Generate a temporary password - in production, this should be sent via email
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
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
