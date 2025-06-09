
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { OnboardingData, AuthorizedPerson } from "@/types/onboarding";
import AuthorizedPersonsSidebar from "./AuthorizedPersonsStep/AuthorizedPersonsSidebar";
import AuthorizedPersonForm from "./AuthorizedPersonsStep/AuthorizedPersonForm";
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
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);

  const handleAddPerson = () => {
    const newPerson: AuthorizedPerson = {
      id: `person-${Date.now()}`,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      authorizationScope: ''
    };
    
    updateData({
      authorizedPersons: [...(data.authorizedPersons || []), newPerson]
    });
    setEditingPersonId(newPerson.id);
  };

  const handleUpdatePerson = (personId: string, updatedPerson: AuthorizedPerson) => {
    const updatedPersons = (data.authorizedPersons || []).map(person =>
      person.id === personId ? updatedPerson : person
    );
    updateData({ authorizedPersons: updatedPersons });
  };

  const handleRemovePerson = (personId: string) => {
    const filteredPersons = (data.authorizedPersons || []).filter(person => person.id !== personId);
    updateData({ authorizedPersons: filteredPersons });
    if (editingPersonId === personId) {
      setEditingPersonId(null);
    }
  };

  const infoTooltipData = {
    description: t('steps.authorizedPersons.description'),
    features: []
  };

  if (isMobile) {
    return (
      <MobileOptimizedCard
        title={t('steps.authorizedPersons.title')}
        icon={<Users className="h-4 w-4 text-blue-600" />}
        infoTooltip={infoTooltipData}
      >
        <div className="space-y-6">
          {(!data.authorizedPersons || data.authorizedPersons.length === 0) ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {t('steps.authorizedPersons.empty.title')}
              </h3>
              <p className="text-slate-600 mb-4">
                {t('steps.authorizedPersons.empty.description')}
              </p>
              <Button onClick={handleAddPerson} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('steps.authorizedPersons.empty.addButton')}
              </Button>
            </div>
          ) : (
            <>
              {data.authorizedPersons.map((person, index) => (
                <AuthorizedPersonForm
                  key={person.id}
                  person={person}
                  personNumber={index + 1}
                  isEditing={editingPersonId === person.id}
                  onUpdate={(updatedPerson) => handleUpdatePerson(person.id, updatedPerson)}
                  onRemove={() => handleRemovePerson(person.id)}
                  onStartEdit={() => setEditingPersonId(person.id)}
                  onStopEdit={() => setEditingPersonId(null)}
                />
              ))}
              
              <Button
                onClick={handleAddPerson}
                variant="outline"
                className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('steps.authorizedPersons.form.addAnother')}
              </Button>
            </>
          )}
        </div>
      </MobileOptimizedCard>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <AuthorizedPersonsSidebar />
          
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            {(!data.authorizedPersons || data.authorizedPersons.length === 0) ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-slate-900 mb-3">
                  {t('steps.authorizedPersons.empty.title')}
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  {t('steps.authorizedPersons.empty.description')}
                </p>
                <Button onClick={handleAddPerson} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('steps.authorizedPersons.empty.addButton')}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {data.authorizedPersons.map((person, index) => (
                  <AuthorizedPersonForm
                    key={person.id}
                    person={person}
                    personNumber={index + 1}
                    isEditing={editingPersonId === person.id}
                    onUpdate={(updatedPerson) => handleUpdatePerson(person.id, updatedPerson)}
                    onRemove={() => handleRemovePerson(person.id)}
                    onStartEdit={() => setEditingPersonId(person.id)}
                    onStopEdit={() => setEditingPersonId(null)}
                  />
                ))}
                
                <Button
                  onClick={handleAddPerson}
                  variant="outline"
                  className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('steps.authorizedPersons.form.addAnother')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorizedPersonsStep;
