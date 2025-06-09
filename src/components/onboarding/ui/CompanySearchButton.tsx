
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface CompanySearchButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const CompanySearchButton = ({ onClick, disabled }: CompanySearchButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 h-12 px-4 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
    >
      <Search className="h-4 w-4" />
      Vyhľadať
    </Button>
  );
};

export default CompanySearchButton;
