
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

    // Call Slovensko.Digital API
    const apiUrl = `https://datahub.ekosystem.slovensko.digital/api/datahub/corporate_bodies/search?q=${searchQuery}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Lovable-App/1.0'
      }
    });

    if (!response.ok) {
      console.error(`API response error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ 
          error: 'Chyba pri komunikácii s obchodným registrom',
          details: `HTTP ${response.status}` 
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log(`API response received, ${data?.length || 0} results found`);

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in orsr-search function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Interná chyba servera',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
