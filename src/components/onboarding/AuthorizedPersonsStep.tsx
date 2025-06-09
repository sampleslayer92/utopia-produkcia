
import { useState } from "react";
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Trash2, User, FileText, Calendar, MapPin, Phone, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import OnboardingInput from "./ui/OnboardingInput";
import PhoneNumberInput from "./ui/PhoneNumberInput";
import { Badge } from "@/components/ui/badge";
import DocumentUpload from "./ui/DocumentUpload";
import AddressForm from "./ui/AddressForm";
import MobileOptimizedCard from "./ui/MobileOptimizedCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface AuthorizedPersonsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AuthorizedPersonsStep = ({ data, updateData }: AuthorizedPersonsStepProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [expandedPersons, setExpandedPersons] = useState<Set<number>>(new Set());

  const authorizedPersons = data.authorizedPersons || [];

  const addPerson = () => {
    const newPerson = {
      id: Date.now(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      phonePrefix: '+421',
      birthDate: '',
      birthPlace: '',
      idNumber: '',
      address: {
        street: '',
        city: '',
        zipCode: ''
      },
      authorizations: [],
      documents: [],
      signature: '',
      isSameAsContact: false
    };

    updateData({
      authorizedPersons: [...authorizedPersons, newPerson]
    });

    setExpandedPersons(prev => new Set([...prev, authorizedPersons.length]));
  };

  const removePerson = (index: number) => {
    const updatedPersons = authorizedPersons.filter((_, i) => i !== index);
    updateData({
      authorizedPersons: updatedPersons
    });
    
    setExpandedPersons(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      const adjustedSet = new Set();
      newSet.forEach(i => {
        if (i < index) adjustedSet.add(i);
        else if (i > index) adjustedSet.add(i - 1);
      });
      return adjustedSet;
    });
  };

  const updatePerson = (index: number, field: string, value: any) => {
    const updatedPersons = [...authorizedPersons];
    const keys = field.split('.');
    
    if (keys.length === 1) {
      updatedPersons[index] = {
        ...updatedPersons[index],
        [field]: value
      };
    } else if (keys.length === 2) {
      updatedPersons[index] = {
        ...updatedPersons[index],
        [keys[0]]: {
          ...updatedPersons[index][keys[0] as keyof typeof updatedPersons[index]],
          [keys[1]]: value
        }
      };
    }

    updateData({
      authorizedPersons: updatedPersons
    });
  };

  const toggleExpanded = (index: number) => {
    setExpandedPersons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const fillFromContactPerson = (index: number) => {
    const contactInfo = data.contactInfo;
    updatePerson(index, 'firstName', contactInfo.firstName);
    updatePerson(index, 'lastName', contactInfo.lastName);
    updatePerson(index, 'email', contactInfo.email);
    updatePerson(index, 'phone', contactInfo.phone);
    updatePerson(index, 'phonePrefix', contactInfo.phonePrefix || '+421');
    updatePerson(index, 'isSameAsContact', true);
  };

  const infoTooltipData = {
    description: t('onboarding.authorizedPersons.title'),
    features: [
      t('onboarding.authorizedPersons.personalData'),
      t('onboarding.authorizedPersons.address'),
      t('onboarding.authorizedPersons.authorizations'),
      t('onboarding.authorizedPersons.signature')
    ]
  };

  if (isMobile) {
    return (
      <MobileOptimizedCard
        title={t('onboarding.steps.authorizedPersons.title')}
        icon={<Users className="h-4 w-4 text-blue-600" />}
        infoTooltip={infoTooltipData}
      >
        <div className="space-y-6">
          {authorizedPersons.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                {t('onboarding.authorizedPersons.emptyState.title')}
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                {t('onboarding.authorizedPersons.emptyState.description')}
              </p>
              <Button onClick={addPerson} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('onboarding.authorizedPersons.addPerson')}
              </Button>
            </div>
          ) : (
            <>
              {authorizedPersons.map((person, index) => (
                <AuthorizedPersonCard
                  key={person.id || index}
                  person={person}
                  index={index}
                  isExpanded={expandedPersons.has(index)}
                  onToggleExpanded={toggleExpanded}
                  onUpdate={updatePerson}
                  onRemove={removePerson}
                  onFillFromContact={fillFromContactPerson}
                  t={t}
                />
              ))}
              
              <Button onClick={addPerson} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t('onboarding.authorizedPersons.addPerson')}
              </Button>
            </>
          )}
        </div>
      </MobileOptimizedCard>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                {t('onboarding.steps.authorizedPersons.title')}
              </h2>
              <p className="text-slate-600 mt-1">
                {t('onboarding.steps.authorizedPersons.subtitle')}
              </p>
            </div>
          </div>
          
          {authorizedPersons.length > 0 && (
            <Button onClick={addPerson} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              {t('onboarding.authorizedPersons.addPerson')}
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {authorizedPersons.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                {t('onboarding.authorizedPersons.emptyState.title')}
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                {t('onboarding.authorizedPersons.emptyState.description')}
              </p>
              <Button onClick={addPerson} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('onboarding.authorizedPersons.addPerson')}
              </Button>
            </div>
          ) : (
            authorizedPersons.map((person, index) => (
              <AuthorizedPersonCard
                key={person.id || index}
                person={person}
                index={index}
                isExpanded={expandedPersons.has(index)}
                onToggleExpanded={toggleExpanded}
                onUpdate={updatePerson}
                onRemove={removePerson}
                onFillFromContact={fillFromContactPerson}
                t={t}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Authorized Person Card Component
const AuthorizedPersonCard = ({ 
  person, 
  index, 
  isExpanded, 
  onToggleExpanded, 
  onUpdate, 
  onRemove, 
  onFillFromContact,
  t 
}: any) => {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-slate-900">
              {t('onboarding.authorizedPersons.person')} {index + 1}
              {person.firstName && person.lastName && (
                <span className="text-slate-600 ml-2">
                  - {person.firstName} {person.lastName}
                </span>
              )}
            </h3>
            {person.isSameAsContact && (
              <Badge variant="secondary" className="text-xs">
                {t('onboarding.authorizedPersons.sameAsContact')}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFillFromContact(index)}
              className="text-xs"
            >
              {t('onboarding.authorizedPersons.sameAsContact')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleExpanded(index)}
            >
              {isExpanded ? t('common.collapse') : t('common.expand')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-6">
            {/* Personal Data */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('onboarding.authorizedPersons.personalData')}
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <OnboardingInput
                  label={t('onboarding.contactInfo.firstName')}
                  value={person.firstName}
                  onChange={(e) => onUpdate(index, 'firstName', e.target.value)}
                  placeholder={t('onboarding.contactInfo.firstName')}
                />
                <OnboardingInput
                  label={t('onboarding.contactInfo.lastName')}
                  value={person.lastName}
                  onChange={(e) => onUpdate(index, 'lastName', e.target.value)}
                  placeholder={t('onboarding.contactInfo.lastName')}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <OnboardingInput
                  label={t('onboarding.contactInfo.email')}
                  type="email"
                  value={person.email}
                  onChange={(e) => onUpdate(index, 'email', e.target.value)}
                  placeholder={t('onboarding.contactInfo.email')}
                />
                <PhoneNumberInput
                  phoneValue={person.phone}
                  prefixValue={person.phonePrefix}
                  onPhoneChange={(value) => onUpdate(index, 'phone', value)}
                  onPrefixChange={(value) => onUpdate(index, 'phonePrefix', value)}
                  required={true}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <OnboardingInput
                  label={t('onboarding.authorizedPersons.birthDate')}
                  type="date"
                  value={person.birthDate}
                  onChange={(e) => onUpdate(index, 'birthDate', e.target.value)}
                />
                <OnboardingInput
                  label={t('onboarding.authorizedPersons.birthPlace')}
                  value={person.birthPlace}
                  onChange={(e) => onUpdate(index, 'birthPlace', e.target.value)}
                  placeholder={t('onboarding.actualOwners.placeholders.birthPlace')}
                />
              </div>

              <OnboardingInput
                label={t('onboarding.authorizedPersons.idNumber')}
                value={person.idNumber}
                onChange={(e) => onUpdate(index, 'idNumber', e.target.value)}
                placeholder="123456789"
              />
            </div>

            {/* Address */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('onboarding.authorizedPersons.address')}
              </h4>
              <AddressForm
                address={person.address}
                onAddressChange={(field, value) => onUpdate(index, `address.${field}`, value)}
              />
            </div>

            {/* Document Upload */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('onboarding.validation.required')}
              </h4>
              <DocumentUpload
                documents={person.documents || []}
                onDocumentsChange={(docs) => onUpdate(index, 'documents', docs)}
                acceptedTypes={['.jpg', '.jpeg', '.png', '.pdf']}
                maxFiles={3}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthorizedPersonsStep;
