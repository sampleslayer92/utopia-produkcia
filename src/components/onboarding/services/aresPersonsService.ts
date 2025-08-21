import { supabase } from '@/integrations/supabase/client';
import { AresPersonsResponse } from '@/types/ares-persons';

export const fetchCompanyPersons = async (ico: string): Promise<AresPersonsResponse> => {
  try {
    console.log('Fetching persons for company ICO:', ico);
    
    const { data, error } = await supabase.functions.invoke('company-search', {
      body: { 
        ico: ico.trim(),
        fetchPersons: true
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      return {
        success: false,
        error: 'Failed to fetch persons from ARES'
      };
    }

    return data;
  } catch (error) {
    console.error('Error fetching company persons:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};