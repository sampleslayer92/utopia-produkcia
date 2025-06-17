import React, { useState } from 'react';
import { OnboardingData } from "@/types/onboarding";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import OnboardingSection from "./ui/OnboardingSection";
import { useToast } from "@/hooks/use-toast";
import { useContactAutoFill } from "./hooks/useContactAutoFill";
import AutoFillFromContactButton from "./ui/AutoFillFromContactButton";
import AuthorizedPersonCard from "./cards/AuthorizedPersonCard";
import AuthorizedPersonForm from "./forms/AuthorizedPersonForm";
import ActualOwnerCard from "./cards/ActualOwnerCard";
import ActualOwnerForm from "./forms/ActualOwnerForm";
import AuthorizedPersonsSidebar from "./AuthorizedPersonsStep/AuthorizedPersonsSidebar";
import ActualOwnersSidebar from "./ActualOwnersStep/ActualOwnersSidebar";
import AuthorizedPersonsEmptyState from "./ui/AuthorizedPersonsEmptyState";
import ActualOwnersEmptyState from "./ui/ActualOwnersEmptyState";

interface PersonsAndOwnersStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PersonsAndOwnersStep = ({ data, updateData, onNext, onPrev }: PersonsAndOwnersStepProps) => {
  const { t } = useTranslation(['steps', 'forms', 'common']);
  const { toast } = useToast();

  // Authorized Persons state
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);

  // Actual Owners state
  const [isAddingOwner, setIsAddingOwner] = useState(false);
  const [editingOwnerId, setEditingOwnerId] = useState<string | null>(null);

  const { 
    autoFillAuthorizedPerson,
    autoFillActualOwner,
    canAutoFill,
    contactExistsInAuthorized,
    contactExistsInActualOwners
  } = useContactAutoFill({ data, updateData });

  // Authorized Persons handlers
  const handleAddPerson = () => {
    setIsAddingPerson(true);
    setEditingPersonId(null);
    setIsAddingOwner(false);
    setEditingOwnerId(null);
  };

  const handleCancelAddPerson = () => {
    setIsAddingPerson(false);
    setEditingPersonId(null);
  };

  const handleSavePerson = (person: any) => {
    if (editingPersonId) {
      updateData({
        authorizedPersons: data.authorizedPersons.map(p => 
          p.id === editingPersonId ? { ...person, id: editingPersonId } : p
        )
      });
      setEditingPersonId(null);
    } else {
      const newPerson = {
        ...person,
        id: uuidv4()
      };
      updateData({
        authorizedPersons: [...data.authorizedPersons, newPerson]
      });
    }
    setIsAddingPerson(false);
  };

  const handleEditPerson = (id: string) => {
    setEditingPersonId(id);
    setIsAddingPerson(true);
    setIsAddingOwner(false);
    setEditingOwnerId(null);
  };

  const handleDeletePerson = (id: string) => {
    updateData({
      authorizedPersons: data.authorizedPersons.filter(p => p.id !== id)
    });
  };

  // Actual Owners handlers
  const handleAddOwner = () => {
    setIsAddingOwner(true);
    setEditingOwnerId(null);
    setIsAddingPerson(false);
    setEditingPersonId(null);
  };

  const handleCancelAddOwner = () => {
    setIsAddingOwner(false);
    setEditingOwnerId(null);
  };

  const handleSaveOwner = (owner: any) => {
    if (editingOwnerId) {
      const updatedOwners = data.actualOwners.map(o => 
        o.id === editingOwnerId ? { ...owner, id: editingOwnerId } : o
      );
      updateData({ actualOwners: updatedOwners });
      setEditingOwnerId(null);
    } else {
      const newOwner = {
        ...owner,
        id: uuidv4()
      };
      updateData({ actualOwners: [...data.actualOwners, newOwner] });
    }
    setIsAddingOwner(false);
  };

  const handleEditOwner = (id: string) => {
    setEditingOwnerId(id);
    setIsAddingOwner(true);
    setIsAddingPerson(false);
    setEditingPersonId(null);
  };

  const handleRemoveOwner = (id: string) => {
    const updatedActualOwners = data.actualOwners.filter(owner => owner.id !== id);
    updateData({ actualOwners: updatedActualOwners });
  };

  const handleNextStep = () => {
    // Validate authorized persons
    if (data.authorizedPersons.length === 0) {
      toast({
        title: t('common:error'),
        description: t('steps:authorizedPersons.validation.noPeople'),
        variant: "destructive",
      });
      return;
    }

    // Check if all required fields are filled for each authorized person
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

    // Validate actual owners
    if (data.actualOwners.length === 0) {
      toast({
        title: t('common:error'),
        description: t('steps:actualOwners.validation.noOwners'),
        variant: "destructive",
      });
      return;
    }

    // Check if all required fields are filled for each owner
    for (const owner of data.actualOwners) {
      if (!owner.firstName || !owner.lastName || !owner.birthDate || !owner.birthPlace || !owner.birthNumber || !owner.citizenship || !owner.permanentAddress) {
        toast({
          title: t('common:error'),
          description: t('steps:actualOwners.validation.missingFields'),
          variant: "destructive",
        });
        return;
      }
    }

    onNext();
  };

  const contactName = `${data.contactInfo.firstName} ${data.contactInfo.lastName}`.trim();

  return (
    <div className="space-y-4">
      {/* Auto-fill suggestion */}
      {contactName && (
        <AutoFillFromContactButton
          contactName={contactName}
          contactEmail={data.contactInfo.email}
          onAutoFill={() => {
            autoFillAuthorizedPerson();
            autoFillActualOwner();
          }}
          canAutoFill={canAutoFill}
          alreadyExists={contactExistsInAuthorized && contactExistsInActualOwners}
          stepType="authorized"
          className="mb-4"
        />
      )}

      {/* Authorized Persons Section */}
      <Card className="grid lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-1">
          <AuthorizedPersonsSidebar 
            data={data} 
            onAddPerson={handleAddPerson}
          />
        </div>

        <div className="lg:col-span-2">
          <OnboardingSection>
            {isAddingPerson ? (
              <Card>
                <CardContent className="p-6">
                  <AuthorizedPersonForm 
                    initialData={editingPersonId ? data.authorizedPersons.find(p => p.id === editingPersonId) || {} : {}}
                    onSave={handleSavePerson}
                    onCancel={handleCancelAddPerson}
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
                  <AuthorizedPersonsEmptyState onAddPerson={handleAddPerson} />
                )}
                
                {data.authorizedPersons.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handleAddPerson}
                    className="w-full py-6 border-dashed border-slate-300 bg-slate-50/50"
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

      {/* Actual Owners Section */}
      <Card className="grid lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-1">
          <ActualOwnersSidebar 
            data={data} 
            onAddOwner={handleAddOwner}
          />
        </div>

        <div className="lg:col-span-2">
          <OnboardingSection>
            {isAddingOwner ? (
              <Card>
                <CardContent className="p-6">
                  <ActualOwnerForm 
                    initialData={editingOwnerId ? data.actualOwners.find(o => o.id === editingOwnerId) || {} : {}}
                    onSave={handleSaveOwner}
                    onCancel={handleCancelAddOwner}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data.actualOwners.map((owner) => (
                  <ActualOwnerCard
                    key={owner.id}
                    owner={owner}
                    onEdit={() => handleEditOwner(owner.id)}
                    onDelete={() => handleRemoveOwner(owner.id)}
                  />
                ))}
                
                {data.actualOwners.length === 0 && (
                  <ActualOwnersEmptyState onAddOwner={handleAddOwner} />
                )}
                
                {data.actualOwners.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handleAddOwner}
                    className="w-full py-6 border-dashed border-slate-300 bg-slate-50/50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('steps:actualOwners.addOwnerButton')}
                  </Button>
                )}
              </div>
            )}
          </OnboardingSection>
        </div>
      </Card>
    </div>
  );
};

export default PersonsAndOwnersStep;
