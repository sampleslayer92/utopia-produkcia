
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";

interface DeviceSelectionStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DeviceSelectionStep = ({ data, updateData }: DeviceSelectionStepProps) => {
  const updateDeviceSelection = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updateData({
        deviceSelection: {
          ...data.deviceSelection,
          [parent]: {
            ...(data.deviceSelection[parent as keyof typeof data.deviceSelection] as any),
            [child]: value
          }
        }
      });
    } else {
      updateData({
        deviceSelection: {
          ...data.deviceSelection,
          [field]: value
        }
      });
    }
  };

  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = data.deviceSelection[field as keyof typeof data.deviceSelection] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateDeviceSelection(field, newArray);
  };

  return (
    <div className="space-y-6">
      {/* Terminály */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Platobné terminály</CardTitle>
          <CardDescription className="text-slate-600">
            Vyberte si potrebné platobné terminály
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PAX A920 PRO */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                <span className="text-xs text-slate-500">A920 PRO</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">PAX A920 PRO</h3>
                <p className="text-sm text-slate-600 mb-2">Mobilný terminál</p>
                <p className="text-xs text-slate-500 mb-3">
                  Vhodné pre: bary, trhy, kuriéri • Prepojenie s pokladňou: Podporované • 
                  Zdroj: Batéria • Pripojenie: SIM, WiFi, Ethernet (s dockom) • 
                  Displej: Farebný dotykový • Pinpad: Nie je možné pripojiť
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paxA920Count">Počet ks</Label>
                    <Input
                      id="paxA920Count"
                      type="number"
                      min="0"
                      value={data.deviceSelection.terminals.paxA920Pro.count}
                      onChange={(e) => updateDeviceSelection('terminals.paxA920Pro.count', parseInt(e.target.value) || 0)}
                      className="border-slate-300 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paxA920Fee">Mesačný poplatok (EUR)</Label>
                    <Input
                      id="paxA920Fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.deviceSelection.terminals.paxA920Pro.monthlyFee}
                      onChange={(e) => updateDeviceSelection('terminals.paxA920Pro.monthlyFee', parseFloat(e.target.value) || 0)}
                      className="border-slate-300 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paxA920Sim">SIM karty (2€/ks/mesiac)</Label>
                    <Input
                      id="paxA920Sim"
                      type="number"
                      min="0"
                      value={data.deviceSelection.terminals.paxA920Pro.simCards}
                      onChange={(e) => updateDeviceSelection('terminals.paxA920Pro.simCards', parseInt(e.target.value) || 0)}
                      className="border-slate-300 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAX A80 */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                <span className="text-xs text-slate-500">A80</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">PAX A80</h3>
                <p className="text-sm text-slate-600 mb-2">Stacionárny terminál</p>
                <p className="text-xs text-slate-500 mb-3">
                  Vhodné pre: predajne, salóny, kancelárie • Prepojenie s pokladňou: Podporované • 
                  Zdroj: Elektrická sieť • Pripojenie: Ethernet • 
                  Displej: Farebný dotykový • Pinpad: Možné pripojiť
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paxA80Count">Počet ks</Label>
                    <Input
                      id="paxA80Count"
                      type="number"
                      min="0"
                      value={data.deviceSelection.terminals.paxA80.count}
                      onChange={(e) => updateDeviceSelection('terminals.paxA80.count', parseInt(e.target.value) || 0)}
                      className="border-slate-300 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paxA80Fee">Mesačný poplatok (EUR)</Label>
                    <Input
                      id="paxA80Fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.deviceSelection.terminals.paxA80.monthlyFee}
                      onChange={(e) => updateDeviceSelection('terminals.paxA80.monthlyFee', parseFloat(e.target.value) || 0)}
                      className="border-slate-300 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tablety */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Tablety a pokladničné systémy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tablet 10" */}
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Tablet 10"</Label>
              <Input
                type="number"
                min="0"
                placeholder="Počet ks"
                value={data.deviceSelection.tablets.tablet10.count}
                onChange={(e) => updateDeviceSelection('tablets.tablet10.count', parseInt(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label>Mesačný poplatok (EUR)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={data.deviceSelection.tablets.tablet10.monthlyFee}
                onChange={(e) => updateDeviceSelection('tablets.tablet10.monthlyFee', parseFloat(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tablet 15" */}
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Tablet 15"</Label>
              <Input
                type="number"
                min="0"
                placeholder="Počet ks"
                value={data.deviceSelection.tablets.tablet15.count}
                onChange={(e) => updateDeviceSelection('tablets.tablet15.count', parseInt(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label>Mesačný poplatok (EUR)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={data.deviceSelection.tablets.tablet15.monthlyFee}
                onChange={(e) => updateDeviceSelection('tablets.tablet15.monthlyFee', parseFloat(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tablet Pro 15" */}
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Tablet Pro 15"</Label>
              <Input
                type="number"
                min="0"
                placeholder="Počet ks"
                value={data.deviceSelection.tablets.tabletPro15.count}
                onChange={(e) => updateDeviceSelection('tablets.tabletPro15.count', parseInt(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label>Mesačný poplatok (EUR)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={data.deviceSelection.tablets.tabletPro15.monthlyFee}
                onChange={(e) => updateDeviceSelection('tablets.tabletPro15.monthlyFee', parseFloat(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Softvérové licencie */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Softvérové licencie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {['VRP', 'VRP DRIVER', 'EASY KASA', '3K POS LICENCIA', 'CHDÚ'].map((license) => (
              <div key={license} className="flex items-center space-x-2">
                <Checkbox
                  id={license}
                  checked={data.deviceSelection.softwareLicenses.includes(license)}
                  onCheckedChange={() => toggleArrayItem('softwareLicenses', license)}
                />
                <Label htmlFor={license}>{license}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Príslušenstvo */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Príslušenstvo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              'CHDÚ', 'SIM karta', 'Bonovacia tlačiareň', 'Dokovacia stanica (nabíjanie)',
              'Dokovacia stanica + periférie', 'Kryt PAX', 'Router ASUS',
              'Peňažná zásuvka – malá', 'Peňažná zásuvka – veľká', 'PORTOS CHDÚ', 'PORTOS tlačiareň'
            ].map((accessory) => (
              <div key={accessory} className="flex items-center space-x-2">
                <Checkbox
                  id={accessory}
                  checked={data.deviceSelection.accessories.includes(accessory)}
                  onCheckedChange={() => toggleArrayItem('accessories', accessory)}
                />
                <Label htmlFor={accessory}>{accessory}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* E-commerce */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">E-commerce</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {['GP WebPay', 'GP TOM'].map((ecom) => (
                <div key={ecom} className="flex items-center space-x-2">
                  <Checkbox
                    id={ecom}
                    checked={data.deviceSelection.ecommerce.includes(ecom)}
                    onCheckedChange={() => toggleArrayItem('ecommerce', ecom)}
                  />
                  <Label htmlFor={ecom}>{ecom}</Label>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherEcommerce">Iné</Label>
              <Input
                id="otherEcommerce"
                placeholder="Špecifikujte iné e-commerce riešenia"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technický servis */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Technický servis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              'Inštalácia osobne', 'Inštalácia diaľkovo', 'Zaškolenie osobne', 'Zaškolenie diaľkovo',
              'Import PLU', 'Prepojenie na externý software', 'Telefónická podpora (17:00 – 22:00 + víkendy)'
            ].map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={data.deviceSelection.technicalService.includes(service)}
                  onCheckedChange={() => toggleArrayItem('technicalService', service)}
                />
                <Label htmlFor={service}>{service}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MIF++ poplatky */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">MIF++ poplatky</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="regulatedCards">Regulované karty (%)</Label>
              <Input
                id="regulatedCards"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={data.deviceSelection.mifFees.regulatedCards}
                onChange={(e) => updateDeviceSelection('mifFees.regulatedCards', parseFloat(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unregulatedCards">Neregulované karty (%)</Label>
              <Input
                id="unregulatedCards"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={data.deviceSelection.mifFees.unregulatedCards}
                onChange={(e) => updateDeviceSelection('mifFees.unregulatedCards', parseFloat(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dccRabat">DCC Rabat (%)</Label>
              <Input
                id="dccRabat"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={data.deviceSelection.mifFees.dccRabat}
                onChange={(e) => updateDeviceSelection('mifFees.dccRabat', parseFloat(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typy transakcií */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Typy transakcií</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              'Sprepitné', 'Manuálny vstup', 'Dynamic Currency Conversion',
              'Predautorizácia', 'Cashback', 'Referenčné číslo / JIP'
            ].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={data.deviceSelection.transactionTypes.includes(type)}
                  onCheckedChange={() => toggleArrayItem('transactionTypes', type)}
                />
                <Label htmlFor={type}>{type}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Poznámka */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Poznámka</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Dodatočné poznámky k výberu zariadení a služieb..."
            value={data.deviceSelection.note}
            onChange={(e) => updateDeviceSelection('note', e.target.value)}
            rows={3}
            className="border-slate-300 focus:border-blue-500"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceSelectionStep;
