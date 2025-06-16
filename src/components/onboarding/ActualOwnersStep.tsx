import React, { useState, useEffect } from 'react';
import { OnboardingData, ActualOwner } from "@/types/onboarding";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Crown } from "lucide-react";
import OnboardingStepHeader from "./ui/OnboardingStepHeader";
import OnboardingSection from "./ui/OnboardingSection";
import { useToast } from "@/hooks/use-toast";
import { useContactAutoFill } from "./hooks/useContactAutoFill";
import AutoFillFromContactButton from "./ui/AutoFillFromContactButton";

interface ActualOwnersStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ActualOwnersStep = ({ data, updateData, onNext, onPrev }: ActualOwnersStepProps) => {
  const { t } = useTranslation(['steps', 'forms', 'common']);
  const { toast } = useToast();

  const [actualOwners, setActualOwners] = useState<ActualOwner[]>(data.actualOwners);

  useEffect(() => {
    setActualOwners(data.actualOwners);
  }, [data.actualOwners]);

  const handleAddActualOwner = () => {
    const newActualOwner: ActualOwner = {
      id: uuidv4(),
      firstName: '',
      lastName: '',
      maidenName: '',
      birthDate: '',
      birthPlace: '',
      birthNumber: '',
      citizenship: 'Slovensko',
      permanentAddress: '',
      isPoliticallyExposed: false,
      createdFromContact: false
    };
    setActualOwners([...actualOwners, newActualOwner]);
  };

  const handleRemoveActualOwner = (id: string) => {
    const updatedActualOwners = actualOwners.filter(owner => owner.id !== id);
    setActualOwners(updatedActualOwners);
  };

  const handleUpdateActualOwner = (id: string, field: string, value: any) => {
    const updatedActualOwners = actualOwners.map(owner =>
      owner.id === id ? { ...owner, [field]: value } : owner
    );
    setActualOwners(updatedActualOwners);
  };

  useEffect(() => {
    updateData({ actualOwners: actualOwners });
  }, [actualOwners, updateData]);

  const handleNextStep = () => {
    if (actualOwners.length === 0) {
      toast({
        title: t('common:error'),
        description: t('steps:actualOwners.validation.noOwners'),
        variant: "destructive",
      });
      return;
    }

    // Check if all required fields are filled for each owner
    for (const owner of actualOwners) {
      if (!owner.firstName || !owner.lastName || !owner.birthDate || !owner.birthPlace || !owner.birthNumber || !owner.citizenship || !owner.permanentAddress) {
        toast({
          title: t('common:error'),
          description: t('steps:actualOwners.validation.missingFields'),
          variant: "destructive",
        });
        return;
      }
    }

    updateData({ actualOwners: actualOwners });
    onNext();
  };
  
  const { 
    autoFillActualOwner,
    canAutoFill,
    contactExistsInActualOwners
  } = useContactAutoFill({ data, updateData });

  const contactName = `${data.contactInfo.firstName} ${data.contactInfo.lastName}`.trim();

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        title={t('steps:actualOwners.title')}
        description={t('steps:actualOwners.description')}
        icon={<Crown className="h-6 w-6" />}
      />

      {/* Auto-fill suggestion */}
      {contactName && (
        <AutoFillFromContactButton
          contactName={contactName}
          contactEmail={data.contactInfo.email}
          onAutoFill={autoFillActualOwner}
          canAutoFill={canAutoFill}
          alreadyExists={contactExistsInActualOwners}
          stepType="actual-owner"
          className="mb-6"
        />
      )}

      <OnboardingSection>
        <div className="space-y-4">
          {actualOwners.map((owner) => (
            <div key={owner.id} className="border rounded-md p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`firstName-${owner.id}`}>{t('forms:actualOwners.firstName')}</Label>
                  <Input
                    type="text"
                    id={`firstName-${owner.id}`}
                    value={owner.firstName}
                    onChange={(e) => handleUpdateActualOwner(owner.id, 'firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`lastName-${owner.id}`}>{t('forms:actualOwners.lastName')}</Label>
                  <Input
                    type="text"
                    id={`lastName-${owner.id}`}
                    value={owner.lastName}
                    onChange={(e) => handleUpdateActualOwner(owner.id, 'lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor={`birthDate-${owner.id}`}>{t('forms:actualOwners.birthDate')}</Label>
                  <Input
                    type="date"
                    id={`birthDate-${owner.id}`}
                    value={owner.birthDate}
                    onChange={(e) => handleUpdateActualOwner(owner.id, 'birthDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`birthPlace-${owner.id}`}>{t('forms:actualOwners.birthPlace')}</Label>
                  <Input
                    type="text"
                    id={`birthPlace-${owner.id}`}
                    value={owner.birthPlace}
                    onChange={(e) => handleUpdateActualOwner(owner.id, 'birthPlace', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor={`birthNumber-${owner.id}`}>{t('forms:actualOwners.birthNumber')}</Label>
                  <Input
                    type="text"
                    id={`birthNumber-${owner.id}`}
                    value={owner.birthNumber}
                    onChange={(e) => handleUpdateActualOwner(owner.id, 'birthNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`citizenship-${owner.id}`}>{t('forms:actualOwners.citizenship')}</Label>
                  <Input
                    type="text"
                    id={`citizenship-${owner.id}`}
                    value={owner.citizenship}
                    onChange={(e) => handleUpdateActualOwner(owner.id, 'citizenship', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor={`permanentAddress-${owner.id}`}>{t('forms:actualOwners.permanentAddress')}</Label>
                <Input
                  type="text"
                  id={`permanentAddress-${owner.id}`}
                  value={owner.permanentAddress}
                  onChange={(e) => handleUpdateActualOwner(owner.id, 'permanentAddress', e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Label htmlFor={`isPoliticallyExposed-${owner.id}`}>{t('forms:actualOwners.isPoliticallyExposed')}</Label>
                <select
                  id={`isPoliticallyExposed-${owner.id}`}
                  value={owner.isPoliticallyExposed.toString()}
                  onChange={(e) => handleUpdateActualOwner(owner.id, 'isPoliticallyExposed', e.target.value === 'true')}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="false">{t('common:no')}</option>
                  <option value="true">{t('common:yes')}</option>
                </select>
              </div>

              <Button
                variant="destructive"
                size="sm"
                className="mt-4"
                onClick={() => handleRemoveActualOwner(owner.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                {t('common:remove')}
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={handleAddActualOwner} className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          {t('steps:actualOwners.addOwnerButton')}
        </Button>
      </OnboardingSection>

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

export default ActualOwnersStep;
