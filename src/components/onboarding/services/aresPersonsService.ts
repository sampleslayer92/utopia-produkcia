import { supabase } from '@/integrations/supabase/client';
import { AresPersonsResponse } from '@/types/ares-persons';

export const fetchCompanyPersons = async (ico: string): Promise<AresPersonsResponse> => {
  try {
    console.log('=== ARES PERSONS SERVICE ===');
    console.log('Input ICO:', ico);
    console.log('Trimmed ICO:', ico.trim());
    console.log('ICO length:', ico.trim().length);
    console.log('Calling Supabase function with fetchPersons: true');
    
    const { data, error } = await supabase.functions.invoke('company-search', {
      body: { 
        ico: ico.trim(),
        fetchPersons: true
      }
    });

    console.log('=== SUPABASE FUNCTION RESPONSE ===');
    console.log('Response data:', JSON.stringify(data, null, 2));
    console.log('Response error:', error);

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

    console.log('=== FINAL RESPONSE ===');
    console.log('Success:', data.success);
    console.log('Persons count:', data.data?.persons?.length || 0);
    if (data.data?.persons?.length > 0) {
      data.data.persons.forEach((person: any, index: number) => {
        console.log(`Person ${index + 1}:`, person.firstName, person.lastName, '-', person.position);
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchCompanyPersons service:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};