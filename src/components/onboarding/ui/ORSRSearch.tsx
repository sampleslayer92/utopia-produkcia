
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ORSRSearchProps {
  ico: string;
  onDataFound: (data: any) => void;
}

const ORSRSearch = ({ ico, onDataFound }: ORSRSearchProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const searchORSR = async () => {
    if (!ico || ico.length < 8) {
      toast.error("Zadajte platné IČO");
      return;
    }

    setIsLoading(true);
    try {
      // Mock ORSR response for now - in real implementation this would call actual ORSR API
      // Using a timeout to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock company data based on IČO
      const mockData = {
        companyName: ico === "12345678" ? "UTOPIA Technologies s.r.o." : "Test Company s.r.o.",
        dic: `SK${ico}`,
        court: "Okresný súd Bratislava I",
        section: "Sro",
        insertNumber: `${ico.slice(-4)}/B`,
        address: {
          street: "Hlavná ulica 123",
          city: "Bratislava",
          zipCode: "81101"
        }
      };

      onDataFound(mockData);
      toast.success("Údaje zo slovenského obchodného registra boli načítané", {
        description: `Spoločnosť: ${mockData.companyName}`
      });
    } catch (error) {
      toast.error("Chyba pri vyhľadávaní v ORSR", {
        description: "Skúste to prosím znovu alebo zadajte údaje manuálne"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={searchORSR}
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
      {isLoading ? "Vyhľadávam..." : "Vyhľadať v ORSR"}
    </Button>
  );
};

export default ORSRSearch;
