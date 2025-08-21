import { useState } from "react";
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
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
import { useAresPersons } from "./hooks/useAresPersons";

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

  const { fetchAndFillPersons, isLoading: isLoadingAresPersons } = useAresPersons();

  const handleFetchFromAres = () => {
    const ico = data.companyInfo?.ico;
    const companyName = data.companyInfo?.companyName;
    
    console.log('=== MANUAL FETCH FROM ARES in Step 6 ===');
    console.log('ICO:', ico);
    console.log('Current authorized persons count:', data.authorizedPersons.length);
    
    if (!ico) {
      toast({
        title: 'Chyba',
        description: 'ICO spoločnosti nie je zadané',
        variant: 'destructive'
      });
      return;
    }

    // Determine subject type from company info
    const subjectType = getSubjectTypeFromCompany(data.companyInfo);
    const expectedPersonsMessage = subjectType === 'S.r.o.' 
      ? 'Načítajú sa údaje o jednateli a prokúristoch...'
      : subjectType === 'Živnosť' 
        ? 'Načítajú sa údaje o podnikateľovi...'
        : 'Načítajú sa údaje o osobách...';

    toast({
      title: 'Načítavam z ARES',
      description: expectedPersonsMessage,
      variant: 'default'
    });

    fetchAndFillPersons(ico, (aresPersons) => {
      console.log('=== MANUAL FETCH SUCCESS: Received persons:', aresPersons);
      // Replace existing persons with ARES persons (not append)
      updateData({
        authorizedPersons: aresPersons
      });
      
      if (aresPersons.length > 0) {
        toast({
          title: 'Osoby načítané z ARES',
          description: `Úspešne načítané ${aresPersons.length} osoba/osôb z registra ARES.`,
        });
      }
    });
  };

  const getSubjectTypeFromCompany = (companyInfo: any): string => {
    if (!companyInfo) return 'Neznámy';
    
    const registryType = companyInfo.registryType || '';
    const companyName = companyInfo.companyName || '';
    
    if (registryType.includes('S.r.o.') || companyName.includes('s.r.o.')) {
      return 'S.r.o.';
    } else if (registryType.includes('Živnosť') || registryType === 'Fyzická osoba') {
      return 'Živnosť';
    }
    
    return registryType || 'Neznámy';
  };

  const canFetchFromAres = () => {
    return !!(data.companyInfo?.ico && data.companyInfo?.ico.length >= 7);
  };

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
            <div className="space-y-4 mb-6">
              {/* Status message for auto-loaded persons */}
              {data.authorizedPersons.length > 0 && 
               data.authorizedPersons.some(p => p.functionStartDate || p.functionEndDate) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700 font-medium">
                    ✓ Osoby boli automaticky načítané z ARES registra
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Skontrolujte a doplňte chýbajúce údaje (email, telefón, adresa, doklady)
                  </p>
                </div>
              )}
              
              {/* Auto-fill suggestion */}
              {contactName && (
                <AutoFillFromContactButton
                  contactName={contactName}
                  contactEmail={data.contactInfo.email}
                  onAutoFill={autoFillAuthorizedPerson}
                  canAutoFill={canAutoFill}
                  alreadyExists={contactExistsInAuthorized}
                  stepType="authorized"
                />
              )}

              {/* ARES persons fetch button */}
              {canFetchFromAres() && (
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={handleFetchFromAres}
                    disabled={isLoadingAresPersons}
                    className="w-full"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    {isLoadingAresPersons 
                      ? 'Načítavam z ARES...' 
                      : data.authorizedPersons.length > 0
                        ? `Znovu načítať z ARES (${getSubjectTypeFromCompany(data.companyInfo)})`
                        : `Načítaj osoby z ARES (${getSubjectTypeFromCompany(data.companyInfo)})`
                    }
                  </Button>
                  
                  {!canFetchFromAres() && data.companyInfo?.ico && (
                    <p className="text-xs text-muted-foreground text-center">
                      ICO musí mať minimálne 7 číslic
                    </p>
                  )}
                </div>
              )}
            </div>

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
