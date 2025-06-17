import { useState } from "react";
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import AuthorizedPersonForm from "./forms/AuthorizedPersonForm";
import AuthorizedPersonCard from "./cards/AuthorizedPersonCard";
import OnboardingStepHeader from "./ui/OnboardingStepHeader";
import OnboardingSection from "./ui/OnboardingSection";
import { useContactAutoFill } from "./hooks/useContactAutoFill";
import AutoFillFromContactButton from "./ui/AutoFillFromContactButton";
import AuthorizedPersonsSidebar from "./AuthorizedPersonsStep/AuthorizedPersonsSidebar";

interface AuthorizedPersonsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AuthorizedPersonsStep = ({ data, updateData, onNext, onPrev }: AuthorizedPersonsStepProps) => {
  const { t } = useTranslation(['steps', 'forms', 'common']);
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { 
    autoFillAuthorizedPerson,
    canAutoFill,
    contactExistsInAuthorized
  } = useContactAutoFill({ data, updateData });

  const handleAddPerson = () => {
    setIsAdding(true);
    setEditingId(null);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSavePerson = (person: any) => {
    if (editingId) {
      // Update existing person
      updateData({
        authorizedPersons: data.authorizedPersons.map(p => 
          p.id === editingId ? { ...person, id: editingId } : p
        )
      });
      setEditingId(null);
    } else {
      // Add new person
      const newPerson = {
        ...person,
        id: uuidv4()
      };
      
      updateData({
        authorizedPersons: [...data.authorizedPersons, newPerson]
      });
    }
    
    setIsAdding(false);
  };

  const handleEditPerson = (id: string) => {
    setEditingId(id);
    setIsAdding(true);
  };

  const handleDeletePerson = (id: string) => {
    updateData({
      authorizedPersons: data.authorizedPersons.filter(p => p.id !== id)
    });
  };

  const handleNextStep = () => {
    if (data.authorizedPersons.length === 0) {
      toast({
        title: t('common:error'),
        description: t('steps:authorizedPersons.validation.noPeople'),
        variant: "destructive",
      });
      return;
    }

    // Check if all required fields are filled for each person
    for (const person of data.authorizedPersons) {
      if (!person.firstName || !person.lastName || !person.email || !person.birthDate || !person.birthPlace || !person.birthNumber || !person.permanentAddress || !person.position) {
        toast({
          title: t('common:error'),
          description: t('steps:authorizedPersons.validation.missingFields'),
          variant: "destructive",
        });
        return;
      }
    }

    onNext();
  };

  const contactName = `${data.contactInfo.firstName} ${data.contactInfo.lastName}`.trim();

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        currentStep={5}
        totalSteps={8}
        title={t('steps:authorizedPersons.title')}
        description={t('steps:authorizedPersons.description')}
      />

      <Card className="grid lg:grid-cols-3 gap-6 p-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <AuthorizedPersonsSidebar 
            data={data} 
            onAddPerson={handleAddPerson}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <OnboardingSection>
            {/* Auto-fill suggestion */}
            {contactName && (
              <AutoFillFromContactButton
                contactName={contactName}
                contactEmail={data.contactInfo.email}
                onAutoFill={autoFillAuthorizedPerson}
                canAutoFill={canAutoFill}
                alreadyExists={contactExistsInAuthorized}
                stepType="authorized"
                className="mb-6"
              />
            )}

            {isAdding ? (
              <Card>
                <CardContent className="p-6">
                  <AuthorizedPersonForm 
                    initialData={editingId ? data.authorizedPersons.find(p => p.id === editingId) || {} : {}}
                    onSave={handleSavePerson}
                    onCancel={handleCancelAdd}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data.authorizedPersons.map(person => (
                  <AuthorizedPersonCard
                    key={person.id}
                    person={person}
                    onEdit={() => handleEditPerson(person.id)}
                    onDelete={() => handleDeletePerson(person.id)}
                  />
                ))}
                
                {data.authorizedPersons.length === 0 && (
                  <div className="text-center py-12">
                    <div className="max-w-sm mx-auto">
                      <div className="mb-4">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <Plus className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {t('steps:authorizedPersons.emptyState.title')}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {t('steps:authorizedPersons.emptyState.description')}
                      </p>
                      <Button onClick={handleAddPerson}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('steps:authorizedPersons.addPersonButton')}
                      </Button>
                    </div>
                  </div>
                )}
                
                {data.authorizedPersons.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handleAddPerson}
                    className="w-full py-8 border-dashed border-slate-300 bg-slate-50/50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('steps:authorizedPersons.addPersonButton')}
                  </Button>
                )}
              </div>
            )}
          </OnboardingSection>
        </div>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="secondary" onClick={onPrev}>
          {t('common:previous')}
        </Button>
        <Button onClick={handleNextStep}>
          {t('common:next')}
        </Button>
      </div>
    </div>
  );
};

export default AuthorizedPersonsStep;
