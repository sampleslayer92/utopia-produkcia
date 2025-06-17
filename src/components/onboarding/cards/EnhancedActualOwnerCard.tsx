
import { useState } from "react";
import { UserCheck, Trash2, Calendar, MapPin, FileText, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { ActualOwner } from "@/types/onboarding";

interface EnhancedActualOwnerCardProps {
  owner: ActualOwner;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EnhancedActualOwnerCard = ({
  owner,
  index,
  isExpanded,
  onToggle,
  onEdit,
  onDelete
}: EnhancedActualOwnerCardProps) => {
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
            owner.firstName ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
          }`}>
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900">
              {owner.firstName && owner.lastName 
                ? `${owner.firstName} ${owner.lastName}`
                : `${t('forms:actualOwners.title')} ${index + 1}`
              }
            </h3>
            {owner.birthDate && (
              <p className="text-xs text-slate-500">
                {t('forms:actualOwners.bornLabel', { date: owner.birthDate })}
              </p>
            )}
            {owner.createdFromContact && (
              <p className="text-xs text-green-600">
                <UserCheck className="h-3 w-3 inline mr-1" />
                {t('forms:actualOwners.fromContact')}
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
              <h4 className="text-sm font-medium text-green-700 flex items-center gap-2 mb-4">
                <UserCheck className="h-4 w-4" />
                {t('forms:actualOwners.sections.basicInfo.title')}
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-3 w-3" />
                  <span className="font-medium">{t('forms:actualOwners.sections.basicInfo.firstName')}:</span>
                  <span>{owner.firstName} {owner.lastName}</span>
                </div>
                {owner.maidenName && (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-3 w-3" />
                    <span className="font-medium">{t('forms:actualOwners.sections.basicInfo.maidenName')}:</span>
                    <span>{owner.maidenName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  <span className="font-medium">{t('forms:actualOwners.sections.additionalInfo.citizenship')}:</span>
                  <span>{owner.citizenship}</span>
                </div>
              </div>
            </div>

            {/* Birth Information */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-sm font-medium text-green-700 flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4" />
                {t('forms:actualOwners.sections.personalData.title')}
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">{t('forms:actualOwners.sections.personalData.birthDate')}:</span>
                  <span>{owner.birthDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span className="font-medium">{t('forms:actualOwners.sections.personalData.birthPlace')}:</span>
                  <span>{owner.birthPlace}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  <span className="font-medium">{t('forms:actualOwners.sections.personalData.birthNumber')}:</span>
                  <span>{owner.birthNumber}</span>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-sm font-medium text-green-700 flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4" />
                {t('forms:address.street')}
              </h4>
              
              <div className="grid md:grid-cols-1 gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span className="font-medium">{t('forms:actualOwners.sections.personalData.permanentAddress')}:</span>
                  <span>{owner.permanentAddress}</span>
                </div>
              </div>
            </div>

            {/* Special Status */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-sm font-medium text-green-700 flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4" />
                {t('forms:actualOwners.sections.additionalInfo.title')}
              </h4>
              
              <div className="flex gap-2">
                {owner.isPoliticallyExposed && (
                  <Badge variant="destructive" className="text-xs">
                    {t('forms:actualOwners.sections.additionalInfo.isPoliticallyExposed')}
                  </Badge>
                )}
                {owner.createdFromContact && (
                  <Badge variant="outline" className="text-xs">
                    {t('forms:actualOwners.fromContact')}
                  </Badge>
                )}
                {!owner.isPoliticallyExposed && (
                  <Badge variant="secondary" className="text-xs">
                    Nie je politicky exponovaná osoba
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

export default EnhancedActualOwnerCard;
