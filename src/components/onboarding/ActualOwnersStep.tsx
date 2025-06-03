
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { OnboardingData, ActualOwner } from "@/types/onboarding";

interface ActualOwnersStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ActualOwnersStep = ({ data, updateData }: ActualOwnersStepProps) => {
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
  };

  const removeActualOwner = (id: string) => {
    updateData({
      actualOwners: data.actualOwners.filter(owner => owner.id !== id)
    });
  };

  const updateActualOwner = (id: string, field: string, value: any) => {
    updateData({
      actualOwners: data.actualOwners.map(owner =>
        owner.id === id ? { ...owner, [field]: value } : owner
      )
    });
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Skutoční majitelia</CardTitle>
        <CardDescription className="text-slate-600">
          Koneční beneficienti spoločnosti
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.actualOwners.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            Zatiaľ neboli pridaní žiadni skutoční majitelia
          </div>
        )}

        {data.actualOwners.map((owner, index) => (
          <div key={owner.id} className="border border-slate-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-900">
                Skutočný majiteľ {index + 1}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeActualOwner(owner.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`firstName-${owner.id}`}>Meno *</Label>
                <Input
                  id={`firstName-${owner.id}`}
                  value={owner.firstName}
                  onChange={(e) => updateActualOwner(owner.id, 'firstName', e.target.value)}
                  placeholder="Zadajte meno"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`lastName-${owner.id}`}>Priezvisko *</Label>
                <Input
                  id={`lastName-${owner.id}`}
                  value={owner.lastName}
                  onChange={(e) => updateActualOwner(owner.id, 'lastName', e.target.value)}
                  placeholder="Zadajte priezvisko"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`maidenName-${owner.id}`}>Rodné priezvisko</Label>
              <Input
                id={`maidenName-${owner.id}`}
                value={owner.maidenName}
                onChange={(e) => updateActualOwner(owner.id, 'maidenName', e.target.value)}
                placeholder="Rodné priezvisko"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`birthDate-${owner.id}`}>Dátum narodenia *</Label>
                <Input
                  id={`birthDate-${owner.id}`}
                  type="date"
                  value={owner.birthDate}
                  onChange={(e) => updateActualOwner(owner.id, 'birthDate', e.target.value)}
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`birthPlace-${owner.id}`}>Miesto narodenia *</Label>
                <Input
                  id={`birthPlace-${owner.id}`}
                  value={owner.birthPlace}
                  onChange={(e) => updateActualOwner(owner.id, 'birthPlace', e.target.value)}
                  placeholder="Bratislava"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`birthNumber-${owner.id}`}>Rodné číslo *</Label>
                <Input
                  id={`birthNumber-${owner.id}`}
                  value={owner.birthNumber}
                  onChange={(e) => updateActualOwner(owner.id, 'birthNumber', e.target.value)}
                  placeholder="123456/7890"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`citizenship-${owner.id}`}>Občianstvo *</Label>
                <Input
                  id={`citizenship-${owner.id}`}
                  value={owner.citizenship}
                  onChange={(e) => updateActualOwner(owner.id, 'citizenship', e.target.value)}
                  placeholder="Slovensko"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`permanentAddress-${owner.id}`}>Trvalé bydlisko *</Label>
              <Input
                id={`permanentAddress-${owner.id}`}
                value={owner.permanentAddress}
                onChange={(e) => updateActualOwner(owner.id, 'permanentAddress', e.target.value)}
                placeholder="Hlavná 123, 010 01 Bratislava"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`isPoliticallyExposed-${owner.id}`}
                checked={owner.isPoliticallyExposed}
                onCheckedChange={(checked) => updateActualOwner(owner.id, 'isPoliticallyExposed', checked)}
              />
              <Label htmlFor={`isPoliticallyExposed-${owner.id}`}>
                Politicky exponovaná osoba
              </Label>
            </div>
          </div>
        ))}

        <Button
          onClick={addActualOwner}
          variant="outline"
          className="w-full border-dashed border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Pridať skutočného majiteľa
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActualOwnersStep;
