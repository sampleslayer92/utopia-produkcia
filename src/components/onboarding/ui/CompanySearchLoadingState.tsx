import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CompanySearchLoadingStateProps {
  message?: string;
}

const CompanySearchLoadingState = ({ message }: CompanySearchLoadingStateProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-600">
          {message || t('companyInfo.searching')}
        </p>
      </div>
    </div>
  );
};

export default CompanySearchLoadingState;