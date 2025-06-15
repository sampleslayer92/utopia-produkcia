
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Users2, UserPlus, Fingerprint, Flag, AlertTriangle } from "lucide-react";
import { OnboardingData, ActualOwner } from "@/types/onboarding";
import OnboardingInput from "./ui/OnboardingInput";
import OnboardingSection from "./ui/OnboardingSection";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ActualOwnersStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ActualOwnersStep = ({ data, updateData }: ActualOwnersStepProps) => {
  const { t } = useTranslation();
  const [expandedOwnerId, setExpandedOwnerId] = useState<string | null>(null);

  const addActualOwner = () => {
    const newOwner: ActualOwner = {
      id: Date.now().toString(),
      firstName: '',
      lastName: '',
      maidenName: '',
      birthDate: '',
      birthPlace: '',
      birthNumber: '',
      citizenship: t('forms.actualOwners.sections.additionalInfo.placeholders.citizenship'),
      permanentAddress: '',
      isPoliticallyExposed: false
    };

    updateData({
      actualOwners: [...data.actualOwners, newOwner]
    });
    
    // Automatically expand the new owner
    setExpandedOwnerId(newOwner.id);
  };

  const removeActualOwner = (id: string) => {
    updateData({
      actualOwners: data.actualOwners.filter(owner => owner.id !== id)
    });
    if (expandedOwnerId === id) {
      setExpandedOwnerId(null);
    }
  };

  const updateActualOwner = (id: string, field: string, value: any) => {
    updateData({
      actualOwners: data.actualOwners.map(owner =>
        owner.id === id ? { ...owner, [field]: value } : owner
      )
    });
  };

  const toggleOwner = (id: string) => {
    setExpandedOwnerId(expandedOwnerId === id ? null : id);
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left sidebar */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users2 className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900">{t('forms.actualOwners.sidebar.title')}</h3>
              </div>
              
              <p className="text-sm text-blue-800">
                {t('forms.actualOwners.sidebar.description')}
              </p>
              
              <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                <p className="font-medium mb-2">{t('forms.actualOwners.sidebar.whoIsOwner.title')}</p>
                <ul className="space-y-2 list-disc list-inside">
                  {t('forms.actualOwners.sidebar.whoIsOwner.items', { returnObjects: true }).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4">
                <Button
                  onClick={addActualOwner}
                  variant="outline"
                  className="w-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  {t('forms.actualOwners.sidebar.addButton')}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              {data.actualOwners.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                  <Users2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">{t('forms.actualOwners.emptyState.title')}</h3>
                  <p className="text-sm text-slate-500 mb-6">{t('forms.actualOwners.emptyState.description')}</p>
                  <Button 
                    onClick={addActualOwner}
                    variant="outline" 
                    className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t('forms.actualOwners.emptyState.addButton')}
                  </Button>
                </div>
              )}

              {data.actualOwners.map((owner, index) => (
                <div key={owner.id} className="mb-6 overflow-hidden border border-slate-200 rounded-lg shadow-sm bg-white">
                  <div 
                    onClick={() => toggleOwner(owner.id)}
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 ${
                      expandedOwnerId === owner.id ? 'bg-slate-50 border-b border-slate-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        owner.firstName && owner.lastName ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Users2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {owner.firstName && owner.lastName 
                            ? `${owner.firstName} ${owner.lastName}`
                            : t('forms.actualOwners.ownerTitle', { index: index + 1 })}
                        </h3>
                        {owner.birthDate && (
                          <p className="text-xs text-slate-500">{t('forms.actualOwners.bornLabel', { date: owner.birthDate })}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeActualOwner(owner.id);
                        }}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors mr-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="w-6 text-slate-400 transition-transform duration-200 transform">
                        {expandedOwnerId === owner.id ? '▲' : '▼'}
                      </div>
                    </div>
                  </div>

                  {expandedOwnerId === owner.id && (
                    <div className="p-4 animate-fade-in">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <Users2 className="h-4 w-4" />
                            {t('forms.actualOwners.sections.basicInfo.title')}
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <OnboardingInput
                              label={t('forms.actualOwners.sections.basicInfo.firstName')}
                              value={owner.firstName}
                              onChange={(e) => updateActualOwner(owner.id, 'firstName', e.target.value)}
                              placeholder={t('forms.actualOwners.sections.basicInfo.placeholders.firstName')}
                            />

                            <OnboardingInput
                              label={t('forms.actualOwners.sections.basicInfo.lastName')}
                              value={owner.lastName}
                              onChange={(e) => updateActualOwner(owner.id, 'lastName', e.target.value)}
                              placeholder={t('forms.actualOwners.sections.basicInfo.placeholders.lastName')}
                            />
                          </div>

                          <OnboardingInput
                            label={t('forms.actualOwners.sections.basicInfo.maidenName')}
                            value={owner.maidenName}
                            onChange={(e) => updateActualOwner(owner.id, 'maidenName', e.target.value)}
                            placeholder={t('forms.actualOwners.sections.basicInfo.placeholders.maidenName')}
                            className="mt-4"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <Fingerprint className="h-4 w-4" />
                            {t('forms.actualOwners.sections.personalData.title')}
                          </h4>

                          <div className="grid md:grid-cols-2 gap-4">
                            <OnboardingInput
                              label={t('forms.actualOwners.sections.personalData.birthDate')}
                              type="date"
                              value={owner.birthDate}
                              onChange={(e) => updateActualOwner(owner.id, 'birthDate', e.target.value)}
                            />

                            <OnboardingInput
                              label={t('forms.actualOwners.sections.personalData.birthPlace')}
                              value={owner.birthPlace}
                              onChange={(e) => updateActualOwner(owner.id, 'birthPlace', e.target.value)}
                              placeholder={t('forms.actualOwners.sections.personalData.placeholders.birthPlace')}
                            />
                          </div>

                          <OnboardingInput
                            label={t('forms.actualOwners.sections.personalData.birthNumber')}
                            value={owner.birthNumber}
                            onChange={(e) => updateActualOwner(owner.id, 'birthNumber', e.target.value)}
                            placeholder={t('forms.actualOwners.sections.personalData.placeholders.birthNumber')}
                            className="mt-4"
                          />

                          <OnboardingInput
                            label={t('forms.actualOwners.sections.personalData.permanentAddress')}
                            value={owner.permanentAddress}
                            onChange={(e) => updateActualOwner(owner.id, 'permanentAddress', e.target.value)}
                            placeholder={t('forms.actualOwners.sections.personalData.placeholders.permanentAddress')}
                            className="mt-4"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <Flag className="h-4 w-4" />
                            {t('forms.actualOwners.sections.additionalInfo.title')}
                          </h4>

                          <OnboardingInput
                            label={t('forms.actualOwners.sections.additionalInfo.citizenship')}
                            value={owner.citizenship}
                            onChange={(e) => updateActualOwner(owner.id, 'citizenship', e.target.value)}
                            placeholder={t('forms.actualOwners.sections.additionalInfo.placeholders.citizenship')}
                          />

                          <div className="flex items-center space-x-2 mt-4">
                            <Checkbox
                              id={`isPoliticallyExposed-${owner.id}`}
                              checked={owner.isPoliticallyExposed}
                              onCheckedChange={(checked) => updateActualOwner(owner.id, 'isPoliticallyExposed', checked)}
                            />
                            <div>
                              <label htmlFor={`isPoliticallyExposed-${owner.id}`} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                {t('forms.actualOwners.sections.additionalInfo.isPoliticallyExposed')}
                                {owner.isPoliticallyExposed && <AlertTriangle className="h-3 w-3 text-blue-500" />}
                              </label>
                              {owner.isPoliticallyExposed && (
                                <p className="text-xs text-slate-500 mt-1">
                                  {t('forms.actualOwners.sections.additionalInfo.descriptions.isPoliticallyExposed')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {data.actualOwners.length > 0 && (
                <Button
                  onClick={addActualOwner}
                  variant="outline"
                  className="w-full border-dashed border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('forms.actualOwners.buttons.addOwner')}
                </Button>
              )}
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActualOwnersStep;
