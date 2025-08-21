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

interface AresPersonInfo {
  firstName: string;
  lastName: string;
  position: string;
  birthDate?: string;
  citizenship?: string;
  functionStart?: string;
  functionEnd?: string;
}

interface CompanyPersonsResult {
  companyName: string;
  ico: string;
  persons: AresPersonInfo[];
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
    const { query, ico, fetchPersons } = await req.json();
    console.log('Company search request:', { query, ico, fetchPersons });

    if (fetchPersons && ico) {
      // Fetch persons for a specific company
      const personsResult = await fetchCompanyPersons(ico);
      return new Response(JSON.stringify(personsResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

async function fetchCompanyPersons(ico: string): Promise<{ success: boolean; data?: CompanyPersonsResult; error?: string }> {
  try {
    // Clean ICO
    const cleanIco = ico.replace(/\s/g, '').padStart(8, '0');
    console.log('Fetching persons for ICO:', cleanIco);

    // Fetch detailed company data from ARES
    const detailUrl = `${ARES_API_BASE_URL}/${cleanIco}`;
    console.log('ARES detail URL:', detailUrl);

    const response = await fetch(detailUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Company-Search-Function/1.0',
      }
    });

    if (!response.ok) {
      console.error('ARES API error for persons:', response.status, response.statusText);
      return { success: false, error: 'Failed to fetch company details from ARES' };
    }

    const data = await response.json();
    console.log('ARES detailed response received for persons');

    const persons = parseAresPersons(data);
    
    const result: CompanyPersonsResult = {
      companyName: data.obchodniJmeno || '',
      ico: cleanIco,
      persons
    };

    console.log('Parsed persons count:', persons.length);
    return { success: true, data: result };

  } catch (error) {
    console.error('Error fetching company persons:', error);
    return { success: false, error: error.message };
  }
}

function parseAresPersons(data: any): AresPersonInfo[] {
  try {
    console.log('Parsing ARES persons data...');
    
    const persons: AresPersonInfo[] = [];

    // Check multiple possible locations for person data in ARES response
    const possiblePersonsPaths = [
      data.statutarniOrgan?.clenove,
      data.statutarniOrgan?.funkce,
      data.dalsiUdaje?.[0]?.statutarniOrgan?.clenove,
      data.dalsiUdaje?.[0]?.statutarniOrgan?.funkce,
      data.clenoveStatutarnihoOrganu,
      data.funkce
    ];

    for (const personsData of possiblePersonsPaths) {
      if (Array.isArray(personsData)) {
        console.log('Found persons array with length:', personsData.length);
        
        for (const person of personsData) {
          try {
            // Extract person information
            const osoba = person.osoba || person;
            const jmeno = osoba.jmeno || '';
            const prijmeni = osoba.prijmeni || '';
            const funkce = person.nazevFunkce || person.funkce?.nazev || person.funkce || 'Jednatel';
            
            // Extract dates
            const datumVzniku = person.datumVzniku || person.od || '';
            const datumZaniku = person.datumZaniku || person.do || '';
            
            // Extract birth date if available
            const narozeni = osoba.narozeni || osoba.datumNarozeni || '';
            
            // Extract citizenship
            const statniPrislusnost = osoba.statniPrislusnost || osoba.statPrislusnost || '';

            if (jmeno && prijmeni) {
              persons.push({
                firstName: jmeno,
                lastName: prijmeni,
                position: funkce,
                birthDate: narozeni || undefined,
                citizenship: statniPrislusnost || undefined,
                functionStart: datumVzniku || undefined,
                functionEnd: datumZaniku || undefined
              });
              
              console.log(`Parsed person: ${jmeno} ${prijmeni} - ${funkce}`);
            }
          } catch (personError) {
            console.error('Error parsing individual person:', personError);
          }
        }
      }
    }

    console.log('Total parsed persons:', persons.length);
    return persons;

  } catch (error) {
    console.error('Error parsing ARES persons:', error);
    return [];
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
        
        // Enhanced registry information extraction
        const registrace = subject.registrace || {};
        const registracniSud = registrace.registracniSud?.nazev || '';
        const oddil = registrace.oddil?.nazev || registrace.oddil?.kod || '';
        const vlozka = registrace.vlozka || '';
        
        // Build full address
        let fullAddress = '';
        const addressParts = [];
        if (nazevUlice) addressParts.push(nazevUlice);
        if (cisloDomovni) addressParts.push(cisloDomovni);
        if (cisloOrientacni) addressParts.push(`/${cisloOrientacni}`);
        fullAddress = addressParts.join(' ') || 'Nezadané';

        // Enhanced legal form mapping to Slovak registry types
        let registryType: CompanyRecognitionResult['registryType'] = '';
        const lowerPravniForma = pravniForma.toLowerCase();
        
        if (lowerPravniForma.includes('společnost s ručením omezeným') || 
            lowerPravniForma.includes('s.r.o') || 
            lowerPravniForma.includes('spol. s r.o')) {
          registryType = 'S.r.o.';
        } else if (lowerPravniForma.includes('akciová společnost') || 
                   lowerPravniForma.includes('a.s') ||
                   lowerPravniForma.includes('akciový spoločnosť')) {
          registryType = 'Akciová spoločnosť';
        } else if (lowerPravniForma.includes('fyzická osoba') || 
                   lowerPravniForma.includes('podnikající') ||
                   lowerPravniForma.includes('živnost')) {
          registryType = 'Živnosť';
        } else if (lowerPravniForma.includes('nezisková') || 
                   lowerPravniForma.includes('spolek') ||
                   lowerPravniForma.includes('občianské združenie')) {
          registryType = 'Nezisková organizácia';
        } else {
          // Try to detect from company name
          const lowerCompanyName = obchodniJmeno.toLowerCase();
          if (lowerCompanyName.includes('s.r.o') || lowerCompanyName.includes('spol. s r.o')) {
            registryType = 'S.r.o.';
          } else if (lowerCompanyName.includes('a.s') || lowerCompanyName.includes('akciová')) {
            registryType = 'Akciová spoločnosť';
          } else {
            registryType = '';
          }
        }

        // Validate and clean ICO (must be 8 digits)
        const cleanIco = ico.replace(/\s/g, '').padStart(8, '0');
        const validIco = /^\d{8}$/.test(cleanIco) ? cleanIco : ico;

        // Validate DIC
        const cleanDic = dic ? dic.replace(/\s/g, '') : '';
        const validDic = cleanDic && /^\d{10}$/.test(cleanDic) ? cleanDic : cleanDic;

        // Skip if we don't have essential data
        if (!obchodniJmeno || !ico) {
          console.log('Skipping record with missing essential data');
          continue;
        }

        const company: CompanyRecognitionResult = {
          companyName: obchodniJmeno,
          registryType,
          ico: validIco,
          dic: validDic || undefined,
          court: registracniSud || undefined,
          section: oddil || undefined,
          insertNumber: vlozka || undefined,
          isVatPayer: !!validDic,
          address: {
            street: fullAddress,
            city: nazevObce || 'Nezadané',
            zipCode: psc || '00000'
          }
        };

        results.push(company);
        console.log('Parsed company:', company.companyName, 'ICO:', company.ico);
        if (company.court) {
          console.log('Registry info - Court:', company.court, 'Section:', company.section, 'Insert:', company.insertNumber);
        }

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