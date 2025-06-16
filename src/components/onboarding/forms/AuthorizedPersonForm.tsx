
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthorizedPerson } from "@/types/onboarding";

interface AuthorizedPersonFormProps {
  initialData?: Partial<AuthorizedPerson>;
  onSave: (person: Partial<AuthorizedPerson>) => void;
  onCancel: () => void;
}

const AuthorizedPersonForm = ({ initialData = {}, onSave, onCancel }: AuthorizedPersonFormProps) => {
  const { t } = useTranslation(['forms']);
  
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    phonePrefix: initialData.phonePrefix || '+421',
    maidenName: initialData.maidenName || '',
    birthDate: initialData.birthDate || '',
    birthPlace: initialData.birthPlace || '',
    birthNumber: initialData.birthNumber || '',
    permanentAddress: initialData.permanentAddress || '',
    position: initialData.position || '',
    documentType: initialData.documentType || 'OP' as 'OP' | 'Pas',
    documentNumber: initialData.documentNumber || '',
    documentValidity: initialData.documentValidity || '',
    documentIssuer: initialData.documentIssuer || '',
    documentCountry: initialData.documentCountry || 'Slovensko',
    citizenship: initialData.citizenship || 'Slovensko',
    isPoliticallyExposed: initialData.isPoliticallyExposed || false,
    isUSCitizen: initialData.isUSCitizen || false,
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

  const isValid = formData.firstName && formData.lastName && formData.email && formData.birthDate && formData.birthPlace && formData.birthNumber && formData.permanentAddress && formData.position;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t('forms:authorizedPersons.sections.basicInfo.title')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">{t('forms:authorizedPersons.sections.basicInfo.firstName')}</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder={t('forms:authorizedPersons.sections.basicInfo.placeholders.firstName')}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">{t('forms:authorizedPersons.sections.basicInfo.lastName')}</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder={t('forms:authorizedPersons.sections.basicInfo.placeholders.lastName')}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="email">{t('forms:authorizedPersons.sections.basicInfo.email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={t('forms:authorizedPersons.sections.basicInfo.placeholders.email')}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">{t('forms:authorizedPersons.sections.basicInfo.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={t('forms:authorizedPersons.sections.basicInfo.placeholders.phone')}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="maidenName">{t('forms:authorizedPersons.sections.basicInfo.maidenName')}</Label>
          <Input
            id="maidenName"
            type="text"
            value={formData.maidenName}
            onChange={(e) => handleInputChange('maidenName', e.target.value)}
            placeholder={t('forms:authorizedPersons.sections.basicInfo.placeholders.maidenName')}
          />
        </div>
      </div>

      {/* Personal Data */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t('forms:authorizedPersons.sections.personalData.title')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="birthDate">{t('forms:authorizedPersons.sections.personalData.birthDate')}</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="birthPlace">{t('forms:authorizedPersons.sections.personalData.birthPlace')}</Label>
            <Input
              id="birthPlace"
              type="text"
              value={formData.birthPlace}
              onChange={(e) => handleInputChange('birthPlace', e.target.value)}
              placeholder={t('forms:authorizedPersons.sections.personalData.placeholders.birthPlace')}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="birthNumber">{t('forms:authorizedPersons.sections.personalData.birthNumber')}</Label>
            <Input
              id="birthNumber"
              type="text"
              value={formData.birthNumber}
              onChange={(e) => handleInputChange('birthNumber', e.target.value)}
              placeholder={t('forms:authorizedPersons.sections.personalData.placeholders.birthNumber')}
              required
            />
          </div>
          <div>
            <Label htmlFor="position">{t('forms:authorizedPersons.sections.personalData.position')}</Label>
            <Input
              id="position"
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              placeholder={t('forms:authorizedPersons.sections.personalData.placeholders.position')}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="permanentAddress">{t('forms:authorizedPersons.sections.personalData.permanentAddress')}</Label>
          <Input
            id="permanentAddress"
            type="text"
            value={formData.permanentAddress}
            onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
            placeholder={t('forms:authorizedPersons.sections.personalData.placeholders.permanentAddress')}
            required
          />
        </div>
      </div>

      {/* Document Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t('forms:authorizedPersons.sections.document.title')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="documentType">{t('forms:authorizedPersons.sections.document.documentType')}</Label>
            <Select value={formData.documentType} onValueChange={(value) => handleInputChange('documentType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte typ dokladu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OP">{t('forms:authorizedPersons.sections.document.documentTypeOptions.OP')}</SelectItem>
                <SelectItem value="Pas">{t('forms:authorizedPersons.sections.document.documentTypeOptions.Pas')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="documentNumber">{t('forms:authorizedPersons.sections.document.documentNumber')}</Label>
            <Input
              id="documentNumber"
              type="text"
              value={formData.documentNumber}
              onChange={(e) => handleInputChange('documentNumber', e.target.value)}
              placeholder={t('forms:authorizedPersons.sections.document.placeholders.documentNumber')}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="documentValidity">{t('forms:authorizedPersons.sections.document.documentValidity')}</Label>
            <Input
              id="documentValidity"
              type="date"
              value={formData.documentValidity}
              onChange={(e) => handleInputChange('documentValidity', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="documentIssuer">{t('forms:authorizedPersons.sections.document.documentIssuer')}</Label>
            <Input
              id="documentIssuer"
              type="text"
              value={formData.documentIssuer}
              onChange={(e) => handleInputChange('documentIssuer', e.target.value)}
              placeholder={t('forms:authorizedPersons.sections.document.placeholders.documentIssuer')}
              required
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t('forms:authorizedPersons.sections.additionalInfo.title')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="citizenship">{t('forms:authorizedPersons.sections.additionalInfo.citizenship')}</Label>
            <Input
              id="citizenship"
              type="text"
              value={formData.citizenship}
              onChange={(e) => handleInputChange('citizenship', e.target.value)}
              placeholder={t('forms:authorizedPersons.sections.additionalInfo.placeholders.citizenship')}
              required
            />
          </div>
          <div>
            <Label htmlFor="documentCountry">{t('forms:authorizedPersons.sections.document.documentCountry')}</Label>
            <Input
              id="documentCountry"
              type="text"
              value={formData.documentCountry}
              onChange={(e) => handleInputChange('documentCountry', e.target.value)}
              placeholder={t('forms:authorizedPersons.sections.document.placeholders.documentCountry')}
              required
            />
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPoliticallyExposed"
              checked={formData.isPoliticallyExposed}
              onCheckedChange={(checked) => handleInputChange('isPoliticallyExposed', checked as boolean)}
            />
            <Label htmlFor="isPoliticallyExposed">{t('forms:authorizedPersons.sections.additionalInfo.isPoliticallyExposed')}</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isUSCitizen"
              checked={formData.isUSCitizen}
              onCheckedChange={(checked) => handleInputChange('isUSCitizen', checked as boolean)}
            />
            <Label htmlFor="isUSCitizen">{t('forms:authorizedPersons.sections.additionalInfo.isUSCitizen')}</Label>
          </div>
        </div>
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

export default AuthorizedPersonForm;
