import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyInfo, RegistrationInfo } from "@/types/company";
import { useTranslation } from "react-i18next";

interface RegistrationFieldsDisplayProps {
  companyInfo: CompanyInfo;
  updateCompanyInfo: (field: string, value: any) => void;
  autoFilledFields: Set<string>;
  getFieldClassName: (field: string) => string;
  getFieldIndicator: (field: string) => React.ReactNode;
  isFieldEnabled: (fieldKey: string) => boolean;
}

export const RegistrationFieldsDisplay: React.FC<RegistrationFieldsDisplayProps> = ({
  companyInfo,
  updateCompanyInfo,
  autoFilledFields,
  getFieldClassName,
  getFieldIndicator,
  isFieldEnabled
}) => {
  const { t } = useTranslation();

  // Determine which fields to show based on company type
  const getRegistrationFields = () => {
    const registrationType = companyInfo.registrationInfo?.registrationType;
    
    switch (companyInfo.registryType) {
      case 'S.r.o.':
      case 'Akciová spoločnosť':
        return 'commercial_register';
      case 'Živnosť':
        return 'trade_license';
      case 'Nezisková organizácia':
        return 'nonprofit_register';
      default:
        // Fallback to registration type from ARES
        return registrationType || 'commercial_register';
    }
  };

  const fieldType = getRegistrationFields();

  const handleRegistrationInfoChange = (field: keyof RegistrationInfo, value: string) => {
    const currentRegistrationInfo = companyInfo.registrationInfo || {};
    const updatedRegistrationInfo = {
      ...currentRegistrationInfo,
      [field]: value
    };
    updateCompanyInfo('registrationInfo', updatedRegistrationInfo);
  };

  // Commercial Register fields (S.r.o., a.s.)
  if (fieldType === 'commercial_register') {
    return (
      <div className="space-y-4">
        <div className="text-sm font-medium text-muted-foreground">
          {t('company.commercialRegister', 'Obchodný register')}
        </div>
        
        {isFieldEnabled('court') && (
          <div className="space-y-2">
            <Label htmlFor="court" className="text-sm font-medium">
              {t('company.court', 'Súd')} {getFieldIndicator('court')}
            </Label>
            <Input
              id="court"
              value={companyInfo.registrationInfo?.court || companyInfo.court || ''}
              onChange={(e) => {
                // Update both new and legacy fields for compatibility
                handleRegistrationInfoChange('court', e.target.value);
                updateCompanyInfo('court', e.target.value);
              }}
              placeholder={t('company.courtPlaceholder', 'Napríklad: Okresný súd Bratislava I')}
              className={getFieldClassName('court')}
            />
          </div>
        )}

        {isFieldEnabled('section') && (
          <div className="space-y-2">
            <Label htmlFor="section" className="text-sm font-medium">
              {t('company.section', 'Oddiel')} {getFieldIndicator('section')}
            </Label>
            <Input
              id="section"
              value={companyInfo.registrationInfo?.section || companyInfo.section || ''}
              onChange={(e) => {
                handleRegistrationInfoChange('section', e.target.value);
                updateCompanyInfo('section', e.target.value);
              }}
              placeholder={t('company.sectionPlaceholder', 'Napríklad: Sro')}
              className={getFieldClassName('section')}
            />
          </div>
        )}

        {isFieldEnabled('insertNumber') && (
          <div className="space-y-2">
            <Label htmlFor="insertNumber" className="text-sm font-medium">
              {t('company.insertNumber', 'Vložka číslo')} {getFieldIndicator('insertNumber')}
            </Label>
            <Input
              id="insertNumber"
              value={companyInfo.registrationInfo?.insertNumber || companyInfo.insertNumber || ''}
              onChange={(e) => {
                handleRegistrationInfoChange('insertNumber', e.target.value);
                updateCompanyInfo('insertNumber', e.target.value);
              }}
              placeholder={t('company.insertNumberPlaceholder', 'Napríklad: 12345/B')}
              className={getFieldClassName('insertNumber')}
            />
          </div>
        )}
      </div>
    );
  }

  // Trade License fields (Živnostník)
  if (fieldType === 'trade_license') {
    return (
      <div className="space-y-4">
        <div className="text-sm font-medium text-muted-foreground">
          {t('company.tradeLicense', 'Živnostenské oprávnenie')}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tradeOffice" className="text-sm font-medium">
            {t('company.tradeOffice', 'Živnostenský úrad')} {getFieldIndicator('tradeOffice')}
          </Label>
          <Input
            id="tradeOffice"
            value={companyInfo.registrationInfo?.tradeOffice || ''}
            onChange={(e) => handleRegistrationInfoChange('tradeOffice', e.target.value)}
            placeholder={t('company.tradeOfficePlaceholder', 'Napríklad: Živnostenský úrad Bratislava')}
            className={getFieldClassName('tradeOffice')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tradeLicenseNumber" className="text-sm font-medium">
            {t('company.tradeLicenseNumber', 'Číslo živnostenského listu')} {getFieldIndicator('tradeLicenseNumber')}
          </Label>
          <Input
            id="tradeLicenseNumber"
            value={companyInfo.registrationInfo?.tradeLicenseNumber || ''}
            onChange={(e) => handleRegistrationInfoChange('tradeLicenseNumber', e.target.value)}
            placeholder={t('company.tradeLicenseNumberPlaceholder', 'Napríklad: ŽL-12345')}
            className={getFieldClassName('tradeLicenseNumber')}
          />
        </div>
      </div>
    );
  }

  // Nonprofit Register fields
  if (fieldType === 'nonprofit_register') {
    return (
      <div className="space-y-4">
        <div className="text-sm font-medium text-muted-foreground">
          {t('company.nonprofitRegister', 'Register neziskových organizácií')}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="registrationAuthority" className="text-sm font-medium">
            {t('company.registrationAuthority', 'Registrujúci orgán')} {getFieldIndicator('registrationAuthority')}
          </Label>
          <Input
            id="registrationAuthority"
            value={companyInfo.registrationInfo?.registrationAuthority || ''}
            onChange={(e) => handleRegistrationInfoChange('registrationAuthority', e.target.value)}
            placeholder={t('company.registrationAuthorityPlaceholder', 'Napríklad: Ministerstvo vnútra SR')}
            className={getFieldClassName('registrationAuthority')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registrationNumber" className="text-sm font-medium">
            {t('company.registrationNumber', 'Registračné číslo')} {getFieldIndicator('registrationNumber')}
          </Label>
          <Input
            id="registrationNumber"
            value={companyInfo.registrationInfo?.registrationNumber || ''}
            onChange={(e) => handleRegistrationInfoChange('registrationNumber', e.target.value)}
            placeholder={t('company.registrationNumberPlaceholder', 'Napríklad: VVS/1-900/90-12345')}
            className={getFieldClassName('registrationNumber')}
          />
        </div>
      </div>
    );
  }

  // Fallback - show legacy fields
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-muted-foreground">
        {t('company.registrationInfo', 'Registračné údaje')}
      </div>
      
      {isFieldEnabled('court') && (
        <div className="space-y-2">
          <Label htmlFor="court" className="text-sm font-medium">
            {t('company.court', 'Súd')} {getFieldIndicator('court')}
          </Label>
          <Input
            id="court"
            value={companyInfo.court || ''}
            onChange={(e) => updateCompanyInfo('court', e.target.value)}
            placeholder={t('company.courtPlaceholder', 'Napríklad: Okresný súd Bratislava I')}
            className={getFieldClassName('court')}
          />
        </div>
      )}
    </div>
  );
};