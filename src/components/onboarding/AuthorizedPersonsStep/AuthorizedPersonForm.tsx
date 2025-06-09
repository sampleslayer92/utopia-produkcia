
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Check, X, User } from "lucide-react";
import { AuthorizedPerson } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingTextarea from "../ui/OnboardingTextarea";
import PhoneNumberInput from "../ui/PhoneNumberInput";

interface AuthorizedPersonFormProps {
  person: AuthorizedPerson;
  personNumber: number;
  isEditing: boolean;
  onUpdate: (person: AuthorizedPerson) => void;
  onRemove: () => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
}

const AuthorizedPersonForm = ({
  person,
  personNumber,
  isEditing,
  onUpdate,
  onRemove,
  onStartEdit,
  onStopEdit
}: AuthorizedPersonFormProps) => {
  const { t } = useTranslation();
  const [localPerson, setLocalPerson] = useState(person);

  const handleFieldChange = (field: keyof AuthorizedPerson, value: string) => {
    const updatedPerson = { ...localPerson, [field]: value };
    setLocalPerson(updatedPerson);
    onUpdate(updatedPerson);
  };

  const handleSave = () => {
    onUpdate(localPerson);
    onStopEdit();
  };

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="relative pb-3">
        <div className="absolute top-4 right-4 flex gap-2">
          {isEditing ? (
            <Button
              variant="outline"
              size="icon"
              onClick={handleSave}
              className="h-8 w-8 hover:bg-green-50 hover:border-green-300"
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={onStartEdit}
              className="h-8 w-8 hover:bg-blue-50 hover:border-blue-300"
            >
              <Edit2 className="h-4 w-4 text-blue-500" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 hover:bg-red-50 hover:border-red-300"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
        
        <CardTitle className="text-lg text-slate-900 flex items-center gap-3 pr-20">
          <User className="h-5 w-5 text-blue-600" />
          {t('steps.authorizedPersons.form.personNumber', { number: personNumber })}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="font-medium text-slate-900 mb-4">{t('steps.authorizedPersons.form.basicInfo')}</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <OnboardingInput
              label={`${t('steps.authorizedPersons.form.firstName')} *`}
              value={localPerson.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              placeholder={t('steps.authorizedPersons.form.firstNamePlaceholder')}
              disabled={!isEditing}
            />
            <OnboardingInput
              label={`${t('steps.authorizedPersons.form.lastName')} *`}
              value={localPerson.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              placeholder={t('steps.authorizedPersons.form.lastNamePlaceholder')}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="font-medium text-slate-900 mb-4">{t('steps.authorizedPersons.form.personalInfo')}</h4>
          <div className="space-y-4">
            <OnboardingInput
              label={`${t('steps.authorizedPersons.form.email')} *`}
              type="email"
              value={localPerson.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder={t('steps.authorizedPersons.form.emailPlaceholder')}
              disabled={!isEditing}
            />
            
            <PhoneNumberInput
              value={localPerson.phone}
              onChange={(value) => handleFieldChange('phone', value)}
              prefix="+421"
              onPrefixChange={() => {}}
              disabled={!isEditing}
              label={`${t('steps.authorizedPersons.form.phone')} *`}
              placeholder={t('steps.authorizedPersons.form.phonePlaceholder')}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h4 className="font-medium text-slate-900 mb-4">{t('steps.authorizedPersons.form.additionalInfo')}</h4>
          <div className="space-y-4">
            <OnboardingInput
              label={t('steps.authorizedPersons.form.position')}
              value={localPerson.position}
              onChange={(e) => handleFieldChange('position', e.target.value)}
              placeholder={t('steps.authorizedPersons.form.positionPlaceholder')}
              disabled={!isEditing}
            />
            
            <OnboardingTextarea
              label={t('steps.authorizedPersons.form.authorizationScope')}
              value={localPerson.authorizationScope}
              onChange={(e) => handleFieldChange('authorizationScope', e.target.value)}
              placeholder={t('steps.authorizedPersons.form.authorizationScopePlaceholder')}
              disabled={!isEditing}
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorizedPersonForm;
