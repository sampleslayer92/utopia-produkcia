import { supabase } from '@/integrations/supabase/client';
import { AresPersonsResponse } from '@/types/ares-persons';

export const fetchCompanyPersons = async (ico: string): Promise<AresPersonsResponse> => {
  try {
    console.log('=== ARES PERSONS SERVICE ===');
    console.log('Fetching persons for company ICO:', ico);
    
    const { data, error } = await supabase.functions.invoke('company-search', {
      body: { 
        ico: ico.trim(),
        fetchPersons: true
      }
    });

    console.log('Supabase function response:', { data, error });

    if (error) {
      console.error('Supabase function error:', error);
      return {
        success: false,
        error: `Failed to fetch persons from ARES: ${JSON.stringify(error)}`
      };
    }

    if (!data) {
      console.error('No data received from Supabase function');
      return {
        success: false,
        error: 'No data received from ARES service'
      };
    }

    console.log('Successfully received data from ARES:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching company persons:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};