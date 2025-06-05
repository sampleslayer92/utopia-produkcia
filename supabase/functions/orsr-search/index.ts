
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ORSRSearchRequest {
  ico?: string;
  name?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ico, name }: ORSRSearchRequest = await req.json();

    if (!ico && !name) {
      return new Response(
        JSON.stringify({ error: 'IČO alebo názov spoločnosti je povinný' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Build search query
    let searchQuery = '';
    if (ico) {
      // Remove any non-digit characters and validate IČO
      const cleanIco = ico.replace(/\D/g, '');
      if (cleanIco.length !== 8) {
        return new Response(
          JSON.stringify({ error: 'IČO musí mať 8 číslic' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      searchQuery = `cin:${cleanIco}`;
    } else if (name) {
      // Clean and encode name for search
      const cleanName = name.trim();
      if (cleanName.length < 3) {
        return new Response(
          JSON.stringify({ error: 'Názov spoločnosti musí mať aspoň 3 znaky' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      searchQuery = `name:${encodeURIComponent(cleanName)}`;
    }

    console.log(`Searching ORSR with query: ${searchQuery}`);

    // Try multiple API endpoints and approaches
    const apiUrls = [
      `https://datahub.ekosystem.slovensko.digital/api/datahub/corporate_bodies/search?q=${searchQuery}`,
      `https://datahub.ekosystem.slovensko.digital/corporate_bodies/search?q=${searchQuery}`,
    ];

    let lastError = null;
    
    for (const apiUrl of apiUrls) {
      try {
        console.log(`Trying API URL: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; OnboardingApp/1.0)',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        console.log(`API response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`API response received, ${data?.length || 0} results found`);

          return new Response(
            JSON.stringify(data),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        } else {
          lastError = `HTTP ${response.status}: ${response.statusText}`;
          console.log(`API error for ${apiUrl}: ${lastError}`);
          
          // Try to get error details
          try {
            const errorText = await response.text();
            console.log(`Error response body: ${errorText}`);
          } catch (e) {
            console.log('Could not read error response body');
          }
        }
      } catch (fetchError) {
        lastError = fetchError.message;
        console.log(`Fetch error for ${apiUrl}: ${lastError}`);
      }
    }

    // If all API attempts failed, return a fallback response
    console.error(`All API endpoints failed. Last error: ${lastError}`);
    
    return new Response(
      JSON.stringify({ 
        error: 'Služba obchodného registra je dočasne nedostupná',
        details: 'Skúste to prosím neskôr alebo zadajte údaje manuálne',
        fallback: true
      }),
      { 
        status: 503, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in orsr-search function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Interná chyba servera',
        details: 'Skúste to prosím neskôr alebo zadajte údaje manuálne',
        fallback: true
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
