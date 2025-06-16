
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    position: initialData.position || '',
    ...initialData
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isValid = formData.firstName && formData.lastName && formData.email;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">{t('forms:authorizedPersons.firstName')}</Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">{t('forms:authorizedPersons.lastName')}</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">{t('forms:authorizedPersons.email')}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">{t('forms:authorizedPersons.phone')}</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="position">{t('forms:authorizedPersons.position')}</Label>
        <Input
          id="position"
          type="text"
          value={formData.position}
          onChange={(e) => handleInputChange('position', e.target.value)}
        />
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
