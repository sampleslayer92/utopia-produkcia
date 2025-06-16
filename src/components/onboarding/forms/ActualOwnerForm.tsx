
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ActualOwner } from "@/types/onboarding";

interface ActualOwnerFormProps {
  initialData?: Partial<ActualOwner>;
  onSave: (owner: Partial<ActualOwner>) => void;
  onCancel: () => void;
}

const ActualOwnerForm = ({ initialData = {}, onSave, onCancel }: ActualOwnerFormProps) => {
  const { t } = useTranslation(['forms']);
  
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    maidenName: initialData.maidenName || '',
    birthDate: initialData.birthDate || '',
    birthPlace: initialData.birthPlace || '',
    birthNumber: initialData.birthNumber || '',
    citizenship: initialData.citizenship || 'Slovensko',
    permanentAddress: initialData.permanentAddress || '',
    isPoliticallyExposed: initialData.isPoliticallyExposed || false,
    ...initialData
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isValid = formData.firstName && formData.lastName && formData.birthDate && formData.birthPlace && formData.birthNumber && formData.citizenship && formData.permanentAddress;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t('forms:actualOwners.sections.basicInfo.title')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">{t('forms:actualOwners.sections.basicInfo.firstName')}</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder={t('forms:actualOwners.sections.basicInfo.placeholders.firstName')}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">{t('forms:actualOwners.sections.basicInfo.lastName')}</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder={t('forms:actualOwners.sections.basicInfo.placeholders.lastName')}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="maidenName">{t('forms:actualOwners.sections.basicInfo.maidenName')}</Label>
          <Input
            id="maidenName"
            type="text"
            value={formData.maidenName}
            onChange={(e) => handleInputChange('maidenName', e.target.value)}
            placeholder={t('forms:actualOwners.sections.basicInfo.placeholders.maidenName')}
          />
        </div>
      </div>

      {/* Personal Data */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t('forms:actualOwners.sections.personalData.title')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="birthDate">{t('forms:actualOwners.sections.personalData.birthDate')}</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="birthPlace">{t('forms:actualOwners.sections.personalData.birthPlace')}</Label>
            <Input
              id="birthPlace"
              type="text"
              value={formData.birthPlace}
              onChange={(e) => handleInputChange('birthPlace', e.target.value)}
              placeholder={t('forms:actualOwners.sections.personalData.placeholders.birthPlace')}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="birthNumber">{t('forms:actualOwners.sections.personalData.birthNumber')}</Label>
            <Input
              id="birthNumber"
              type="text"
              value={formData.birthNumber}
              onChange={(e) => handleInputChange('birthNumber', e.target.value)}
              placeholder={t('forms:actualOwners.sections.personalData.placeholders.birthNumber')}
              required
            />
          </div>
          <div>
            <Label htmlFor="citizenship">{t('forms:actualOwners.sections.additionalInfo.citizenship')}</Label>
            <Input
              id="citizenship"
              type="text"
              value={formData.citizenship}
              onChange={(e) => handleInputChange('citizenship', e.target.value)}
              placeholder={t('forms:actualOwners.sections.additionalInfo.placeholders.citizenship')}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="permanentAddress">{t('forms:actualOwners.sections.personalData.permanentAddress')}</Label>
          <Input
            id="permanentAddress"
            type="text"
            value={formData.permanentAddress}
            onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
            placeholder={t('forms:actualOwners.sections.personalData.placeholders.permanentAddress')}
            required
          />
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t('forms:actualOwners.sections.additionalInfo.title')}</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPoliticallyExposed"
            checked={formData.isPoliticallyExposed}
            onCheckedChange={(checked) => handleInputChange('isPoliticallyExposed', checked as boolean)}
          />
          <Label htmlFor="isPoliticallyExposed">{t('forms:actualOwners.sections.additionalInfo.isPoliticallyExposed')}</Label>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {t('forms:actualOwners.sections.additionalInfo.descriptions.isPoliticallyExposed')}
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('forms:common.cancel')}
        </Button>
        <Button type="submit" disabled={!isValid}>
          {t('forms:common.save')}
        </Button>
      </div>
    </form>
  );
};

export default ActualOwnerForm;
