
import { Store, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessLocationSidebarProps {
  hasBusinessContactRole: boolean;
  userRole?: string;
  onAddLocation: () => void;
}

const BusinessLocationSidebar = ({ 
  hasBusinessContactRole, 
  userRole,
  onAddLocation 
}: BusinessLocationSidebarProps) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-6 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Store className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-medium text-blue-900">Údaje o prevádzke</h3>
        </div>
        
        <p className="text-sm text-blue-800">
          Spravujte svoje prevádzkové lokality s detailnými údajmi o bankových účtoch, podnikaní a otváracích hodinách.
        </p>
        
        <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
          <p className="font-medium mb-2">Nové funkcie v tejto verzii</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Správa viacerých bankových účtov</li>
            <li>Detailné MCC kódy a predmet podnikania</li>
            <li>Interaktívne otváracie hodiny s rýchlymi akciami</li>
            <li>Podpora rôznych mien (EUR, CZK, USD)</li>
          </ul>
        </div>

        {hasBusinessContactRole && (
          <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
            <p className="font-medium mb-2">Automatické predvyplnenie</p>
            <p>Vaše kontaktné údaje sa automaticky predvyplnia pre nové prevádzky na základe vašej roly "{userRole}".</p>
          </div>
        )}
        
        <div className="mt-4">
          <Button
            onClick={onAddLocation}
            variant="outline"
            className="w-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Pridať prevádzku
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessLocationSidebar;
