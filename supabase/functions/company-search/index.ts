import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

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

// ARES XML API base URL (working endpoint)
const ARES_XML_BASE_URL = 'https://wwwinfo.mfcr.cz/ares/ares_es.html.cgi';

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
    console.log('Searching ARES XML API by name:', query);
    
    // Use XML ARES API with proper encoding for Czech/Slovak characters
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `${ARES_XML_BASE_URL}?cestina=cestina&obchodni_jmeno=${encodedQuery}&xml=1`;
    
    console.log('ARES XML search URL:', searchUrl);

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Company-Search-Function/1.0',
        'Accept': 'application/xml, text/xml',
      }
    });

    if (!response.ok) {
      console.error('ARES XML API error:', response.status, response.statusText);
      const errorBody = await response.text();
      console.error('ARES XML API error body:', errorBody);
      return [];
    }

    const xmlText = await response.text();
    console.log('ARES XML response received, length:', xmlText.length);

    return parseAresXmlResponse(xmlText);
  } catch (error) {
    console.error('Error searching by name:', error);
    return [];
  }
}

async function searchByNameFallback(query: string): Promise<CompanyRecognitionResult[]> {
  // For XML API, we can try different search parameters
  try {
    console.log('Trying ARES XML fallback search...');
    
    const encodedQuery = encodeURIComponent(query);
    // Try searching with different parameters
    const searchUrl = `${ARES_XML_BASE_URL}?cestina=cestina&nazev=${encodedQuery}&xml=1`;
    
    console.log('ARES XML fallback URL:', searchUrl);

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Company-Search-Function/1.0',
        'Accept': 'application/xml, text/xml',
      }
    });

    if (!response.ok) {
      console.error('ARES XML fallback API error:', response.status, response.statusText);
      return [];
    }

    const xmlText = await response.text();
    return parseAresXmlResponse(xmlText);
  } catch (error) {
    console.error('Error in XML fallback search:', error);
    return [];
  }
}

async function searchByIco(ico: string): Promise<CompanyRecognitionResult | null> {
  try {
    // Clean ICO (remove spaces, ensure 8 digits)
    const cleanIco = ico.replace(/\s/g, '').padStart(8, '0');
    
    console.log('Searching ARES XML API by ICO:', cleanIco);
    
    const searchUrl = `${ARES_XML_BASE_URL}?cestina=cestina&ico=${cleanIco}&xml=1`;
    
    console.log('ARES XML ICO search URL:', searchUrl);

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Company-Search-Function/1.0',
        'Accept': 'application/xml, text/xml',
      }
    });

    if (!response.ok) {
      console.error('ARES XML API error for ICO:', response.status, response.statusText);
      return null;
    }

    const xmlText = await response.text();
    const results = parseAresXmlResponse(xmlText);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error searching by ICO:', error);
    return null;
  }
}

async function searchByIcoFallback(cleanIco: string): Promise<CompanyRecognitionResult | null> {
  // For XML API, ICO search is the same endpoint, so this is just for consistency
  return null;
}

function parseAresXmlResponse(xmlText: string): CompanyRecognitionResult[] {
  try {
    console.log('Parsing ARES XML response...');
    
    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    if (!xmlDoc) {
      console.error('Failed to parse XML document');
      return [];
    }

    // Look for error in XML
    const errorElement = xmlDoc.querySelector('E');
    if (errorElement) {
      const errorText = errorElement.textContent;
      console.log('ARES XML API returned error:', errorText);
      return [];
    }

    // Look for company records (Zaznam elements)
    const records = xmlDoc.querySelectorAll('Zaznam');
    console.log('Found XML records count:', records.length);

    if (records.length === 0) {
      console.log('No company records found in XML response');
      return [];
    }

    const results: CompanyRecognitionResult[] = [];

    for (const record of records) {
      try {
        // Extract company data from XML
        const ico = record.querySelector('ICO')?.textContent?.trim() || '';
        const obchodniJmeno = record.querySelector('OF')?.textContent?.trim() || '';
        const dic = record.querySelector('DIC')?.textContent?.trim() || '';
        
        // Address information
        const ulice = record.querySelector('U')?.textContent?.trim() || '';
        const cisloDomovni = record.querySelector('CD')?.textContent?.trim() || '';
        const cisloOrientacni = record.querySelector('CO')?.textContent?.trim() || '';
        const obec = record.querySelector('N')?.textContent?.trim() || '';
        const psc = record.querySelector('PSC')?.textContent?.trim() || '';
        
        // Legal form
        const pravniForma = record.querySelector('PF')?.textContent?.trim() || '';
        
        // Build full address
        let fullAddress = '';
        const addressParts = [];
        if (ulice) addressParts.push(ulice);
        if (cisloDomovni) addressParts.push(cisloDomovni);
        if (cisloOrientacni) addressParts.push(`/${cisloOrientacni}`);
        fullAddress = addressParts.join(' ') || 'Nezadané';

        // Map legal form codes to our registry types
        let registryType: CompanyRecognitionResult['registryType'] = '';
        switch (pravniForma) {
          case '112':
          case 'Společnost s ručením omezeným':
            registryType = 'S.r.o.';
            break;
          case '121':
          case 'Akciová společnost':
            registryType = 'Akciová spoločnosť';
            break;
          case '701':
          case 'Fyzická osoba podnikající':
            registryType = 'Živnosť';
            break;
          case '301':
          case 'Nezisková organizace':
            registryType = 'Nezisková organizácia';
            break;
          default:
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
            city: obec || 'Nezadané',
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
    console.error('Error parsing ARES XML response:', error);
    return [];
  }
}