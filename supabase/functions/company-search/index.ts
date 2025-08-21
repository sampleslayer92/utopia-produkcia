import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface CompanyRecognitionResult {
  companyName: string;
  registryType: 'Živnosť' | 'S.r.o.' | 'Nezisková organizácia' | 'Akciová spoločnosť' | '';
  ico?: string;
  dic?: string;
  court?: string;
  section?: string;
  insertNumber?: string;
  isVatPayer?: boolean;
  address?: {
    street: string;
    city: string;
    zipCode: string;
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// New ARES REST API v3 base URL
const ARES_API_BASE_URL = 'https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, ico } = await req.json();
    console.log('Company search request:', { query, ico });

    let results: CompanyRecognitionResult[] = [];

    if (ico) {
      // Search by ICO
      const company = await searchByIco(ico);
      if (company) {
        results = [company];
      }
    } else if (query && query.length >= 2) {
      // Search by company name
      results = await searchByName(query);
    }

    console.log('ARES search results count:', results.length);

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in company-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      results: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function searchByName(query: string): Promise<CompanyRecognitionResult[]> {
  try {
    console.log('Searching ARES REST API v3 by name:', query);
    
    const searchUrl = `${ARES_API_BASE_URL}/vyhledat`;
    const requestBody = {
      obchodniJmeno: query,
      start: 0,
      pocet: 10
    };
    
    console.log('ARES REST API search URL:', searchUrl);
    console.log('Request body:', JSON.stringify(requestBody));

    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Company-Search-Function/1.0',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error('ARES REST API error:', response.status, response.statusText);
      const errorBody = await response.text();
      console.error('ARES REST API error body:', errorBody);
      return [];
    }

    const data = await response.json();
    console.log('ARES REST API response received');
    console.log('Response data keys:', Object.keys(data));

    return parseAresJsonResponse(data);
  } catch (error) {
    console.error('Error searching by name:', error);
    return [];
  }
}

async function searchByIco(ico: string): Promise<CompanyRecognitionResult | null> {
  try {
    // Clean ICO (remove spaces, ensure 8 digits)
    const cleanIco = ico.replace(/\s/g, '').padStart(8, '0');
    
    console.log('Searching ARES REST API v3 by ICO:', cleanIco);
    
    const searchUrl = `${ARES_API_BASE_URL}/${cleanIco}`;
    
    console.log('ARES REST API ICO search URL:', searchUrl);

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Company-Search-Function/1.0',
      }
    });

    if (!response.ok) {
      console.error('ARES REST API error for ICO:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    const results = parseAresJsonResponse({ ekonomickeSubjekty: [data] });
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error searching by ICO:', error);
    return null;
  }
}

function parseAresJsonResponse(data: any): CompanyRecognitionResult[] {
  try {
    console.log('Parsing ARES JSON response...');
    
    if (!data || !data.ekonomickeSubjekty) {
      console.log('No ekonomickeSubjekty in response');
      return [];
    }

    const subjects = data.ekonomickeSubjekty;
    console.log('Found subjects count:', subjects.length);

    if (subjects.length === 0) {
      console.log('No company records found in JSON response');
      return [];
    }

    const results: CompanyRecognitionResult[] = [];

    for (const subject of subjects) {
      try {
        // Extract basic company data
        const ico = subject.ico || '';
        const obchodniJmeno = subject.obchodniJmeno || '';
        const dic = subject.dic || '';
        
        // Legal form
        const pravniForma = subject.pravniForma?.nazev || subject.pravniForma?.kod || '';
        
        // Address information
        const sidlo = subject.sidlo || {};
        const nazevObce = sidlo.nazevObce || '';
        const nazevUlice = sidlo.nazevUlice || '';
        const cisloDomovni = sidlo.cisloDomovni || '';
        const cisloOrientacni = sidlo.cisloOrientacni || '';
        const psc = sidlo.psc || '';
        
        // Build full address
        let fullAddress = '';
        const addressParts = [];
        if (nazevUlice) addressParts.push(nazevUlice);
        if (cisloDomovni) addressParts.push(cisloDomovni);
        if (cisloOrientacni) addressParts.push(`/${cisloOrientacni}`);
        fullAddress = addressParts.join(' ') || 'Nezadané';

        // Map legal form to our registry types
        let registryType: CompanyRecognitionResult['registryType'] = '';
        const lowerPravniForma = pravniForma.toLowerCase();
        
        if (lowerPravniForma.includes('společnost s ručením omezeným') || lowerPravniForma.includes('s.r.o')) {
          registryType = 'S.r.o.';
        } else if (lowerPravniForma.includes('akciová společnost') || lowerPravniForma.includes('a.s')) {
          registryType = 'Akciová spoločnosť';
        } else if (lowerPravniForma.includes('fyzická osoba') || lowerPravniForma.includes('podnikající')) {
          registryType = 'Živnosť';
        } else if (lowerPravniForma.includes('nezisková') || lowerPravniForma.includes('spolek')) {
          registryType = 'Nezisková organizácia';
        } else {
          // Try to detect from company name
          if (obchodniJmeno.toLowerCase().includes('s.r.o') || obchodniJmeno.toLowerCase().includes('spol. s r.o')) {
            registryType = 'S.r.o.';
          } else if (obchodniJmeno.toLowerCase().includes('a.s') || obchodniJmeno.toLowerCase().includes('akciová')) {
            registryType = 'Akciová spoločnosť';
          } else {
            registryType = '';
          }
        }

        // Skip if we don't have essential data
        if (!obchodniJmeno || !ico) {
          console.log('Skipping record with missing essential data');
          continue;
        }

        const company: CompanyRecognitionResult = {
          companyName: obchodniJmeno,
          registryType,
          ico: ico,
          dic: dic || undefined,
          isVatPayer: !!dic,
          address: {
            street: fullAddress,
            city: nazevObce || 'Nezadané',
            zipCode: psc || '00000'
          }
        };

        results.push(company);
        console.log('Parsed company:', company.companyName, 'ICO:', company.ico);

      } catch (recordError) {
        console.error('Error parsing individual record:', recordError);
        // Continue with other records
      }
    }

    console.log('Successfully parsed companies count:', results.length);
    return results;

  } catch (error) {
    console.error('Error parsing ARES JSON response:', error);
    return [];
  }
}