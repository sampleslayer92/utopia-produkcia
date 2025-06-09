
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditableSection from "./EditableSection";
import { format } from "date-fns";

interface ActualOwnersSectionProps {
  onboardingData: any;
  isEditMode: boolean;
  onSave: (data: any) => void;
}

const ActualOwnersSection = ({ onboardingData, isEditMode, onSave }: ActualOwnersSectionProps) => {
  const actualOwners = onboardingData.actualOwners || [];

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50 backdrop-blur-sm">
      <CardHeader className="border-b border-purple-200/60">
        <CardTitle className="flex items-center justify-between text-slate-900">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            Skutočný majitelia
          </div>
          {isEditMode && (
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Pridať majiteľa
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {actualOwners.length > 0 ? (
          <div className="space-y-6">
            {actualOwners.map((owner: any, index: number) => (
              <EditableSection key={owner.id || index} isEditMode={isEditMode}>
                <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-200/60 relative">
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Základné údaje */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-purple-900 border-b border-purple-200 pb-2">
                        Základné údaje
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Meno</Label>
                          {isEditMode ? (
                            <Input defaultValue={owner.firstName || ''} className="mt-1" />
                          ) : (
                            <p className="text-slate-900 mt-1">{owner.firstName}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Priezvisko</Label>
                          {isEditMode ? (
                            <Input defaultValue={owner.lastName || ''} className="mt-1" />
                          ) : (
                            <p className="text-slate-900 mt-1">{owner.lastName}</p>
                          )}
                        </div>
                      </div>

                      {owner.maidenName && (
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Rodné meno</Label>
                          {isEditMode ? (
                            <Input defaultValue={owner.maidenName || ''} className="mt-1" />
                          ) : (
                            <p className="text-slate-900 mt-1">{owner.maidenName}</p>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Dátum narodenia</Label>
                          {isEditMode ? (
                            <Input type="date" defaultValue={owner.birthDate || ''} className="mt-1" />
                          ) : (
                            <p className="text-slate-900 mt-1">
                              {owner.birthDate ? format(new Date(owner.birthDate), 'dd.MM.yyyy') : 'Neuvedené'}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Miesto narodenia</Label>
                          {isEditMode ? (
                            <Input defaultValue={owner.birthPlace || ''} className="mt-1" />
                          ) : (
                            <p className="text-slate-900 mt-1">{owner.birthPlace || 'Neuvedené'}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600">Rodné číslo</Label>
                        {isEditMode ? (
                          <Input defaultValue={owner.birthNumber || ''} className="mt-1" />
                        ) : (
                          <p className="text-slate-900 mt-1 font-mono">{owner.birthNumber || 'Neuvedené'}</p>
                        )}
                      </div>
                    </div>

                    {/* Dodatočné údaje */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-purple-900 border-b border-purple-200 pb-2">
                        Dodatočné údaje
                      </h4>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Štátna príslušnosť</Label>
                        {isEditMode ? (
                          <Input defaultValue={owner.citizenship || ''} className="mt-1" />
                        ) : (
                          <p className="text-slate-900 mt-1">{owner.citizenship || 'Neuvedené'}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600">Adresa trvalého pobytu</Label>
                        {isEditMode ? (
                          <Input defaultValue={owner.permanentAddress || ''} className="mt-1" />
                        ) : (
                          <p className="text-slate-900 mt-1">{owner.permanentAddress || 'Neuvedené'}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600">Politicky exponovaná osoba</Label>
                        <div className="mt-2">
                          {owner.isPoliticallyExposed ? (
                            <Badge className="bg-red-100 text-red-700 border-red-200">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Áno - PEP
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Nie
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </EditableSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Žiadni skutočný majitelia neboli zadaní</p>
            {isEditMode && (
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Pridať prvého majiteľa
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActualOwnersSection;
