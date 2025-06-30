
import { Building } from "lucide-react";

interface ContractTableEmptyStateProps {
  hasFilters: boolean;
}

const ContractTableEmptyState = ({ hasFilters }: ContractTableEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
      <Building className="h-16 w-16 mb-4 text-slate-300" />
      <h3 className="text-lg font-medium mb-2">
        {hasFilters ? "Žiadne výsledky" : "Žiadne zmluvy"}
      </h3>
      <p className="text-center max-w-md">
        {hasFilters 
          ? "Skúste zmeniť kritériá vyhľadávania alebo filtra."
          : "Zatiaľ nie sú vytvorené žiadne zmluvy. Vytvorte prvú zmluvu kliknutím na tlačidlo 'Nová zmluva'."
        }
      </p>
    </div>
  );
};

export default ContractTableEmptyState;
