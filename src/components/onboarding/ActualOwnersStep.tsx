
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Users2, UserPlus, Fingerprint, Flag, AlertTriangle } from "lucide-react";
import { OnboardingData, ActualOwner } from "@/types/onboarding";
import OnboardingInput from "./ui/OnboardingInput";
import OnboardingSection from "./ui/OnboardingSection";
import { useState } from "react";

interface ActualOwnersStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ActualOwnersStep = ({ data, updateData }: ActualOwnersStepProps) => {
  const [expandedOwnerId, setExpandedOwnerId] = useState<string | null>(null);

  const addActualOwner = () => {
    const newOwner: ActualOwner = {
      id: Date.now().toString(),
      firstName: '',
      lastName: '',
      maidenName: '',
      birthDate: '',
      birthPlace: '',
      birthNumber: '',
      citizenship: 'Slovensko',
      permanentAddress: '',
      isPoliticallyExposed: false
    };

    updateData({
      actualOwners: [...data.actualOwners, newOwner]
    });
    
    // Automatically expand the new owner
    setExpandedOwnerId(newOwner.id);
  };

  const removeActualOwner = (id: string) => {
    updateData({
      actualOwners: data.actualOwners.filter(owner => owner.id !== id)
    });
    if (expandedOwnerId === id) {
      setExpandedOwnerId(null);
    }
  };

  const updateActualOwner = (id: string, field: string, value: any) => {
    updateData({
      actualOwners: data.actualOwners.map(owner =>
        owner.id === id ? { ...owner, [field]: value } : owner
      )
    });
  };

  const toggleOwner = (id: string) => {
    setExpandedOwnerId(expandedOwnerId === id ? null : id);
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left sidebar */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Users2 className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-medium text-amber-900">Skutoční majitelia</h3>
              </div>
              
              <p className="text-sm text-amber-800">
                Skutoční majitelia sú fyzické osoby, ktoré skutočne vlastnia alebo kontrolujú spoločnosť.
              </p>
              
              <div className="bg-amber-100/50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800">
                <p className="font-medium mb-2">Kto je skutočný majiteľ?</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Osoba, ktorá má priamy alebo nepriamy podiel najmenej 25%</li>
                  <li>Osoba, ktorá má právo vymenovať alebo odvolať štatutárny orgán</li>
                  <li>Osoba, ktorá iným spôsobom kontroluje spoločnosť</li>
                </ul>
              </div>
              
              <div className="mt-4">
                <Button
                  onClick={addActualOwner}
                  variant="outline"
                  className="w-full border-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50 text-amber-700 flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Pridať majiteľa
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              {data.actualOwners.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                  <Users2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">Zatiaľ žiadni skutoční majitelia</h3>
                  <p className="text-sm text-slate-500 mb-6">Pridajte aspoň jedného konečného užívateľa výhod</p>
                  <Button 
                    onClick={addActualOwner}
                    variant="outline" 
                    className="border-amber-200 hover:border-amber-300 hover:bg-amber-50 text-amber-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Pridať skutočného majiteľa
                  </Button>
                </div>
              )}

              {data.actualOwners.map((owner, index) => (
                <div key={owner.id} className="mb-6 overflow-hidden border border-slate-200 rounded-lg shadow-sm bg-white">
                  <div 
                    onClick={() => toggleOwner(owner.id)}
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 ${
                      expandedOwnerId === owner.id ? 'bg-slate-50 border-b border-slate-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        owner.firstName && owner.lastName ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Users2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {owner.firstName && owner.lastName 
                            ? `${owner.firstName} ${owner.lastName}`
                            : `Skutočný majiteľ ${index + 1}`}
                        </h3>
                        {owner.birthDate && (
                          <p className="text-xs text-slate-500">Narodený/á: {owner.birthDate}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeActualOwner(owner.id);
                        }}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors mr-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="w-6 text-slate-400 transition-transform duration-200 transform">
                        {expandedOwnerId === owner.id ? '▲' : '▼'}
                      </div>
                    </div>
                  </div>

                  {expandedOwnerId === owner.id && (
                    <div className="p-4 animate-fade-in">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-amber-700 flex items-center gap-2 mb-4">
                            <Users2 className="h-4 w-4" />
                            Základné údaje
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <OnboardingInput
                              label="Meno *"
                              value={owner.firstName}
                              onChange={(e) => updateActualOwner(owner.id, 'firstName', e.target.value)}
                              placeholder="Zadajte meno"
                            />

                            <OnboardingInput
                              label="Priezvisko *"
                              value={owner.lastName}
                              onChange={(e) => updateActualOwner(owner.id, 'lastName', e.target.value)}
                              placeholder="Zadajte priezvisko"
                            />
                          </div>

                          <OnboardingInput
                            label="Rodné priezvisko"
                            value={owner.maidenName}
                            onChange={(e) => updateActualOwner(owner.id, 'maidenName', e.target.value)}
                            placeholder="Rodné priezvisko"
                            className="mt-4"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-amber-700 flex items-center gap-2 mb-4">
                            <Fingerprint className="h-4 w-4" />
                            Osobné údaje
                          </h4>

                          <div className="grid md:grid-cols-2 gap-4">
                            <OnboardingInput
                              label="Dátum narodenia *"
                              type="date"
                              value={owner.birthDate}
                              onChange={(e) => updateActualOwner(owner.id, 'birthDate', e.target.value)}
                            />

                            <OnboardingInput
                              label="Miesto narodenia *"
                              value={owner.birthPlace}
                              onChange={(e) => updateActualOwner(owner.id, 'birthPlace', e.target.value)}
                              placeholder="Bratislava"
                            />
                          </div>

                          <OnboardingInput
                            label="Rodné číslo *"
                            value={owner.birthNumber}
                            onChange={(e) => updateActualOwner(owner.id, 'birthNumber', e.target.value)}
                            placeholder="123456/7890"
                            className="mt-4"
                          />

                          <OnboardingInput
                            label="Trvalé bydlisko *"
                            value={owner.permanentAddress}
                            onChange={(e) => updateActualOwner(owner.id, 'permanentAddress', e.target.value)}
                            placeholder="Hlavná 123, 010 01 Bratislava"
                            className="mt-4"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-amber-700 flex items-center gap-2 mb-4">
                            <Flag className="h-4 w-4" />
                            Ďalšie informácie
                          </h4>

                          <OnboardingInput
                            label="Občianstvo *"
                            value={owner.citizenship}
                            onChange={(e) => updateActualOwner(owner.id, 'citizenship', e.target.value)}
                            placeholder="Slovensko"
                          />

                          <div className="flex items-center space-x-2 mt-4">
                            <Checkbox
                              id={`isPoliticallyExposed-${owner.id}`}
                              checked={owner.isPoliticallyExposed}
                              onCheckedChange={(checked) => updateActualOwner(owner.id, 'isPoliticallyExposed', checked)}
                            />
                            <div>
                              <label htmlFor={`isPoliticallyExposed-${owner.id}`} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                Politicky exponovaná osoba
                                {owner.isPoliticallyExposed && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                              </label>
                              {owner.isPoliticallyExposed && (
                                <p className="text-xs text-slate-500 mt-1">
                                  Politicky exponovanou osobou je osoba vo významnej verejnej funkcii.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {data.actualOwners.length > 0 && (
                <Button
                  onClick={addActualOwner}
                  variant="outline"
                  className="w-full border-dashed border-2 border-slate-300 hover:border-amber-500 hover:bg-amber-50 mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať ďalšieho skutočného majiteľa
                </Button>
              )}
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActualOwnersStep;
