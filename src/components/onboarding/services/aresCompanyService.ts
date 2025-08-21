import { supabase } from "@/integrations/supabase/client";
import { CompanyRecognitionResult } from "./mockCompanyRecognition";

// Re-export for convenience
export type { CompanyRecognitionResult } from "./mockCompanyRecognition";

// Configuration flag to switch between ARES and mock data
const USE_ARES_API = true;

export const searchAresCompanies = async (query: string): Promise<CompanyRecognitionResult[]> => {
  if (!USE_ARES_API) {
    // Fallback to mock data
    const { searchCompanySuggestions } = await import('./mockCompanyRecognition');
    return searchCompanySuggestions(query);
  }

  try {
    console.log('Searching ARES for:', query);

    const { data, error } = await supabase.functions.invoke('company-search', {
      body: { query }
    });

    if (error) {
      console.error('ARES search error:', error);
      // Fallback to mock data on error
      const { searchCompanySuggestions } = await import('./mockCompanyRecognition');
      return searchCompanySuggestions(query);
    }

    console.log('ARES search response:', data);
    return data?.results || [];
  } catch (error) {
    console.error('Error calling ARES function:', error);
    // Fallback to mock data on error
    const { searchCompanySuggestions } = await import('./mockCompanyRecognition');
    return searchCompanySuggestions(query);
  }
};

export const getCompanyByIco = async (ico: string): Promise<CompanyRecognitionResult | null> => {
  if (!USE_ARES_API) {
    // Fallback to mock data
    const { recognizeCompanyFromName } = await import('./mockCompanyRecognition');
    return recognizeCompanyFromName(ico);
  }

  try {
    console.log('Getting company by ICO:', ico);

    const { data, error } = await supabase.functions.invoke('company-search', {
      body: { ico }
    });

    if (error) {
      console.error('ARES ICO search error:', error);
      return null;
    }

    console.log('ARES ICO response:', data);
    const results = data?.results || [];
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error calling ARES function for ICO:', error);
    return null;
  }
};

// Enhanced search function that combines ARES with intelligent fallback
export const searchCompanySuggestions = async (query: string): Promise<CompanyRecognitionResult[]> => {
  // First try ARES
  const aresResults = await searchAresCompanies(query);
  
  // If ARES returns results, use them
  if (aresResults.length > 0) {
    return aresResults.slice(0, 8); // Limit to 8 results
  }

  // If no ARES results, try mock data as fallback
  console.log('No ARES results, falling back to mock data');
  const { searchCompanySuggestions: mockSearch } = await import('./mockCompanyRecognition');
  return mockSearch(query);
};

export const recognizeCompanyFromName = async (companyName: string): Promise<CompanyRecognitionResult | null> => {
  const suggestions = await searchCompanySuggestions(companyName);
  return suggestions.length > 0 ? suggestions[0] : null;
};