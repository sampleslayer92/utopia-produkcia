
import { useState } from "react";
import { User, Trash2, Mail, Phone, Calendar, MapPin, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { AuthorizedPerson } from "@/types/onboarding";

interface EnhancedAuthorizedPersonCardProps {
  person: AuthorizedPerson;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EnhancedAuthorizedPersonCard = ({
  person,
  index,
  isExpanded,
  onToggle,
  onEdit,
  onDelete
}: EnhancedAuthorizedPersonCardProps) => {
  const { t } = useTranslation(['forms', 'steps']);

  return (
    <div className="mb-6 overflow-hidden border border-slate-200 rounded-lg shadow-sm bg-white">
      <div 
        onClick={onToggle}
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 ${
          isExpanded ? 'bg-slate-50 border-b border-slate-200' : ''
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
            person.firstName ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
          }`}>
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900">
              {person.firstName && person.lastName 
                ? `${person.firstName} ${person.lastName}`
                : `${t('forms:authorizedPersons.title')} ${index + 1}`
              }
            </h3>
            {person.email && (
              <p className="text-xs text-slate-500">{person.email}</p>
            )}
            {person.createdFromContact && (
              <p className="text-xs text-green-600">
                <User className="h-3 w-3 inline mr-1" />
                {t('forms:authorizedPersons.fromContact')}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-full transition-colors mr-2"
          >
            <FileText className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors mr-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="w-6 text-slate-400 transition-transform duration-200 transform">
            {isExpanded ? '▲' : '▼'}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 animate-fade-in">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                <User className="h-4 w-4" />
                {t('forms:authorizedPersons.sections.basicInfo.title')}
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.basicInfo.firstName')}:</span>
                  <span>{person.firstName} {person.lastName}</span>
                </div>
                {person.maidenName && (
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span className="font-medium">{t('forms:authorizedPersons.sections.basicInfo.maidenName')}:</span>
                    <span>{person.maidenName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.basicInfo.email')}:</span>
                  <span>{person.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.basicInfo.phone')}:</span>
                  <span>{person.phonePrefix} {person.phone}</span>
                </div>
              </div>
            </div>

            {/* Birth Information */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4" />
                {t('forms:authorizedPersons.sections.personalData.title')}
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.personalData.birthDate')}:</span>
                  <span>{person.birthDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.personalData.birthPlace')}:</span>
                  <span>{person.birthPlace}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.personalData.birthNumber')}:</span>
                  <span>{person.birthNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.additionalInfo.citizenship')}:</span>
                  <span>{person.citizenship}</span>
                </div>
              </div>
            </div>

            {/* Address and Position */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4" />
                {t('forms:address.street')} & {t('forms:authorizedPersons.sections.personalData.position')}
              </h4>
              
              <div className="grid md:grid-cols-1 gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.personalData.permanentAddress')}:</span>
                  <span>{person.permanentAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.personalData.position')}:</span>
                  <span>{person.position}</span>
                </div>
              </div>
            </div>

            {/* Document Information */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4" />
                {t('forms:authorizedPersons.sections.document.title')}
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.document.documentType')}:</span>
                  <span>{person.documentType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.document.documentNumber')}:</span>
                  <span>{person.documentNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.document.documentValidity')}:</span>
                  <span>{person.documentValidity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  <span className="font-medium">{t('forms:authorizedPersons.sections.document.documentIssuer')}:</span>
                  <span>{person.documentIssuer}</span>
                </div>
              </div>

              {/* Special Status Badges */}
              <div className="mt-4 flex gap-2">
                {person.isPoliticallyExposed && (
                  <Badge variant="destructive" className="text-xs">
                    {t('forms:authorizedPersons.sections.additionalInfo.isPoliticallyExposed')}
                  </Badge>
                )}
                {person.isUSCitizen && (
                  <Badge variant="secondary" className="text-xs">
                    {t('forms:authorizedPersons.sections.additionalInfo.isUSCitizen')}
                  </Badge>
                )}
                {person.createdFromContact && (
                  <Badge variant="outline" className="text-xs">
                    {t('forms:authorizedPersons.fromContact')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAuthorizedPersonCard;
