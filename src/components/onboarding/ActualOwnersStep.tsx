
import React, { useState } from 'react';
import { OnboardingData } from "@/types/onboarding";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import OnboardingStepHeader from "./ui/OnboardingStepHeader";
import OnboardingSection from "./ui/OnboardingSection";
import { useToast } from "@/hooks/use-toast";
import { useContactAutoFill } from "./hooks/useContactAutoFill";
import AutoFillFromContactButton from "./ui/AutoFillFromContactButton";
import ActualOwnerCard from "./cards/ActualOwnerCard";
import ActualOwnerForm from "./forms/ActualOwnerForm";
import ActualOwnersSidebar from "./ActualOwnersStep/ActualOwnersSidebar";

interface ActualOwnersStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ActualOwnersStep = ({ data, updateData, onNext, onPrev }: ActualOwnersStepProps) => {
  const { t } = useTranslation(['steps', 'forms', 'common']);
  const { toast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddActualOwner = () => {
    setIsAdding(true);
    setEditingId(null);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSaveOwner = (owner: any) => {
    if (editingId) {
      // Update existing owner
      const updatedOwners = data.actualOwners.map(o => 
        o.id === editingId ? { ...owner, id: editingId } : o
      );
      updateData({ actualOwners: updatedOwners });
      setEditingId(null);
    } else {
      // Add new owner
      const newOwner = {
        ...owner,
        id: uuidv4()
      };
      updateData({ actualOwners: [...data.actualOwners, newOwner] });
    }
    
    setIsAdding(false);
  };

  const handleEditOwner = (id: string) => {
    setEditingId(id);
    setIsAdding(true);
  };

  const handleRemoveActualOwner = (id: string) => {
    const updatedActualOwners = data.actualOwners.filter(owner => owner.id !== id);
    updateData({ actualOwners: updatedActualOwners });
  };

  const handleNextStep = () => {
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
  
  const { 
    autoFillActualOwner,
    canAutoFill,
    contactExistsInActualOwners
  } = useContactAutoFill({ data, updateData });

  const contactName = `${data.contactInfo.firstName} ${data.contactInfo.lastName}`.trim();

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        currentStep={6}
        totalSteps={8}
        title={t('steps:actualOwners.title')}
        description={t('steps:actualOwners.description')}
      />

      <Card className="grid lg:grid-cols-3 gap-6 p-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ActualOwnersSidebar 
            data={data} 
            onAddOwner={handleAddActualOwner}
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
                onAutoFill={autoFillActualOwner}
                canAutoFill={canAutoFill}
                alreadyExists={contactExistsInActualOwners}
                stepType="actual-owner"
                className="mb-6"
              />
            )}

            {isAdding ? (
              <Card>
                <CardContent className="p-6">
                  <ActualOwnerForm 
                    initialData={editingId ? data.actualOwners.find(o => o.id === editingId) || {} : {}}
                    onSave={handleSaveOwner}
                    onCancel={handleCancelAdd}
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
                    onDelete={() => handleRemoveActualOwner(owner.id)}
                  />
                ))}
                
                {data.actualOwners.length === 0 && (
                  <div className="text-center py-12">
                    <div className="max-w-sm mx-auto">
                      <div className="mb-4">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <Plus className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Žiadni skutoční vlastníci
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Pridajte aspoň jedného skutočného vlastníka
                      </p>
                      <Button onClick={handleAddActualOwner}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('steps:actualOwners.addOwnerButton')}
                      </Button>
                    </div>
                  </div>
                )}
                
                {data.actualOwners.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handleAddActualOwner}
                    className="w-full py-8 border-dashed border-slate-300 bg-slate-50/50"
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
