
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from 'react-i18next';
import EditableSection from "./EditableSection";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthorizedPersonsCrud } from "@/hooks/useAuthorizedPersonsCrud";
import { useParams } from "react-router-dom";

interface AuthorizedPersonsSectionProps {
  onboardingData: any;
  isEditMode: boolean;
  onSave: (data: any) => void;
}

const AuthorizedPersonsSection = ({ onboardingData, isEditMode, onSave }: AuthorizedPersonsSectionProps) => {
  const { t } = useTranslation('admin');
  const { id: contractId } = useParams<{ id: string }>();
  const { deletePerson, isDeleting } = useAuthorizedPersonsCrud(contractId!);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<any>(null);

  const authorizedPersons = onboardingData.authorizedPersons || [];

  const handleDeletePerson = (person: any) => {
    setPersonToDelete(person);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (personToDelete) {
      await deletePerson.mutateAsync(personToDelete.id);
      setDeleteModalOpen(false);
      setPersonToDelete(null);
    }
  };

  const addNewPerson = () => {
    console.log('Add new person');
  };

  const getDocumentTypeBadge = (docType: string) => {
    switch (docType) {
      case 'id_card':
        return <Badge variant="outline">{t('authorizedPersons.idCard')}</Badge>;
      case 'passport':
        return <Badge variant="outline">{t('authorizedPersons.passport')}</Badge>;
      case 'driving_license':
        return <Badge variant="outline">{t('authorizedPersons.drivingLicense')}</Badge>;
      default:
        return <Badge variant="outline">{docType}</Badge>;
    }
  };

  return (
    <>
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-slate-900">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              {t('authorizedPersons.title')}
            </div>
            {isEditMode && (
              <Button variant="outline" size="sm" onClick={addNewPerson}>
                <Plus className="h-4 w-4 mr-2" />
                {t('authorizedPersons.addPerson')}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {authorizedPersons.length > 0 ? (
            authorizedPersons.map((person: any, index: number) => (
              <EditableSection key={index} isEditMode={isEditMode}>
                <div className="p-6 bg-slate-50/50 rounded-lg border border-slate-200 relative">
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePerson(person)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-700"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h5 className="font-medium text-slate-900">{t('authorizedPersons.personalData')}</h5>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('clientOperations.firstName')}</Label>
                          {isEditMode ? (
                            <Input 
                              defaultValue={person.firstName || ''} 
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">{person.firstName}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('clientOperations.lastName')}</Label>
                          {isEditMode ? (
                            <Input 
                              defaultValue={person.lastName || ''} 
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">{person.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600">{t('authorizedPersons.position')}</Label>
                        {isEditMode ? (
                          <Input 
                            defaultValue={person.position || ''} 
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1">{person.position}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('clientOperations.email')}</Label>
                          {isEditMode ? (
                            <Input 
                              defaultValue={person.email || ''} 
                              type="email"
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">{person.email}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('clientOperations.phone')}</Label>
                          {isEditMode ? (
                            <Input 
                              defaultValue={person.phone || ''} 
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">{person.phone}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600">{t('actualOwners.permanentAddress')}</Label>
                        {isEditMode ? (
                          <Input 
                            defaultValue={person.permanentAddress || ''} 
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1">{person.permanentAddress}</p>
                        )}
                      </div>
                    </div>

                    {/* Document Information */}
                    <div className="space-y-4">
                      <h5 className="font-medium text-slate-900">{t('authorizedPersons.identityDocument')}</h5>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-600">{t('authorizedPersons.documentType')}</Label>
                        <div className="mt-1">
                          {getDocumentTypeBadge(person.documentType)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('authorizedPersons.documentNumber')}</Label>
                          {isEditMode ? (
                            <Input 
                              defaultValue={person.documentNumber || ''} 
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-slate-900 mt-1 font-mono">{person.documentNumber}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('authorizedPersons.validUntil')}</Label>
                          {isEditMode ? (
                            <Input 
                              type="date"
                              defaultValue={person.documentValidity || ''} 
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">
                              {person.documentValidity ? format(new Date(person.documentValidity), 'dd.MM.yyyy') : t('contractActions.notSpecified')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600">{t('authorizedPersons.issuer')}</Label>
                        {isEditMode ? (
                          <Input 
                            defaultValue={person.documentIssuer || ''} 
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1">{person.documentIssuer}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('actualOwners.birthDate')}</Label>
                          {isEditMode ? (
                            <Input 
                              type="date"
                              defaultValue={person.birthDate || ''} 
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">
                              {person.birthDate ? format(new Date(person.birthDate), 'dd.MM.yyyy') : t('contractActions.notSpecified')}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('actualOwners.citizenship')}</Label>
                          {isEditMode ? (
                            <Input 
                              defaultValue={person.citizenship || ''} 
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">{person.citizenship}</p>
                          )}
                        </div>
                      </div>

                      {/* Status indicators */}
                      <div className="pt-4 border-t border-slate-200">
                        <div className="flex flex-wrap gap-2">
                          {person.isPoliticallyExposed && (
                            <Badge variant="destructive">{t('authorizedPersons.pepPerson')}</Badge>
                          )}
                          {person.isUsCitizen && (
                            <Badge variant="outline">{t('authorizedPersons.usCitizen')}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </EditableSection>
            ))
          ) : (
            <p className="text-slate-600 text-center py-8">
              {t('authorizedPersons.noPersons')}
            </p>
          )}
        </CardContent>
      </Card>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={personToDelete ? `${personToDelete.firstName} ${personToDelete.lastName}` : t('authorizedPersons.thisPerson')}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default AuthorizedPersonsSection;
