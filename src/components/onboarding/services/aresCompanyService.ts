import { supabase } from "@/integrations/supabase/client";
import { CompanyRecognitionResult } from "./mockCompanyRecognition";

// Re-export for convenience
export type { CompanyRecognitionResult } from "./mockCompanyRecognition";

// Update the interface to match the new Edge Function response
export interface CompanyRecognitionResultExtended extends CompanyRecognitionResult {
  registrationInfo?: {
    registrationType?: 'commercial_register' | 'trade_license' | 'nonprofit_register' | 'other';
    court?: string;
    section?: string;
    insertNumber?: string;
    tradeOffice?: string;
    tradeLicenseNumber?: string;
    registrationAuthority?: string;
    registrationNumber?: string;
  };
}

// Configuration flag to switch between ARES and mock data
// XML ARES API is now working, so we enable it by default
const USE_ARES_API = true;

// Cache for ARES results to improve performance
const searchCache = new Map<string, { results: CompanyRecognitionResult[], timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const searchAresCompanies = async (query: string, retryCount = 0): Promise<CompanyRecognitionResult[]> => {
  if (!USE_ARES_API) {
    // Fallback to mock data
    const { searchCompanySuggestions } = await import('./mockCompanyRecognition');
    return searchCompanySuggestions(query);
  }

  // Check cache first
  const cacheKey = `search_${query.toLowerCase()}`;
  const cached = searchCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log('Returning cached ARES results for:', query);
    return cached.results;
  }

  try {
    console.log('Searching ARES for:', query, retryCount > 0 ? `(retry ${retryCount})` : '');

    const { data, error } = await supabase.functions.invoke('company-search', {
      body: { query }
    });

    if (error) {
      console.error('ARES search error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Retry logic
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying ARES search in ${RETRY_DELAY}ms...`);
        await sleep(RETRY_DELAY * (retryCount + 1));
        return searchAresCompanies(query, retryCount + 1);
      }
      
      // Fallback to mock data on error after retries
      const { searchCompanySuggestions } = await import('./mockCompanyRecognition');
      return searchCompanySuggestions(query);
    }

    console.log('ARES search response:', data);
    const results = data?.results || [];
    
    // Cache successful results
    if (results.length > 0) {
      searchCache.set(cacheKey, { results, timestamp: Date.now() });
    }
    
    // If ARES returns empty results, fall back to mock data
    if (results.length === 0) {
      console.log('ARES returned no results, falling back to mock data');
      const { searchCompanySuggestions } = await import('./mockCompanyRecognition');
      return searchCompanySuggestions(query);
    }
    
    return results;
  } catch (error) {
    console.error('Error calling ARES function:', error);
    
    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying ARES search in ${RETRY_DELAY}ms...`);
      await sleep(RETRY_DELAY * (retryCount + 1));
      return searchAresCompanies(query, retryCount + 1);
    }
    
    // Fallback to mock data on error after retries
    const { searchCompanySuggestions } = await import('./mockCompanyRecognition');
    return searchCompanySuggestions(query);
  }
};

export const getCompanyByIco = async (ico: string, retryCount = 0): Promise<CompanyRecognitionResult | null> => {
  if (!USE_ARES_API) {
    // Fallback to mock data
    const { recognizeCompanyFromName } = await import('./mockCompanyRecognition');
    return recognizeCompanyFromName(ico);
  }

  // Validate ICO format
  const cleanIco = ico.replace(/\s/g, '');
  if (!/^\d{8}$/.test(cleanIco) && !/^\d{7}$/.test(cleanIco)) {
    console.warn('Invalid ICO format:', ico);
    return null;
  }

  // Check cache first
  const cacheKey = `ico_${cleanIco}`;
  const cached = searchCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log('Returning cached ARES result for ICO:', ico);
    return cached.results.length > 0 ? cached.results[0] : null;
  }

  try {
    console.log('Getting company by ICO:', ico, retryCount > 0 ? `(retry ${retryCount})` : '');

    const { data, error } = await supabase.functions.invoke('company-search', {
      body: { ico: cleanIco }
    });

    if (error) {
      console.error('ARES ICO search error:', error);
      
      // Retry logic
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying ICO search in ${RETRY_DELAY}ms...`);
        await sleep(RETRY_DELAY * (retryCount + 1));
        return getCompanyByIco(ico, retryCount + 1);
      }
      
      return null;
    }

    console.log('ARES ICO response:', data);
    const results = data?.results || [];
    const result = results.length > 0 ? results[0] : null;
    
    // Cache successful result
    if (result) {
      searchCache.set(cacheKey, { results: [result], timestamp: Date.now() });
    }
    
    return result;
  } catch (error) {
    console.error('Error calling ARES function for ICO:', error);
    
    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying ICO search in ${RETRY_DELAY}ms...`);
      await sleep(RETRY_DELAY * (retryCount + 1));
      return getCompanyByIco(ico, retryCount + 1);
    }
    
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