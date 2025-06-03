
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { OnboardingData, AuthorizedPerson } from "@/types/onboarding";

interface AuthorizedPersonsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AuthorizedPersonsStep = ({ data, updateData }: AuthorizedPersonsStepProps) => {
  const addAuthorizedPerson = () => {
    const newPerson: AuthorizedPerson = {
      id: Date.now().toString(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
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
      isUSCitizen: false
    };

    updateData({
      authorizedPersons: [...data.authorizedPersons, newPerson]
    });
  };

  const removeAuthorizedPerson = (id: string) => {
    updateData({
      authorizedPersons: data.authorizedPersons.filter(person => person.id !== id)
    });
  };

  const updateAuthorizedPerson = (id: string, field: string, value: any) => {
    updateData({
      authorizedPersons: data.authorizedPersons.map(person =>
        person.id === id ? { ...person, [field]: value } : person
      )
    });
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Oprávnené osoby</CardTitle>
        <CardDescription className="text-slate-600">
          Osoby oprávnené konať v mene spoločnosti
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.authorizedPersons.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            Zatiaľ neboli pridané žiadne oprávnené osoby
          </div>
        )}

        {data.authorizedPersons.map((person, index) => (
          <div key={person.id} className="border border-slate-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-900">
                Oprávnená osoba {index + 1}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeAuthorizedPerson(person.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`firstName-${person.id}`}>Meno *</Label>
                <Input
                  id={`firstName-${person.id}`}
                  value={person.firstName}
                  onChange={(e) => updateAuthorizedPerson(person.id, 'firstName', e.target.value)}
                  placeholder="Zadajte meno"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`lastName-${person.id}`}>Priezvisko *</Label>
                <Input
                  id={`lastName-${person.id}`}
                  value={person.lastName}
                  onChange={(e) => updateAuthorizedPerson(person.id, 'lastName', e.target.value)}
                  placeholder="Zadajte priezvisko"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`email-${person.id}`}>Email *</Label>
                <Input
                  id={`email-${person.id}`}
                  type="email"
                  value={person.email}
                  onChange={(e) => updateAuthorizedPerson(person.id, 'email', e.target.value)}
                  placeholder="email@priklad.sk"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`phone-${person.id}`}>Telefón *</Label>
                <Input
                  id={`phone-${person.id}`}
                  value={person.phone}
                  onChange={(e) => updateAuthorizedPerson(person.id, 'phone', e.target.value)}
                  placeholder="+421 123 456 789"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`maidenName-${person.id}`}>Rodné priezvisko</Label>
              <Input
                id={`maidenName-${person.id}`}
                value={person.maidenName}
                onChange={(e) => updateAuthorizedPerson(person.id, 'maidenName', e.target.value)}
                placeholder="Rodné priezvisko"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`birthDate-${person.id}`}>Dátum narodenia *</Label>
                <Input
                  id={`birthDate-${person.id}`}
                  type="date"
                  value={person.birthDate}
                  onChange={(e) => updateAuthorizedPerson(person.id, 'birthDate', e.target.value)}
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`birthPlace-${person.id}`}>Miesto narodenia *</Label>
                <Input
                  id={`birthPlace-${person.id}`}
                  value={person.birthPlace}
                  onChange={(e) => updateAuthorizedPerson(person.id, 'birthPlace', e.target.value)}
                  placeholder="Bratislava"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`birthNumber-${person.id}`}>Rodné číslo *</Label>
                <Input
                  id={`birthNumber-${person.id}`}
                  value={person.birthNumber}
                  onChange={(e) => updateAuthorizedPerson(person.id, 'birthNumber', e.target.value)}
                  placeholder="123456/7890"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`position-${person.id}`}>Funkcia *</Label>
                <Input
                  id={`position-${person.id}`}
                  value={person.position}
                  onChange={(e) => updateAuthorizedPerson(person.id, 'position', e.target.value)}
                  placeholder="Konateľ"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`permanentAddress-${person.id}`}>Trvalé bydlisko *</Label>
              <Input
                id={`permanentAddress-${person.id}`}
                value={person.permanentAddress}
                onChange={(e) => updateAuthorizedPerson(person.id, 'permanentAddress', e.target.value)}
                placeholder="Hlavná 123, 010 01 Bratislava"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Doklad totožnosti</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`documentType-${person.id}`}>Typ dokladu *</Label>
                  <Select
                    value={person.documentType}
                    onValueChange={(value) => updateAuthorizedPerson(person.id, 'documentType', value as 'OP' | 'Pas')}
                  >
                    <SelectTrigger className="border-slate-300 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="OP">Občiansky preukaz</SelectItem>
                      <SelectItem value="Pas">Cestovný pas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`documentNumber-${person.id}`}>Číslo dokladu *</Label>
                  <Input
                    id={`documentNumber-${person.id}`}
                    value={person.documentNumber}
                    onChange={(e) => updateAuthorizedPerson(person.id, 'documentNumber', e.target.value)}
                    placeholder="AB123456"
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`documentValidity-${person.id}`}>Platnosť do *</Label>
                  <Input
                    id={`documentValidity-${person.id}`}
                    type="date"
                    value={person.documentValidity}
                    onChange={(e) => updateAuthorizedPerson(person.id, 'documentValidity', e.target.value)}
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`documentIssuer-${person.id}`}>Vydal *</Label>
                  <Input
                    id={`documentIssuer-${person.id}`}
                    value={person.documentIssuer}
                    onChange={(e) => updateAuthorizedPerson(person.id, 'documentIssuer', e.target.value)}
                    placeholder="Obvodný úrad Bratislava"
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`documentCountry-${person.id}`}>Štát vydania *</Label>
                  <Input
                    id={`documentCountry-${person.id}`}
                    value={person.documentCountry}
                    onChange={(e) => updateAuthorizedPerson(person.id, 'documentCountry', e.target.value)}
                    placeholder="Slovensko"
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`citizenship-${person.id}`}>Občianstvo *</Label>
              <Input
                id={`citizenship-${person.id}`}
                value={person.citizenship}
                onChange={(e) => updateAuthorizedPerson(person.id, 'citizenship', e.target.value)}
                placeholder="Slovensko"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`isPoliticallyExposed-${person.id}`}
                  checked={person.isPoliticallyExposed}
                  onCheckedChange={(checked) => updateAuthorizedPerson(person.id, 'isPoliticallyExposed', checked)}
                />
                <Label htmlFor={`isPoliticallyExposed-${person.id}`}>
                  Politicky exponovaná osoba
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`isUSCitizen-${person.id}`}
                  checked={person.isUSCitizen}
                  onCheckedChange={(checked) => updateAuthorizedPerson(person.id, 'isUSCitizen', checked)}
                />
                <Label htmlFor={`isUSCitizen-${person.id}`}>
                  Štátny občan USA
                </Label>
              </div>
            </div>
          </div>
        ))}

        <Button
          onClick={addAuthorizedPerson}
          variant="outline"
          className="w-full border-dashed border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Pridať oprávnenú osobu
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthorizedPersonsStep;
