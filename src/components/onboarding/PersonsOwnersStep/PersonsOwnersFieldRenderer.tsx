import React from 'react';
import { useStepConfiguration } from '@/hooks/useOnboardingConfiguration';
import { DynamicFieldRenderer } from '../components/DynamicFieldRenderer';
import { OnboardingData } from '@/types/onboarding';
import EnhancedAuthorizedPersonCard from '../cards/EnhancedAuthorizedPersonCard';
import EnhancedActualOwnerCard from '../cards/EnhancedActualOwnerCard';
import AuthorizedPersonForm from '../forms/AuthorizedPersonForm';
import ActualOwnerForm from '../forms/ActualOwnerForm';
import AuthorizedPersonsSidebar from '../AuthorizedPersonsStep/AuthorizedPersonsSidebar';
import ActualOwnersSidebar from '../ActualOwnersStep/ActualOwnersSidebar';
import AuthorizedPersonsEmptyState from '../ui/AuthorizedPersonsEmptyState';
import ActualOwnersEmptyState from '../ui/ActualOwnersEmptyState';
import AutoFillFromContactButton from '../ui/AutoFillFromContactButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PersonsOwnersFieldRendererProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  // Authorized persons props
  isAddingPerson: boolean;
  editingPersonId: string | null;
  expandedPersons: Record<string, boolean>;
  onAddPerson: () => void;
  onCancelAddPerson: () => void;
  onSavePerson: (person: any) => void;
  onEditPerson: (id: string) => void;
  onDeletePerson: (id: string) => void;
  onTogglePersonExpansion: (personId: string) => void;
  // Actual owners props
  isAddingOwner: boolean;
  editingOwnerId: string | null;
  expandedOwners: Record<string, boolean>;
  onAddOwner: () => void;
  onCancelAddOwner: () => void;
  onSaveOwner: (owner: any) => void;
  onEditOwner: (id: string) => void;
  onRemoveOwner: (id: string) => void;
  onToggleOwnerExpansion: (ownerId: string) => void;
  // Auto-fill props
  contactName: string;
  canAutoFill: boolean;
  contactExistsInAuthorized: boolean;
  contactExistsInActualOwners: boolean;
  onAutoFill: () => void;
}

export const PersonsOwnersFieldRenderer: React.FC<PersonsOwnersFieldRendererProps> = ({
  data,
  updateData,
  isAddingPerson,
  editingPersonId,
  expandedPersons,
  onAddPerson,
  onCancelAddPerson,
  onSavePerson,
  onEditPerson,
  onDeletePerson,
  onTogglePersonExpansion,
  isAddingOwner,
  editingOwnerId,
  expandedOwners,
  onAddOwner,
  onCancelAddOwner,
  onSaveOwner,
  onEditOwner,
  onRemoveOwner,
  onToggleOwnerExpansion,
  contactName,
  canAutoFill,
  contactExistsInAuthorized,
  contactExistsInActualOwners,
  onAutoFill
}) => {
  const { step, isStepEnabled, fields } = useStepConfiguration('persons_and_owners');
  const { t } = useTranslation(['steps', 'forms', 'common']);

  // If configuration is available and step is disabled, render nothing
  if (step && !isStepEnabled) {
    return null;
  }

  // If no configuration available, render default persons and owners management
  if (!step || fields.length === 0) {
    return (
      <div className="space-y-4">
        {/* Auto-fill suggestion */}
        {contactName && (
          <AutoFillFromContactButton
            contactName={contactName}
            contactEmail={data.contactInfo.email}
            onAutoFill={onAutoFill}
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
              onAddPerson={onAddPerson}
            />
          </div>

          <div className="lg:col-span-2">
            {isAddingPerson ? (
              <Card>
                <CardContent className="p-6">
                  <AuthorizedPersonForm 
                    initialData={editingPersonId ? data.authorizedPersons.find(p => p.id === editingPersonId) || {} : {}}
                    onSave={onSavePerson}
                    onCancel={onCancelAddPerson}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data.authorizedPersons.map((person, index) => (
                  <EnhancedAuthorizedPersonCard
                    key={person.id}
                    person={person}
                    index={index}
                    isExpanded={expandedPersons[person.id] || false}
                    onToggle={() => onTogglePersonExpansion(person.id)}
                    onEdit={() => onEditPerson(person.id)}
                    onDelete={() => onDeletePerson(person.id)}
                  />
                ))}
                
                {data.authorizedPersons.length === 0 && (
                  <AuthorizedPersonsEmptyState onAddPerson={onAddPerson} />
                )}
                
                {data.authorizedPersons.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={onAddPerson}
                    className="w-full py-6 border-dashed border-slate-300 bg-slate-50/50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('steps:authorizedPersons.addPersonButton')}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Actual Owners Section */}
        <Card className="grid lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-1">
            <ActualOwnersSidebar 
              data={data} 
              onAddOwner={onAddOwner}
            />
          </div>

          <div className="lg:col-span-2">
            {isAddingOwner ? (
              <Card>
                <CardContent className="p-6">
                  <ActualOwnerForm 
                    initialData={editingOwnerId ? data.actualOwners.find(o => o.id === editingOwnerId) || {} : {}}
                    onSave={onSaveOwner}
                    onCancel={onCancelAddOwner}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data.actualOwners.map((owner, index) => (
                  <EnhancedActualOwnerCard
                    key={owner.id}
                    owner={owner}
                    index={index}
                    isExpanded={expandedOwners[owner.id] || false}
                    onToggle={() => onToggleOwnerExpansion(owner.id)}
                    onEdit={() => onEditOwner(owner.id)}
                    onDelete={() => onRemoveOwner(owner.id)}
                  />
                ))}
                
                {data.actualOwners.length === 0 && (
                  <ActualOwnersEmptyState onAddOwner={onAddOwner} />
                )}
                
                {data.actualOwners.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={onAddOwner}
                    className="w-full py-6 border-dashed border-slate-300 bg-slate-50/50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('steps:actualOwners.addOwnerButton')}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Render dynamic fields based on configuration
  return (
    <div className="space-y-6">
      {fields.map((field) => {
        // Handle special authorized persons section
        if (field.field_key === 'authorized_persons_section') {
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <Card className="grid lg:grid-cols-3 gap-6 p-6">
                  <div className="lg:col-span-1">
                    <AuthorizedPersonsSidebar 
                      data={data} 
                      onAddPerson={onAddPerson}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    {/* Authorized persons management content */}
                    {/* ... similar to default implementation */}
                  </div>
                </Card>
              )}
            </div>
          );
        }

        // Handle special actual owners section
        if (field.field_key === 'actual_owners_section') {
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <Card className="grid lg:grid-cols-3 gap-6 p-6">
                  <div className="lg:col-span-1">
                    <ActualOwnersSidebar 
                      data={data} 
                      onAddOwner={onAddOwner}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    {/* Actual owners management content */}
                    {/* ... similar to default implementation */}
                  </div>
                </Card>
              )}
            </div>
          );
        }

        // Handle auto-fill button
        if (field.field_key === 'auto_fill_from_contact') {
          return (
            <div key={field.id}>
              {field.is_enabled && contactName && (
                <AutoFillFromContactButton
                  contactName={contactName}
                  contactEmail={data.contactInfo.email}
                  onAutoFill={onAutoFill}
                  canAutoFill={canAutoFill}
                  alreadyExists={contactExistsInAuthorized && contactExistsInActualOwners}
                  stepType="authorized"
                  className="mb-4"
                />
              )}
            </div>
          );
        }

        // Handle individual dynamic fields
        const fieldValue = (data as any)[field.field_key];
        
        return (
          <div key={field.id}>
            {field.is_enabled && (
              <DynamicFieldRenderer
                field={field}
                value={fieldValue}
                onChange={(value) => {
                  updateData({
                    [field.field_key]: value
                  });
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};