import { useState } from "react";
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import AuthorizedPersonForm from "./forms/AuthorizedPersonForm";
import AuthorizedPersonCard from "./cards/AuthorizedPersonCard";
import OnboardingStepHeader from "./ui/OnboardingStepHeader";
import { useContactAutoFill } from "./hooks/useContactAutoFill";
import AutoFillFromContactButton from "./ui/AutoFillFromContactButton";

interface AuthorizedPersonsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AuthorizedPersonsStep = ({ data, updateData, onNext, onPrev }: AuthorizedPersonsStepProps) => {
  const { t } = useTranslation(['forms', 'steps']);
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

  const contactName = `${data.contactInfo.firstName} ${data.contactInfo.lastName}`.trim();

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        currentStep={5}
        totalSteps={8}
        title={t('steps:authorizedPersons.title')}
        description={t('steps:authorizedPersons.description')}
      />

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
          
          <Button 
            variant="outline" 
            onClick={handleAddPerson}
            className="w-full py-8 border-dashed border-slate-300 bg-slate-50/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('forms:authorizedPersons.addPerson')}
          </Button>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrev}>
          {t('forms:common.back')}
        </Button>
        <Button onClick={onNext} disabled={data.authorizedPersons.length === 0}>
          {t('forms:common.continue')}
        </Button>
      </div>
    </div>
  );
};

export default AuthorizedPersonsStep;
