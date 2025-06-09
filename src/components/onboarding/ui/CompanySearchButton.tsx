
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CompanySearchButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const CompanySearchButton = ({ onClick, disabled }: CompanySearchButtonProps) => {
  const { t } = useTranslation('forms');

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 h-12 px-4 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
    >
      <Search className="h-4 w-4" />
      {t('companyInfo.search.buttonText')}
    </Button>
  );
};

export default CompanySearchButton;
