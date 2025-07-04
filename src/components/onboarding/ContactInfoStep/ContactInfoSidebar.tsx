
import { User, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ContactInfoSidebarProps {
  hasAutoFilled: boolean;
  userRoles: string[];
  autoFillStatus: {
    actualOwners: boolean;
    authorizedPersons: boolean;
    businessLocations: boolean;
    companyInfo: boolean;
  };
  isBasicInfoComplete: boolean;
  contractId?: string;
  contractNumber?: string;
}

const ContactInfoSidebar = ({
  hasAutoFilled,
  autoFillStatus,
  isBasicInfoComplete,
  contractId,
  contractNumber
}: ContactInfoSidebarProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-medium text-blue-900">{t('contactInfo.sidebar.title')}</h3>
        </div>
        
        <p className="text-sm text-blue-800">
          {t('contactInfo.sidebar.description')}
        </p>

        {contractId && contractNumber && (
          <div className="bg-green-100/50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-3 w-3" />
              <span className="font-medium">{t('contactInfo.sidebar.contractCreated')}</span>
            </div>
            <p>{t('contactInfo.sidebar.contractNumber')}: {contractNumber}</p>
          </div>
        )}
        
        <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
          <p className="font-medium mb-2">{t('contactInfo.sidebar.autoFill.title')}</p>
          <p className="mb-3">
            {t('contactInfo.sidebar.autoFill.description')}
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              {autoFillStatus.companyInfo ? 
                <CheckCircle className="h-3 w-3 text-green-600" /> : 
                <Clock className="h-3 w-3 text-blue-500" />
              }
              <span>{t('contactInfo.sidebar.autoFill.items.companyContact')}</span>
            </li>
            <li className="flex items-center gap-2">
              {autoFillStatus.businessLocations ? 
                <CheckCircle className="h-3 w-3 text-green-600" /> : 
                <Clock className="h-3 w-3 text-blue-500" />
              }
              <span>{t('contactInfo.sidebar.autoFill.items.firstLocation')}</span>
            </li>
            <li className="flex items-center gap-2">
              {autoFillStatus.authorizedPersons ? 
                <CheckCircle className="h-3 w-3 text-green-600" /> : 
                <Clock className="h-3 w-3 text-blue-500" />
              }
              <span>{t('contactInfo.sidebar.autoFill.items.authorizedPerson')}</span>
            </li>
            <li className="flex items-center gap-2">
              {autoFillStatus.actualOwners ? 
                <CheckCircle className="h-3 w-3 text-green-600" /> : 
                <Clock className="h-3 w-3 text-blue-500" />
              }
              <span>{t('contactInfo.sidebar.autoFill.items.actualOwner')}</span>
            </li>
          </ul>
        </div>

        {hasAutoFilled && isBasicInfoComplete && (
          <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium">{t('contactInfo.sidebar.autoFill.completed')}</span>
            </div>
            <p>
              {t('contactInfo.sidebar.autoFill.completedDescription')}
            </p>
          </div>
        )}

        {!isBasicInfoComplete && (
          <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{t('contactInfo.sidebar.requiredData.title')}</span>
            </div>
            <p>
              {t('contactInfo.sidebar.requiredData.description')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfoSidebar;
