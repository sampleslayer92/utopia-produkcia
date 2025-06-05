
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Building } from "lucide-react";
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
        throw new Error(error.message || 'Chyba pri volaní funkcie');
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const mappedData = mapApiResponse(data[0]);
        onDataFound(mappedData);
        toast.success("Údaje zo slovenského obchodného registra boli načítané", {
          description: `Spoločnosť: ${mappedData.companyName}`
        });
      } else {
        toast.error("Spoločnosť s týmto IČO nebola nájdená", {
          description: "Skúste zadať údaje manuálne"
        });
      }
    } catch (error) {
      console.error("Error searching by ICO:", error);
      toast.error("Chyba pri vyhľadávaní v obchodnom registri", {
        description: error.message || "Skúste to prosím znovu alebo zadajte údaje manuálne"
      });
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
        throw new Error(error.message || 'Chyba pri volaní funkcie');
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const mappedData = mapApiResponse(data[0]);
        onDataFound(mappedData);
        toast.success("Údaje zo slovenského obchodného registra boli načítané", {
          description: `Spoločnosť: ${mappedData.companyName}`
        });
        setSearchName(""); // Clear search after successful find
      } else {
        toast.error("Spoločnosť s týmto názvom nebola nájdená", {
          description: "Skúste iný názov alebo zadajte údaje manuálne"
        });
      }
    } catch (error) {
      console.error("Error searching by name:", error);
      toast.error("Chyba pri vyhľadávaní v obchodnom registri", {
        description: error.message || "Skúste to prosím znovu alebo zadajte údaje manuálne"
      });
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
      {/* Search by ICO */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={searchByICO}
          disabled={isLoading || !ico}
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
          />
          <Button
            type="button"
            onClick={searchByName}
            disabled={isSearchingByName || !searchName.trim()}
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
