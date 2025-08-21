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

const ARES_BASE_URL = 'https://ares.gov.cz/ekonomicke-subjekty-v-be/rest';

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

    console.log('ARES search results:', results);

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
    const searchUrl = `${ARES_BASE_URL}/ekonomicke-subjekty/vyhledat`;
    const params = new URLSearchParams({
      obchodniJmeno: query,
      zacitekObchodnihoJmena: 'true',
      aktivniSubjekt: 'true',
      razeni: 'PODLE_OBCHODNIHO_JMENA_ASC',
      start: '0',
      pocet: '10'
    });

    console.log('Searching ARES:', `${searchUrl}?${params}`);

    const response = await fetch(`${searchUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Company-Search-Function/1.0'
      }
    });

    if (!response.ok) {
      console.error('ARES API error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('ARES response:', data);

    return transformAresResults(data.ekonomickeSubjekty || []);
  } catch (error) {
    console.error('Error searching by name:', error);
    return [];
  }
}

async function searchByIco(ico: string): Promise<CompanyRecognitionResult | null> {
  try {
    const searchUrl = `${ARES_BASE_URL}/ekonomicky-subjekt/${ico}`;
    
    console.log('Searching ARES by ICO:', searchUrl);

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Company-Search-Function/1.0'
      }
    });

    if (!response.ok) {
      console.error('ARES API error for ICO:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('ARES ICO response:', data);

    const transformed = transformAresResults([data]);
    return transformed.length > 0 ? transformed[0] : null;
  } catch (error) {
    console.error('Error searching by ICO:', error);
    return null;
  }
}

function transformAresResults(aresCompanies: any[]): CompanyRecognitionResult[] {
  return aresCompanies.map(company => {
    const basicInfo = company.zakladniUdaje || company;
    const address = company.sidlo || basicInfo.sidlo;
    const registryInfo = company.pravniForma || basicInfo.pravniForma;

    // Map registry type from ARES to our format
    let registryType: CompanyRecognitionResult['registryType'] = '';
    const pravniFormaKod = registryInfo?.kodPravniFormy;
    
    switch (pravniFormaKod) {
      case '112': // s.r.o.
        registryType = 'S.r.o.';
        break;
      case '121': // a.s.
        registryType = 'Akciová spoločnosť';
        break;
      case '701': // Fyzická osoba podnikající
        registryType = 'Živnosť';
        break;
      case '301': // Nezisková organizace
        registryType = 'Nezisková organizácia';
        break;
      default:
        registryType = '';
    }

    // Build address
    let fullAddress = '';
    if (address) {
      const parts = [];
      if (address.nazevUlice) parts.push(address.nazevUlice);
      if (address.cisloDomovni) parts.push(address.cisloDomovni);
      if (address.cisloOrientacni) parts.push(`/${address.cisloOrientacni}`);
      fullAddress = parts.join(' ') || 'Nezadané';
    }

    const city = address?.nazevObce || address?.nazevMestskeCastiObvodu || 'Nezadané';
    const zipCode = address?.psc || '00000';

    return {
      companyName: basicInfo.obchodniJmeno || basicInfo.nazev || 'Nezadané',
      registryType,
      ico: basicInfo.ico,
      dic: basicInfo.dic,
      court: company.zapisVRejstriku?.nazevRejstriku,
      section: company.zapisVRejstriku?.oznaceniOddilu,
      insertNumber: company.zapisVRejstriku?.vlozkaRejstriku,
      isVatPayer: !!basicInfo.dic,
      address: {
        street: fullAddress,
        city: city,
        zipCode: zipCode
      }
    };
  });
}