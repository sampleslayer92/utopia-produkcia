import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Users, UserPlus, UserCheck, FileText, Fingerprint, Flag, AlertTriangle } from "lucide-react";
import { OnboardingData, AuthorizedPerson } from "@/types/onboarding";
import OnboardingInput from "./ui/OnboardingInput";
import OnboardingSelect from "./ui/OnboardingSelect";
import OnboardingSection from "./ui/OnboardingSection";
import DocumentUpload from "./ui/DocumentUpload";
import AutoFillSuggestions from "./ui/AutoFillSuggestions";
import PhoneNumberInput from "./ui/PhoneNumberInput";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface AuthorizedPersonsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AuthorizedPersonsStep = ({ data, updateData }: AuthorizedPersonsStepProps) => {
  const { t } = useTranslation();
  const [expandedPersonId, setExpandedPersonId] = useState<string | null>(null);

  const addAuthorizedPerson = () => {
    const newPerson: AuthorizedPerson = {
      id: Date.now().toString(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      phonePrefix: '+421',
      maidenName: '',
      birthDate: '',
      birthPlace: '',
      birthNumber: '',
      permanentAddress: '',
      position: '',
      documentType: 'OP',
      documentNumber: '',
      documentValidity: '',
      documentIssuer: '',
      documentCountry: t('forms.authorizedPersons.sections.document.placeholders.documentCountry'),
      citizenship: t('forms.authorizedPersons.sections.additionalInfo.placeholders.citizenship'),
      isPoliticallyExposed: false,
      isUSCitizen: false,
      documentFrontUrl: '',
      documentBackUrl: ''
    };

    updateData({
      authorizedPersons: [...data.authorizedPersons, newPerson]
    });
    
    setExpandedPersonId(newPerson.id);
  };

  const removeAuthorizedPerson = (id: string) => {
    updateData({
      authorizedPersons: data.authorizedPersons.filter(person => person.id !== id)
    });
    if (expandedPersonId === id) {
      setExpandedPersonId(null);
    }
  };

  const updateAuthorizedPerson = (id: string, field: string, value: any) => {
    updateData({
      authorizedPersons: data.authorizedPersons.map(person =>
        person.id === id ? { ...person, [field]: value } : person
      )
    });
  };

  const togglePerson = (id: string) => {
    setExpandedPersonId(expandedPersonId === id ? null : id);
  };

  const documentTypeOptions = [
    { value: "OP", label: t('forms.authorizedPersons.sections.document.documentTypeOptions.OP') },
    { value: "Pas", label: t('forms.authorizedPersons.sections.document.documentTypeOptions.Pas') }
  ];

  // Get the items array with proper fallback
  const importantInfoItems = (() => {
    try {
      const items = t('forms.authorizedPersons.sidebar.importantInfo.items', { returnObjects: true });
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error('Translation error for importantInfo items:', error);
      return [];
    }
  })();

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left sidebar */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900">{t('forms.authorizedPersons.sidebar.title')}</h3>
              </div>
              
              <p className="text-sm text-blue-800">
                {t('forms.authorizedPersons.sidebar.description')}
              </p>
              
              <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                <p className="font-medium mb-2">{t('forms.authorizedPersons.sidebar.importantInfo.title')}</p>
                <ul className="space-y-2 list-disc list-inside">
                  {importantInfoItems.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4">
                <Button
                  onClick={addAuthorizedPerson}
                  variant="outline"
                  className="w-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  {t('forms.authorizedPersons.sidebar.addButton')}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              {/* Auto-fill suggestions */}
              <AutoFillSuggestions 
                data={data} 
                updateData={updateData} 
                currentStep={5} 
              />

              {data.authorizedPersons.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">{t('forms.authorizedPersons.emptyState.title')}</h3>
                  <p className="text-sm text-slate-500 mb-6">{t('forms.authorizedPersons.emptyState.description')}</p>
                  <Button 
                    onClick={addAuthorizedPerson}
                    variant="outline" 
                    className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t('forms.authorizedPersons.emptyState.addButton')}
                  </Button>
                </div>
              )}

              {data.authorizedPersons.map((person, index) => (
                <div key={person.id} className="mb-6 overflow-hidden border border-slate-200 rounded-lg shadow-sm bg-white">
                  <div 
                    onClick={() => togglePerson(person.id)}
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 ${
                      expandedPersonId === person.id ? 'bg-slate-50 border-b border-slate-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        person.firstName && person.lastName ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {person.firstName && person.lastName ? (
                          <UserCheck className="h-5 w-5" />
                        ) : (
                          <UserPlus className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {person.firstName && person.lastName 
                            ? `${person.firstName} ${person.lastName}`
                            : t('forms.authorizedPersons.personTitle', { index: index + 1 })}
                        </h3>
                        {person.position && (
                          <p className="text-xs text-slate-500">{person.position}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAuthorizedPerson(person.id);
                        }}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors mr-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="w-6 text-slate-400 transition-transform duration-200 transform">
                        {expandedPersonId === person.id ? '▲' : '▼'}
                      </div>
                    </div>
                  </div>

                  {expandedPersonId === person.id && (
                    <div className="p-4 animate-fade-in">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <UserCheck className="h-4 w-4" />
                            {t('forms.authorizedPersons.sections.basicInfo.title')}
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <OnboardingInput
                              label={t('forms.authorizedPersons.sections.basicInfo.firstName')}
                              value={person.firstName}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'firstName', e.target.value)}
                              placeholder={t('forms.authorizedPersons.sections.basicInfo.placeholders.firstName')}
                            />

                            <OnboardingInput
                              label={t('forms.authorizedPersons.sections.basicInfo.lastName')}
                              value={person.lastName}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'lastName', e.target.value)}
                              placeholder={t('forms.authorizedPersons.sections.basicInfo.placeholders.lastName')}
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <OnboardingInput
                              label={t('forms.authorizedPersons.sections.basicInfo.email')}
                              type="email"
                              value={person.email}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'email', e.target.value)}
                              placeholder={t('forms.authorizedPersons.sections.basicInfo.placeholders.email')}
                            />

                            <PhoneNumberInput
                              label={t('forms.authorizedPersons.sections.basicInfo.phone')}
                              phoneValue={person.phone}
                              prefixValue={person.phonePrefix || '+421'}
                              onPhoneChange={(value) => updateAuthorizedPerson(person.id, 'phone', value)}
                              onPrefixChange={(value) => updateAuthorizedPerson(person.id, 'phonePrefix', value)}
                              placeholder={t('forms.authorizedPersons.sections.basicInfo.placeholders.phone')}
                              required
                            />
                          </div>

                          <OnboardingInput
                            label={t('forms.authorizedPersons.sections.basicInfo.maidenName')}
                            value={person.maidenName}
                            onChange={(e) => updateAuthorizedPerson(person.id, 'maidenName', e.target.value)}
                            placeholder={t('forms.authorizedPersons.sections.basicInfo.placeholders.maidenName')}
                            className="mt-4"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <Fingerprint className="h-4 w-4" />
                            {t('forms.authorizedPersons.sections.personalData.title')}
                          </h4>

                          <div className="grid md:grid-cols-2 gap-4">
                            <OnboardingInput
                              label={t('forms.authorizedPersons.sections.personalData.birthDate')}
                              type="date"
                              value={person.birthDate}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'birthDate', e.target.value)}
                            />

                            <OnboardingInput
                              label={t('forms.authorizedPersons.sections.personalData.birthPlace')}
                              value={person.birthPlace}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'birthPlace', e.target.value)}
                              placeholder={t('forms.authorizedPersons.sections.personalData.placeholders.birthPlace')}
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <OnboardingInput
                              label={t('forms.authorizedPersons.sections.personalData.birthNumber')}
                              value={person.birthNumber}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'birthNumber', e.target.value)}
                              placeholder={t('forms.authorizedPersons.sections.personalData.placeholders.birthNumber')}
                            />

                            <OnboardingInput
                              label={t('forms.authorizedPersons.sections.personalData.position')}
                              value={person.position}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'position', e.target.value)}
                              placeholder={t('forms.authorizedPersons.sections.personalData.placeholders.position')}
                            />
                          </div>

                          <OnboardingInput
                            label={t('forms.authorizedPersons.sections.personalData.permanentAddress')}
                            value={person.permanentAddress}
                            onChange={(e) => updateAuthorizedPerson(person.id, 'permanentAddress', e.target.value)}
                            placeholder={t('forms.authorizedPersons.sections.personalData.placeholders.permanentAddress')}
                            className="mt-4"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <FileText className="h-4 w-4" />
                            {t('forms.authorizedPersons.sections.document.title')}
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <OnboardingSelect
                              label={t('forms.authorizedPersons.sections.document.documentType')}
                              value={person.documentType}
                              onValueChange={(value) => updateAuthorizedPerson(person.id, 'documentType', value)}
                              options={documentTypeOptions}
                            />

                            <OnboardingInput
                              label={t('forms.authorizedPersons.sections.document.documentNumber')}
                              value={person.documentNumber}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'documentNumber', e.target.value)}
                              placeholder={t('forms.authorizedPersons.sections.document.placeholders.documentNumber')}
                            />
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <OnboardingInput
                              label={t('forms.authorizedPersons.sections.document.documentValidity')}
                              type="date"
                              value={person.documentValidity}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'documentValidity', e.target.value)}
                            />

                            <OnboardingInput
                              label={t('forms.authorizedPersons.sections.document.documentIssuer')}
                              value={person.documentIssuer}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'documentIssuer', e.target.value)}
                              placeholder={t('forms.authorizedPersons.sections.document.placeholders.documentIssuer')}
                            />

                            <OnboardingInput
                              label={t('forms.authorizedPersons.sections.document.documentCountry')}
                              value={person.documentCountry}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'documentCountry', e.target.value)}
                              placeholder={t('forms.authorizedPersons.sections.document.placeholders.documentCountry')}
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <DocumentUpload
                              label={t('forms.authorizedPersons.sections.document.documentFront')}
                              value={person.documentFrontUrl}
                              onChange={(url) => updateAuthorizedPerson(person.id, 'documentFrontUrl', url)}
                              personId={person.id}
                              documentSide="front"
                            />

                            <DocumentUpload
                              label={t('forms.authorizedPersons.sections.document.documentBack')}
                              value={person.documentBackUrl}
                              onChange={(url) => updateAuthorizedPerson(person.id, 'documentBackUrl', url)}
                              personId={person.id}
                              documentSide="back"
                            />
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <Flag className="h-4 w-4" />
                            {t('forms.authorizedPersons.sections.additionalInfo.title')}
                          </h4>

                          <OnboardingInput
                            label={t('forms.authorizedPersons.sections.additionalInfo.citizenship')}
                            value={person.citizenship}
                            onChange={(e) => updateAuthorizedPerson(person.id, 'citizenship', e.target.value)}
                            placeholder={t('forms.authorizedPersons.sections.additionalInfo.placeholders.citizenship')}
                          />

                          <div className="mt-4 space-y-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`isPoliticallyExposed-${person.id}`}
                                checked={person.isPoliticallyExposed}
                                onCheckedChange={(checked) => updateAuthorizedPerson(person.id, 'isPoliticallyExposed', checked)}
                              />
                              <div>
                                <label htmlFor={`isPoliticallyExposed-${person.id}`} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                  {t('forms.authorizedPersons.sections.additionalInfo.isPoliticallyExposed')}
                                  {person.isPoliticallyExposed && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                                </label>
                                {person.isPoliticallyExposed && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    {t('forms.authorizedPersons.sections.additionalInfo.descriptions.isPoliticallyExposed')}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`isUSCitizen-${person.id}`}
                                checked={person.isUSCitizen}
                                onCheckedChange={(checked) => updateAuthorizedPerson(person.id, 'isUSCitizen', checked)}
                              />
                              <div>
                                <label htmlFor={`isUSCitizen-${person.id}`} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                  {t('forms.authorizedPersons.sections.additionalInfo.isUSCitizen')}
                                  {person.isUSCitizen && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                                </label>
                                {person.isUSCitizen && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    {t('forms.authorizedPersons.sections.additionalInfo.descriptions.isUSCitizen')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {data.authorizedPersons.length > 0 && (
                <Button
                  onClick={addAuthorizedPerson}
                  variant="outline"
                  className="w-full border-dashed border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('forms.authorizedPersons.buttons.addPerson')}
                </Button>
              )}
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorizedPersonsStep;
