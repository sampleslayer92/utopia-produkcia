
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Building, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ORSRSearchProps {
  ico: string;
  onDataFound: (data: any) => void;
}

interface SlovenskoDigitalCompany {
  cin: string;
  name: string;
  formatted_name?: string;
  tin?: string;
  vat_number?: string;
  street?: string;
  building_number?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  registration_court?: string;
  legal_form?: string;
  section?: string;
  file_number?: string;
}

const ORSRSearch = ({ ico, onDataFound }: ORSRSearchProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [isSearchingByName, setIsSearchingByName] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  const mapApiResponse = (company: SlovenskoDigitalCompany) => {
    // Map the API response to our expected format
    return {
      companyName: company.formatted_name || company.name,
      dic: company.tin || `SK${company.cin}`,
      court: company.registration_court || "Okresný súd Bratislava I",
      section: company.section || company.legal_form || "Sro",
      insertNumber: company.file_number || `${company.cin.slice(-4)}/B`,
      address: {
        street: `${company.street || ""} ${company.building_number || ""}`.trim() || "Neznáma ulica",
        city: company.city || "Neznáme mesto",
        zipCode: company.postal_code || "00000"
      }
    };
  };

  const handleApiError = (error: any, searchType: string) => {
    console.error(`Error searching by ${searchType}:`, error);
    
    if (error.fallback) {
      setApiUnavailable(true);
      toast.error("Služba obchodného registra je nedostupná", {
        description: "Zadajte prosím údaje manuálne"
      });
    } else {
      toast.error(`Chyba pri vyhľadávaní v obchodnom registri`, {
        description: error.details || "Skúste to prosím znovu alebo zadajte údaje manuálne"
      });
    }
  };

  const searchByICO = async () => {
    if (!ico || ico.length < 8) {
      toast.error("Zadajte platné IČO (8 čísel)");
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Searching by ICO: ${ico}`);
      
      const { data, error } = await supabase.functions.invoke('orsr-search', {
        body: { ico }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      if (data && !data.error && Array.isArray(data) && data.length > 0) {
        const mappedData = mapApiResponse(data[0]);
        onDataFound(mappedData);
        toast.success("Údaje zo slovenského obchodného registra boli načítané", {
          description: `Spoločnosť: ${mappedData.companyName}`
        });
        setApiUnavailable(false);
      } else if (data && data.error) {
        throw data;
      } else {
        toast.error("Spoločnosť s týmto IČO nebola nájdená", {
          description: "Skúste zadať údaje manuálne"
        });
      }
    } catch (error) {
      handleApiError(error, "ICO");
    } finally {
      setIsLoading(false);
    }
  };

  const searchByName = async () => {
    if (!searchName || searchName.trim().length < 3) {
      toast.error("Zadajte aspoň 3 znaky názvu spoločnosti");
      return;
    }

    setIsSearchingByName(true);
    try {
      console.log(`Searching by name: ${searchName}`);
      
      const { data, error } = await supabase.functions.invoke('orsr-search', {
        body: { name: searchName.trim() }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      if (data && !data.error && Array.isArray(data) && data.length > 0) {
        const mappedData = mapApiResponse(data[0]);
        onDataFound(mappedData);
        toast.success("Údaje zo slovenského obchodného registra boli načítané", {
          description: `Spoločnosť: ${mappedData.companyName}`
        });
        setSearchName(""); // Clear search after successful find
        setApiUnavailable(false);
      } else if (data && data.error) {
        throw data;
      } else {
        toast.error("Spoločnosť s týmto názvom nebola nájdená", {
          description: "Skúste iný názov alebo zadajte údaje manuálne"
        });
      }
    } catch (error) {
      handleApiError(error, "name");
    } finally {
      setIsSearchingByName(false);
    }
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchByName();
    }
  };

  return (
    <div className="space-y-3">
      {apiUnavailable && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span className="text-sm text-amber-800">
            Služba obchodného registra je dočasne nedostupná. Zadajte údaje manuálne.
          </span>
        </div>
      )}

      {/* Search by ICO */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={searchByICO}
          disabled={isLoading || !ico || apiUnavailable}
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          {isLoading ? "Vyhľadávam..." : "Vyhľadať podľa IČO"}
        </Button>
      </div>

      {/* Search by name */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Building className="h-4 w-4" />
          <span>alebo vyhľadajte podľa názvu:</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Zadajte názov spoločnosti..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={handleNameKeyPress}
            className="text-sm"
            disabled={apiUnavailable}
          />
          <Button
            type="button"
            onClick={searchByName}
            disabled={isSearchingByName || !searchName.trim() || apiUnavailable}
            size="sm"
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            {isSearchingByName ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isSearchingByName ? "Hľadám..." : "Vyhľadať"}
          </Button>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Dáta sú načítavané z oficiálneho slovenského obchodného registra cez Slovensko.Digital API
      </p>
    </div>
  );
};

export default ORSRSearch;
