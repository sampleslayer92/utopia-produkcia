
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus } from "lucide-react";
import { format } from "date-fns";
import EditableSection from "./EditableSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthorizedPersonsSectionProps {
  onboardingData: any;
  isEditMode: boolean;
  onSave: (data: any) => void;
}

const AuthorizedPersonsSection = ({ onboardingData, isEditMode, onSave }: AuthorizedPersonsSectionProps) => {
  const authorizedPersons = onboardingData.authorizedPersons || [];

  const getDocumentTypeBadge = (docType: string) => {
    switch (docType) {
      case 'id_card':
        return <Badge variant="outline">Občiansky preukaz</Badge>;
      case 'passport':
        return <Badge variant="outline">Pas</Badge>;
      case 'driving_license':
        return <Badge variant="outline">Vodičský preukaz</Badge>;
      default:
        return <Badge variant="outline">{docType}</Badge>;
    }
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-900">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-600" />
            Oprávnené osoby
          </div>
          {isEditMode && (
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Pridať osobu
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {authorizedPersons.length > 0 ? (
          authorizedPersons.map((person: any, index: number) => (
            <EditableSection key={index} isEditMode={isEditMode}>
              <div className="p-6 bg-slate-50/50 rounded-lg border border-slate-200">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-slate-900">Osobné údaje</h5>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Meno</Label>
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
                        <Label className="text-sm font-medium text-slate-600">Priezvisko</Label>
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
                      <Label className="text-sm font-medium text-slate-600">Pozícia</Label>
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
                        <Label className="text-sm font-medium text-slate-600">Email</Label>
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
                        <Label className="text-sm font-medium text-slate-600">Telefón</Label>
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
                      <Label className="text-sm font-medium text-slate-600">Adresa trvalého pobytu</Label>
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
                    <h5 className="font-medium text-slate-900">Doklad totožnosti</h5>
                    
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Typ dokladu</Label>
                      <div className="mt-1">
                        {getDocumentTypeBadge(person.documentType)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Číslo dokladu</Label>
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
                        <Label className="text-sm font-medium text-slate-600">Platnosť do</Label>
                        {isEditMode ? (
                          <Input 
                            type="date"
                            defaultValue={person.documentValidity || ''} 
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1">
                            {person.documentValidity ? format(new Date(person.documentValidity), 'dd.MM.yyyy') : 'Neuvedené'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">Vydavateľ</Label>
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
                        <Label className="text-sm font-medium text-slate-600">Dátum narodenia</Label>
                        {isEditMode ? (
                          <Input 
                            type="date"
                            defaultValue={person.birthDate || ''} 
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1">
                            {person.birthDate ? format(new Date(person.birthDate), 'dd.MM.yyyy') : 'Neuvedené'}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Štátna príslušnosť</Label>
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
                          <Badge variant="destructive">PEP osoba</Badge>
                        )}
                        {person.isUsCitizen && (
                          <Badge variant="outline">US občan</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isEditMode && (
                  <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Odstrániť osobu
                    </Button>
                  </div>
                )}
              </div>
            </EditableSection>
          ))
        ) : (
          <p className="text-slate-600 text-center py-8">
            Žiadne oprávnené osoby neboli zadané
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthorizedPersonsSection;
