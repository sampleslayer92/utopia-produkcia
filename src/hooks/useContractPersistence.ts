
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { toast } from 'sonner';
import { useContractValidation } from './useContractValidation';

export const useContractPersistence = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { ensureContractExists } = useContractValidation();

  // Utility function to validate and handle UUIDs
  const ensureValidUUID = (id: string): string => {
    // Check if it's already a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(id)) {
      return id; // Already a valid UUID
    }
    
    // If it's not a UUID, generate a new one but log the original for reference
    console.log('Converting non-UUID ID to UUID:', id);
    return crypto.randomUUID();
  };

  const saveContractData = async (contractId: string, onboardingData: OnboardingData) => {
    setIsLoading(true);
    
    try {
      console.log('Saving contract data for:', contractId, onboardingData);

      // Validate contract ID
      if (!contractId || contractId === 'undefined') {
        throw new Error('Neplatné ID zmluvy');
      }

      // Ensure contract exists before saving
      const { exists, contractId: validContractId } = await ensureContractExists(contractId);
      
      if (!exists) {
        throw new Error('Zmluva neexistuje a nepodarilo sa ju vytvoriť');
      }

      // Update the contract ID if it was recreated
      if (validContractId !== contractId) {
        console.log('Contract ID updated from', contractId, 'to', validContractId);
        // Update the onboarding data with the new contract ID
        onboardingData.contractId = validContractId;
      }

      // Save contract items (devices/services) with improved error handling
      for (const card of onboardingData.deviceSelection.dynamicCards) {
        console.log('Processing contract item:', card);
        
        try {
          // Ensure we have a valid UUID for the item
          const validItemId = ensureValidUUID(card.id);
          
          const { error: itemError } = await supabase
            .from('contract_items')
            .upsert({
              contract_id: validContractId,
              item_id: validItemId,
              item_type: card.type,
              category: card.category,
              name: card.name,
              description: card.description,
              count: card.count,
              monthly_fee: card.monthlyFee,
              company_cost: card.companyCost,
              custom_value: (card as any).customValue ? JSON.stringify({ customValue: (card as any).customValue }) : null
            });

          if (itemError) {
            console.error('Error saving contract item:', itemError);
            throw new Error(`Chyba pri ukladaní položky "${card.name}": ${itemError.message}`);
          }

          console.log('Contract item saved successfully:', validItemId);

          // Save addons for this item
          if (card.addons && card.addons.length > 0) {
            console.log('Saving addons for item:', validItemId, card.addons);
            
            // First, get the contract_item database ID
            const { data: contractItem, error: fetchError } = await supabase
              .from('contract_items')
              .select('id')
              .eq('contract_id', validContractId)
              .eq('item_id', validItemId)
              .single();

            if (fetchError) {
              console.error('Error fetching contract item:', fetchError);
              throw new Error(`Chyba pri načítaní položky pre addons: ${fetchError.message}`);
            }

            if (contractItem) {
              // Delete existing addons first to avoid duplicates
              await supabase
                .from('contract_item_addons')
                .delete()
                .eq('contract_item_id', contractItem.id);

              for (const addon of card.addons) {
                try {
                  const validAddonId = ensureValidUUID(addon.id);
                  
                  const { error: addonError } = await supabase
                    .from('contract_item_addons')
                    .insert({
                      contract_item_id: contractItem.id,
                      addon_id: validAddonId,
                      addon_name: addon.name,
                      count: addon.isPerDevice ? card.count : (addon.customQuantity || 1),
                      monthly_fee: addon.monthlyFee || 0,
                      company_cost: addon.companyCost || 0
                    });

                  if (addonError) {
                    console.error('Error saving addon:', addonError);
                    throw new Error(`Chyba pri ukladaní addon "${addon.name}": ${addonError.message}`);
                  }
                  
                  console.log('Addon saved successfully:', validAddonId);
                } catch (addonError) {
                  console.error('Failed to save addon:', addon.name, addonError);
                  // Continue with other addons even if one fails
                }
              }
            }
          }
        } catch (itemError) {
          console.error('Failed to save contract item:', card.name, itemError);
          throw itemError; // Re-throw to stop the process
        }
      }

      // Save calculation results if they exist
      if (onboardingData.fees.calculatorResults) {
        console.log('Saving calculation results:', onboardingData.fees.calculatorResults);
        
        try {
          const { error: calcError } = await supabase
            .from('contract_calculations')
            .upsert({
              contract_id: validContractId,
              monthly_turnover: onboardingData.fees.calculatorResults.monthlyTurnover,
              total_customer_payments: onboardingData.fees.calculatorResults.totalCustomerPayments,
              total_company_costs: onboardingData.fees.calculatorResults.totalCompanyCosts,
              effective_regulated: onboardingData.fees.calculatorResults.effectiveRegulated,
              effective_unregulated: onboardingData.fees.calculatorResults.effectiveUnregulated,
              regulated_fee: onboardingData.fees.calculatorResults.regulatedFee,
              unregulated_fee: onboardingData.fees.calculatorResults.unregulatedFee,
              transaction_margin: onboardingData.fees.calculatorResults.transactionMargin,
              service_margin: onboardingData.fees.calculatorResults.serviceMargin,
              total_monthly_profit: onboardingData.fees.calculatorResults.totalMonthlyProfit,
              calculation_data: JSON.parse(JSON.stringify(onboardingData.fees.calculatorResults))
            });

          if (calcError) {
            console.error('Error saving calculations:', calcError);
            throw new Error(`Chyba pri ukladaní výpočtov: ${calcError.message}`);
          }
        } catch (calcError) {
          console.error('Failed to save calculations:', calcError);
          // Don't throw here, calculations are not critical
        }
      }

      console.log('Contract data saved successfully');
      return { success: true, contractId: validContractId };

    } catch (error) {
      console.error('Error saving contract data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Neočakávaná chyba pri ukladaní';
      toast.error('Chyba pri ukladaní údajov', {
        description: errorMessage
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const loadContractData = async (contractId: string) => {
    setIsLoading(true);
    
    try {
      console.log('Loading contract data for:', contractId);
      
      if (!contractId || contractId === 'undefined') {
        throw new Error('Neplatné ID zmluvy');
      }

      // Validate contract exists before loading
      const { exists, contractId: validContractId } = await ensureContractExists(contractId);
      
      if (!exists) {
        throw new Error('Zmluva neexistuje');
      }
      
      // Load contract items with better error handling
      const { data: items, error: itemsError } = await supabase
        .from('contract_items')
        .select(`
          *,
          contract_item_addons (*)
        `)
        .eq('contract_id', validContractId);

      if (itemsError) {
        console.error('Error loading contract items:', itemsError);
        throw new Error(`Chyba pri načítaní položiek zmluvy: ${itemsError.message}`);
      }

      // Load calculation results
      const { data: calculations, error: calcError } = await supabase
        .from('contract_calculations')
        .select('*')
        .eq('contract_id', validContractId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (calcError) {
        console.error('Error loading calculations:', calcError);
        // Don't throw here, calculations are not critical
      }

      console.log('Contract data loaded successfully:', { items, calculations });
      
      return { 
        success: true, 
        items: items || [], 
        calculations: calculations || null,
        contractId: validContractId
      };

    } catch (error) {
      console.error('Error loading contract data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Neočakávaná chyba pri načítaní';
      toast.error('Chyba pri načítavaní údajov', {
        description: errorMessage
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveContractData,
    loadContractData,
    isLoading
  };
};
