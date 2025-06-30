
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImprovedMerchantTrigger = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      console.log('Creating improved merchant trigger...');

      // Create improved trigger function with better error handling and logging
      const triggerFunction = `
        CREATE OR REPLACE FUNCTION public.improved_merchant_creation()
        RETURNS TRIGGER
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          merchant_id_var UUID;
          contact_info_record RECORD;
          company_info_record RECORD;
          contract_record RECORD;
        BEGIN
          -- Log the trigger execution
          RAISE LOG 'Merchant creation trigger fired for contract_id: %', NEW.contract_id;
          
          -- Get contract info
          SELECT * INTO contract_record 
          FROM contracts 
          WHERE id = NEW.contract_id 
          LIMIT 1;
          
          -- Only proceed if contract exists
          IF contract_record IS NULL THEN
            RAISE LOG 'Contract not found for id: %', NEW.contract_id;
            RETURN NEW;
          END IF;
          
          -- Skip if merchant already exists
          IF contract_record.merchant_id IS NOT NULL THEN
            RAISE LOG 'Contract % already has merchant_id: %', NEW.contract_id, contract_record.merchant_id;
            RETURN NEW;
          END IF;
          
          -- Get contact info for this contract
          SELECT * INTO contact_info_record 
          FROM contact_info 
          WHERE contract_id = NEW.contract_id 
          LIMIT 1;
          
          -- Get company info for this contract
          SELECT * INTO company_info_record 
          FROM company_info 
          WHERE contract_id = NEW.contract_id 
          LIMIT 1;
          
          -- Only proceed if we have both contact and company info
          IF contact_info_record IS NOT NULL AND company_info_record IS NOT NULL AND company_info_record.company_name IS NOT NULL THEN
            RAISE LOG 'Creating/linking merchant for company: %', company_info_record.company_name;
            
            -- Try to find existing merchant
            SELECT id INTO merchant_id_var
            FROM merchants
            WHERE company_name = company_info_record.company_name
              AND (ico = company_info_record.ico OR (ico IS NULL AND company_info_record.ico IS NULL))
            LIMIT 1;
            
            -- If merchant doesn't exist, create new one
            IF merchant_id_var IS NULL THEN
              BEGIN
                INSERT INTO merchants (
                  company_name,
                  ico,
                  dic,
                  vat_number,
                  contact_person_name,
                  contact_person_email,
                  contact_person_phone,
                  address_street,
                  address_city,
                  address_zip_code
                ) VALUES (
                  company_info_record.company_name,
                  company_info_record.ico,
                  company_info_record.dic,
                  company_info_record.vat_number,
                  CONCAT(contact_info_record.first_name, ' ', contact_info_record.last_name),
                  contact_info_record.email,
                  contact_info_record.phone,
                  company_info_record.address_street,
                  company_info_record.address_city,
                  company_info_record.address_zip_code
                ) RETURNING id INTO merchant_id_var;
                
                RAISE LOG 'Created new merchant with id: %', merchant_id_var;
              EXCEPTION
                WHEN others THEN
                  RAISE LOG 'Error creating merchant: %', SQLERRM;
                  RETURN NEW;
              END;
            ELSE
              RAISE LOG 'Found existing merchant with id: %', merchant_id_var;
            END IF;
            
            -- Link contract to merchant if not already linked
            IF merchant_id_var IS NOT NULL THEN
              BEGIN
                UPDATE contracts 
                SET merchant_id = merchant_id_var 
                WHERE id = NEW.contract_id;
                
                RAISE LOG 'Linked contract % to merchant %', NEW.contract_id, merchant_id_var;
              EXCEPTION
                WHEN others THEN
                  RAISE LOG 'Error linking contract to merchant: %', SQLERRM;
              END;
            END IF;
          ELSE
            RAISE LOG 'Missing contact or company info for contract: %', NEW.contract_id;
          END IF;
          
          RETURN NEW;
        END;
        $$;
      `;

      const { error: functionError } = await supabase.rpc('exec_sql', { 
        sql: triggerFunction 
      });

      if (functionError) {
        console.error('Error creating trigger function:', functionError);
        throw functionError;
      }

      // Drop existing triggers and create new ones
      const triggerUpdates = `
        -- Drop existing triggers
        DROP TRIGGER IF EXISTS create_merchant_on_contact_info_change ON contact_info;
        DROP TRIGGER IF EXISTS create_merchant_on_company_info_change ON company_info;
        
        -- Create new improved triggers
        CREATE TRIGGER create_merchant_on_contact_info_change
          AFTER INSERT OR UPDATE ON contact_info
          FOR EACH ROW EXECUTE FUNCTION improved_merchant_creation();

        CREATE TRIGGER create_merchant_on_company_info_change
          AFTER INSERT OR UPDATE ON company_info
          FOR EACH ROW EXECUTE FUNCTION improved_merchant_creation();
      `;

      const { error: triggerError } = await supabase.rpc('exec_sql', { 
        sql: triggerUpdates 
      });

      if (triggerError) {
        console.error('Error creating triggers:', triggerError);
        throw triggerError;
      }

      return { success: true };
    },
    onSuccess: () => {
      console.log('Improved merchant trigger created successfully');
      toast({
        title: "Trigger aktualizovaný",
        description: "Automatické vytváranie obchodníkov bolo vylepšené.",
      });
    },
    onError: (error: any) => {
      console.error('Failed to create improved trigger:', error);
      toast({
        title: "Chyba pri aktualizácii triggra",
        description: `Nepodarilo sa aktualizovať trigger: ${error.message}`,
        variant: "destructive",
      });
    }
  });
};
