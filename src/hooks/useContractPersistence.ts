
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { toast } from 'sonner';

export const useContractPersistence = () => {
  const [isLoading, setIsLoading] = useState(false);

  const saveContractData = async (contractId: string, onboardingData: OnboardingData) => {
    setIsLoading(true);
    
    try {
      console.log('Saving contract data for:', contractId, onboardingData);

      // Save contract items (devices/services)
      for (const card of onboardingData.deviceSelection.dynamicCards) {
        console.log('Saving contract item:', card);
        
        const { error: itemError } = await supabase
          .from('contract_items')
          .upsert({
            contract_id: contractId,
            item_id: card.id,
            item_type: card.type,
            category: card.category,
            name: card.name,
            description: card.description,
            count: card.count,
            monthly_fee: card.monthlyFee,
            company_cost: card.companyCost,
            custom_value: (card as any).customValue || null
          });

        if (itemError) {
          console.error('Error saving contract item:', itemError);
          throw itemError;
        }

        // Save addons for this item
        if (card.addons && card.addons.length > 0) {
          console.log('Saving addons for item:', card.id, card.addons);
          
          // First, get the contract_item_id
          const { data: contractItem } = await supabase
            .from('contract_items')
            .select('id')
            .eq('contract_id', contractId)
            .eq('item_id', card.id)
            .single();

          if (contractItem) {
            for (const addon of card.addons) {
              const { error: addonError } = await supabase
                .from('contract_item_addons')
                .upsert({
                  contract_item_id: contractItem.id,
                  addon_id: addon.id,
                  category: addon.category,
                  name: addon.name,
                  description: addon.description,
                  quantity: addon.isPerDevice ? card.count : (addon.customQuantity || 1),
                  monthly_fee: addon.monthlyFee,
                  company_cost: addon.companyCost,
                  is_per_device: addon.isPerDevice
                });

              if (addonError) {
                console.error('Error saving addon:', addonError);
                throw addonError;
              }
            }
          }
        }
      }

      // Save calculation results if they exist
      if (onboardingData.fees.calculatorResults) {
        console.log('Saving calculation results:', onboardingData.fees.calculatorResults);
        
        const { error: calcError } = await supabase
          .from('contract_calculations')
          .upsert({
            contract_id: contractId,
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
          throw calcError;
        }
      }

      console.log('Contract data saved successfully');
      return { success: true };

    } catch (error) {
      console.error('Error saving contract data:', error);
      // Only show error toast, not success toast
      toast.error('Chyba pri ukladaní údajov');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const loadContractData = async (contractId: string) => {
    setIsLoading(true);
    
    try {
      console.log('Loading contract data for:', contractId);
      
      // Load contract items
      const { data: items, error: itemsError } = await supabase
        .from('contract_items')
        .select(`
          *,
          contract_item_addons (*)
        `)
        .eq('contract_id', contractId);

      if (itemsError) {
        console.error('Error loading contract items:', itemsError);
        throw itemsError;
      }

      // Load calculation results
      const { data: calculations, error: calcError } = await supabase
        .from('contract_calculations')
        .select('*')
        .eq('contract_id', contractId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (calcError) {
        console.error('Error loading calculations:', calcError);
        throw calcError;
      }

      console.log('Contract data loaded successfully:', { items, calculations });
      
      return { 
        success: true, 
        items: items || [], 
        calculations: calculations || null 
      };

    } catch (error) {
      console.error('Error loading contract data:', error);
      toast.error('Chyba pri načítavaní údajov');
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
