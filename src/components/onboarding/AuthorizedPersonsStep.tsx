import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Users, UserPlus, UserCheck, FileText, Fingerprint, Flag, AlertTriangle } from "lucide-react";
import { OnboardingData, AuthorizedPerson } from "@/types/onboarding";
import OnboardingInput from "./ui/OnboardingInput";
import OnboardingSelect from "./ui/OnboardingSelect";
import OnboardingSection from "./ui/OnboardingSection";
import DocumentUpload from "./ui/DocumentUpload";
import AutoFillSuggestions from "./ui/AutoFillSuggestions";
import PhoneNumberInput from "./ui/PhoneNumberInput";
import { useState } from "react";

interface AuthorizedPersonsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AuthorizedPersonsStep = ({ data, updateData }: AuthorizedPersonsStepProps) => {
  const [expandedPersonId, setExpandedPersonId] = useState<string | null>(null);

  const addAuthorizedPerson = () => {
    const newPerson: AuthorizedPerson = {
      id: Date.now().toString(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      phonePrefix: '+421', // Set default prefix
      maidenName: '',
      birthDate: '',
      birthPlace: '',
      birthNumber: '',
      permanentAddress: '',
      position: '',
      documentType: 'OP',
      documentNumber: '',
      documentValidity: '',
      documentIssuer: '',
      documentCountry: 'Slovensko',
      citizenship: 'Slovensko',
      isPoliticallyExposed: false,
      isUSCitizen: false,
      documentFrontUrl: '',
      documentBackUrl: ''
    };

    updateData({
      authorizedPersons: [...data.authorizedPersons, newPerson]
    });
    
    setExpandedPersonId(newPerson.id);
  };

  const removeAuthorizedPerson = (id: string) => {
    updateData({
      authorizedPersons: data.authorizedPersons.filter(person => person.id !== id)
    });
    if (expandedPersonId === id) {
      setExpandedPersonId(null);
    }
  };

  const updateAuthorizedPerson = (id: string, field: string, value: any) => {
    updateData({
      authorizedPersons: data.authorizedPersons.map(person =>
        person.id === id ? { ...person, [field]: value } : person
      )
    });
  };

  const togglePerson = (id: string) => {
    setExpandedPersonId(expandedPersonId === id ? null : id);
  };

  const documentTypeOptions = [
    { value: "OP", label: "Občiansky preukaz" },
    { value: "Pas", label: "Cestovný pas" }
  ];

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left sidebar */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900">Oprávnené osoby</h3>
              </div>
              
              <p className="text-sm text-blue-800">
                Oprávnené osoby sú štatutári alebo splnomocnené osoby, ktoré môžu konať v mene spoločnosti.
              </p>
              
              <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                <p className="font-medium mb-2">Dôležité informácie</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Údaje musia byť v súlade s oficiálnymi dokumentami</li>
                  <li>Pre každú oprávnenú osobu je potrebný platný doklad totožnosti</li>
                  <li>Minimálne jedna oprávnená osoba musí byť uvedená</li>
                </ul>
              </div>
              
              <div className="mt-4">
                <Button
                  onClick={addAuthorizedPerson}
                  variant="outline"
                  className="w-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Pridať osobu
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              {/* Auto-fill suggestions */}
              <AutoFillSuggestions 
                data={data} 
                updateData={updateData} 
                currentStep={5} 
              />

              {data.authorizedPersons.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">Zatiaľ žiadne oprávnené osoby</h3>
                  <p className="text-sm text-slate-500 mb-6">Pridajte aspoň jedného štatutára alebo oprávnenú osobu</p>
                  <Button 
                    onClick={addAuthorizedPerson}
                    variant="outline" 
                    className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Pridať oprávnenú osobu
                  </Button>
                </div>
              )}

              {data.authorizedPersons.map((person, index) => (
                <div key={person.id} className="mb-6 overflow-hidden border border-slate-200 rounded-lg shadow-sm bg-white">
                  <div 
                    onClick={() => togglePerson(person.id)}
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 ${
                      expandedPersonId === person.id ? 'bg-slate-50 border-b border-slate-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        person.firstName && person.lastName ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {person.firstName && person.lastName ? (
                          <UserCheck className="h-5 w-5" />
                        ) : (
                          <UserPlus className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {person.firstName && person.lastName 
                            ? `${person.firstName} ${person.lastName}`
                            : `Oprávnená osoba ${index + 1}`}
                        </h3>
                        {person.position && (
                          <p className="text-xs text-slate-500">{person.position}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAuthorizedPerson(person.id);
                        }}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors mr-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="w-6 text-slate-400 transition-transform duration-200 transform">
                        {expandedPersonId === person.id ? '▲' : '▼'}
                      </div>
                    </div>
                  </div>

                  {expandedPersonId === person.id && (
                    <div className="p-4 animate-fade-in">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <UserCheck className="h-4 w-4" />
                            Základné údaje
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <OnboardingInput
                              label="Meno *"
                              value={person.firstName}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'firstName', e.target.value)}
                              placeholder="Zadajte meno"
                            />

                            <OnboardingInput
                              label="Priezvisko *"
                              value={person.lastName}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'lastName', e.target.value)}
                              placeholder="Zadajte priezvisko"
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <OnboardingInput
                              label="Email *"
                              type="email"
                              value={person.email}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'email', e.target.value)}
                              placeholder="email@priklad.sk"
                            />

                            <PhoneNumberInput
                              label="Telefón *"
                              phoneValue={person.phone}
                              prefixValue={person.phonePrefix || '+421'}
                              onPhoneChange={(value) => updateAuthorizedPerson(person.id, 'phone', value)}
                              onPrefixChange={(value) => updateAuthorizedPerson(person.id, 'phonePrefix', value)}
                              placeholder="123 456 789"
                              required
                            />
                          </div>

                          <OnboardingInput
                            label="Rodné priezvisko"
                            value={person.maidenName}
                            onChange={(e) => updateAuthorizedPerson(person.id, 'maidenName', e.target.value)}
                            placeholder="Rodné priezvisko"
                            className="mt-4"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <Fingerprint className="h-4 w-4" />
                            Osobné údaje
                          </h4>

                          <div className="grid md:grid-cols-2 gap-4">
                            <OnboardingInput
                              label="Dátum narodenia *"
                              type="date"
                              value={person.birthDate}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'birthDate', e.target.value)}
                            />

                            <OnboardingInput
                              label="Miesto narodenia *"
                              value={person.birthPlace}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'birthPlace', e.target.value)}
                              placeholder="Bratislava"
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <OnboardingInput
                              label="Rodné číslo *"
                              value={person.birthNumber}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'birthNumber', e.target.value)}
                              placeholder="123456/7890"
                            />

                            <OnboardingInput
                              label="Funkcia *"
                              value={person.position}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'position', e.target.value)}
                              placeholder="Konateľ"
                            />
                          </div>

                          <OnboardingInput
                            label="Trvalé bydlisko *"
                            value={person.permanentAddress}
                            onChange={(e) => updateAuthorizedPerson(person.id, 'permanentAddress', e.target.value)}
                            placeholder="Hlavná 123, 010 01 Bratislava"
                            className="mt-4"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <FileText className="h-4 w-4" />
                            Doklad totožnosti
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <OnboardingSelect
                              label="Typ dokladu *"
                              value={person.documentType}
                              onValueChange={(value) => updateAuthorizedPerson(person.id, 'documentType', value)}
                              options={documentTypeOptions}
                            />

                            <OnboardingInput
                              label="Číslo dokladu *"
                              value={person.documentNumber}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'documentNumber', e.target.value)}
                              placeholder="AB123456"
                            />
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <OnboardingInput
                              label="Platnosť do *"
                              type="date"
                              value={person.documentValidity}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'documentValidity', e.target.value)}
                            />

                            <OnboardingInput
                              label="Vydal *"
                              value={person.documentIssuer}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'documentIssuer', e.target.value)}
                              placeholder="Obvodný úrad Bratislava"
                            />

                            <OnboardingInput
                              label="Štát vydania *"
                              value={person.documentCountry}
                              onChange={(e) => updateAuthorizedPerson(person.id, 'documentCountry', e.target.value)}
                              placeholder="Slovensko"
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <DocumentUpload
                              label="Predná strana dokladu *"
                              value={person.documentFrontUrl}
                              onChange={(url) => updateAuthorizedPerson(person.id, 'documentFrontUrl', url)}
                              personId={person.id}
                              documentSide="front"
                            />

                            <DocumentUpload
                              label="Zadná strana dokladu *"
                              value={person.documentBackUrl}
                              onChange={(url) => updateAuthorizedPerson(person.id, 'documentBackUrl', url)}
                              personId={person.id}
                              documentSide="back"
                            />
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <Flag className="h-4 w-4" />
                            Ďalšie informácie
                          </h4>

                          <OnboardingInput
                            label="Občianstvo *"
                            value={person.citizenship}
                            onChange={(e) => updateAuthorizedPerson(person.id, 'citizenship', e.target.value)}
                            placeholder="Slovensko"
                          />

                          <div className="mt-4 space-y-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`isPoliticallyExposed-${person.id}`}
                                checked={person.isPoliticallyExposed}
                                onCheckedChange={(checked) => updateAuthorizedPerson(person.id, 'isPoliticallyExposed', checked)}
                              />
                              <div>
                                <label htmlFor={`isPoliticallyExposed-${person.id}`} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                  Politicky exponovaná osoba
                                  {person.isPoliticallyExposed && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                                </label>
                                {person.isPoliticallyExposed && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    Politicky exponovanou osobou je osoba vo významnej verejnej funkcii.
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`isUSCitizen-${person.id}`}
                                checked={person.isUSCitizen}
                                onCheckedChange={(checked) => updateAuthorizedPerson(person.id, 'isUSCitizen', checked)}
                              />
                              <div>
                                <label htmlFor={`isUSCitizen-${person.id}`} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                  Štátny občan USA
                                  {person.isUSCitizen && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                                </label>
                                {person.isUSCitizen && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    Osoby s občianstvom USA podliehajú špeciálnym reportovacím povinnostiam.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {data.authorizedPersons.length > 0 && (
                <Button
                  onClick={addAuthorizedPerson}
                  variant="outline"
                  className="w-full border-dashed border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať ďalšiu oprávnenú osobu
                </Button>
              )}
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorizedPersonsStep;
