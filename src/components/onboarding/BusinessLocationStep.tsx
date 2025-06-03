
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingData } from "@/types/onboarding";

interface BusinessLocationStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BusinessLocationStep = ({ data, updateData }: BusinessLocationStepProps) => {
  const updateBusinessLocation = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updateData({
        businessLocation: {
          ...data.businessLocation,
          [parent]: {
            ...(data.businessLocation[parent as keyof typeof data.businessLocation] as any),
            [child]: value
          }
        }
      });
    } else {
      updateData({
        businessLocation: {
          ...data.businessLocation,
          [field]: value
        }
      });
    }
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Údaje o prevádzke obchodníka</CardTitle>
        <CardDescription className="text-slate-600">
          Informácie o mieste podnikania a obchodnej činnosti
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Názov obchodného miesta *</Label>
            <Input
              id="businessName"
              value={data.businessLocation.name}
              onChange={(e) => updateBusinessLocation('name', e.target.value)}
              placeholder="Názov predajne/prevádzky"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2 mt-8">
            <Checkbox
              id="hasPOS"
              checked={data.businessLocation.hasPOS}
              onCheckedChange={(checked) => updateBusinessLocation('hasPOS', checked)}
            />
            <Label htmlFor="hasPOS">Je na prevádzke POS?</Label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-900">Adresa prevádzky</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="businessStreet">Ulica a číslo *</Label>
              <Input
                id="businessStreet"
                value={data.businessLocation.address.street}
                onChange={(e) => updateBusinessLocation('address.street', e.target.value)}
                placeholder="Obchodná ulica 456"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessZipCode">PSČ *</Label>
              <Input
                id="businessZipCode"
                value={data.businessLocation.address.zipCode}
                onChange={(e) => updateBusinessLocation('address.zipCode', e.target.value)}
                placeholder="01001"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessCity">Mesto *</Label>
            <Input
              id="businessCity"
              value={data.businessLocation.address.city}
              onChange={(e) => updateBusinessLocation('address.city', e.target.value)}
              placeholder="Bratislava"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="iban">IBAN *</Label>
          <Input
            id="iban"
            value={data.businessLocation.iban}
            onChange={(e) => updateBusinessLocation('iban', e.target.value)}
            placeholder="SK89 1200 0000 1987 4263 7541"
            className="border-slate-300 focus:border-blue-500"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-900">Kontaktná osoba pre prevádzku</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessContactName">Meno a priezvisko *</Label>
              <Input
                id="businessContactName"
                value={data.businessLocation.contactPerson.name}
                onChange={(e) => updateBusinessLocation('contactPerson.name', e.target.value)}
                placeholder="Mária Kováčová"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessContactEmail">Email *</Label>
              <Input
                id="businessContactEmail"
                type="email"
                value={data.businessLocation.contactPerson.email}
                onChange={(e) => updateBusinessLocation('contactPerson.email', e.target.value)}
                placeholder="maria.kovacova@prevadzka.sk"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessContactPhone">Telefón *</Label>
              <Input
                id="businessContactPhone"
                value={data.businessLocation.contactPerson.phone}
                onChange={(e) => updateBusinessLocation('contactPerson.phone', e.target.value)}
                placeholder="+421 987 654 321"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="businessSector">Odbor podnikania / MCC *</Label>
            <Input
              id="businessSector"
              value={data.businessLocation.businessSector}
              onChange={(e) => updateBusinessLocation('businessSector', e.target.value)}
              placeholder="Maloobchod, reštaurácie, služby..."
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estimatedTurnover">Odhadovaný obrat (EUR) *</Label>
            <Input
              id="estimatedTurnover"
              type="number"
              value={data.businessLocation.estimatedTurnover || ''}
              onChange={(e) => updateBusinessLocation('estimatedTurnover', Number(e.target.value))}
              placeholder="50000"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="averageTransaction">Priemerná výška transakcie (EUR) *</Label>
          <Input
            id="averageTransaction"
            type="number"
            value={data.businessLocation.averageTransaction || ''}
            onChange={(e) => updateBusinessLocation('averageTransaction', Number(e.target.value))}
            placeholder="25"
            className="border-slate-300 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="openingHours">Otváracie hodiny *</Label>
          <Textarea
            id="openingHours"
            value={data.businessLocation.openingHours}
            onChange={(e) => updateBusinessLocation('openingHours', e.target.value)}
            placeholder="Po-Pia: 9:00-18:00, So: 9:00-14:00, Ne: zatvorené"
            rows={3}
            className="border-slate-300 focus:border-blue-500"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seasonality">Sezónnosť *</Label>
            <Select
              value={data.businessLocation.seasonality}
              onValueChange={(value) => updateBusinessLocation('seasonality', value)}
            >
              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                <SelectValue placeholder="Vyberte typ prevádzky" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="year-round">Celoročne</SelectItem>
                <SelectItem value="seasonal">Sezónne</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {data.businessLocation.seasonality === 'seasonal' && (
            <div className="space-y-2">
              <Label htmlFor="seasonalWeeks">Počet týždňov v sezóne</Label>
              <Input
                id="seasonalWeeks"
                type="number"
                value={data.businessLocation.seasonalWeeks || ''}
                onChange={(e) => updateBusinessLocation('seasonalWeeks', Number(e.target.value))}
                placeholder="20"
                min="1"
                max="52"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessLocationStep;
