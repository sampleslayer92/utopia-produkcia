
import { useTranslation } from "react-i18next";
import { Building2, FileText } from "lucide-react";

interface CompanyInfoSidebarProps {
  contractId: string;
  contractNumber: string;
}

const CompanyInfoSidebar = ({ contractId, contractNumber }: CompanyInfoSidebarProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-medium text-blue-900">{t('steps.companyInfo.title')}</h3>
        </div>
        
        <p className="text-sm text-blue-800">
          {t('steps.companyInfo.description')}
        </p>

        {contractId && contractNumber && (
          <div className="bg-green-100/50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-3 w-3" />
              <span className="font-medium">{t('steps.contactInfo.sidebar.contractCreated')}</span>
            </div>
            <p>{t('steps.contactInfo.sidebar.contractNumber', { number: contractNumber })}</p>
          </div>
        )}

        <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
          <h4 className="font-medium mb-2">{t('steps.companyInfo.basicInfo.title')}</h4>
          <ul className="space-y-1">
            {(t('steps.companyInfo.features', { returnObjects: true }) as string[]).map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoSidebar;
