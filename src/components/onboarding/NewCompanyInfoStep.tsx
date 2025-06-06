
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData } from "@/types/onboarding";
import { CheckCircle, User } from "lucide-react";

interface CompanyInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CompanyInfoStep = ({ data, updateData }: CompanyInfoStepProps) => {
  const updateCompanyInfo = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updateData({
        companyInfo: {
          ...data.companyInfo,
          [parent]: {
            ...(data.companyInfo[parent as keyof typeof data.companyInfo] as any),
            [child]: value
          }
        }
      });
    } else {
      updateData({
        companyInfo: {
          ...data.companyInfo,
          [field]: value
        }
      });
    }
  };

  // Check if registry type was auto-filled (simplified check)
  const isRegistryTypeAutoFilled = data.companyInfo.registryType && data.companyInfo.companyName;

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Údaje o spoločnosti</CardTitle>
        <CardDescription className="text-slate-600">
          Zadajte základné informácie o vašej spoločnosti
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ico">IČO *</Label>
            <Input
              id="ico"
              value={data.companyInfo.ico}
              onChange={(e) => updateCompanyInfo('ico', e.target.value)}
              placeholder="12345678"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dic">DIČ *</Label>
            <Input
              id="dic"
              value={data.companyInfo.dic}
              onChange={(e) => updateCompanyInfo('dic', e.target.value)}
              placeholder="SK2012345678"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        {/* VAT Payer Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isVatPayer"
              checked={data.companyInfo.isVatPayer}
              onCheckedChange={(checked) => updateCompanyInfo('isVatPayer', checked)}
            />
            <Label htmlFor="isVatPayer">Je platcom DPH</Label>
          </div>

          {data.companyInfo.isVatPayer && (
            <div className="space-y-2">
              <Label htmlFor="vatNumber">IČ DPH *</Label>
              <Input
                id="vatNumber"
                value={data.companyInfo.vatNumber}
                onChange={(e) => updateCompanyInfo('vatNumber', e.target.value)}
                placeholder="SK2012345678"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Obchodné meno spoločnosti *</Label>
          <Input
            id="companyName"
            value={data.companyInfo.companyName}
            onChange={(e) => updateCompanyInfo('companyName', e.target.value)}
            placeholder="Zadajte obchodné meno"
            className="border-slate-300 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="registryType">Typ spoločnosti *</Label>
            {isRegistryTypeAutoFilled && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>Automaticky vyplnené</span>
              </div>
            )}
          </div>
          <Select
            value={data.companyInfo.registryType}
            onValueChange={(value) => updateCompanyInfo('registryType', value)}
          >
            <SelectTrigger className={`border-slate-300 focus:border-blue-500 ${isRegistryTypeAutoFilled ? 'bg-green-50 border-green-200' : ''}`}>
              <SelectValue placeholder="Vyberte typ spoločnosti" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="Živnosť">Živnosť</SelectItem>
              <SelectItem value="S.r.o.">S.r.o.</SelectItem>
              <SelectItem value="Nezisková organizácia">Nezisková organizácia</SelectItem>
              <SelectItem value="Akciová spoločnosť">Akciová spoločnosť</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="court">Súd</Label>
            <Input
              id="court"
              value={data.companyInfo.court}
              onChange={(e) => updateCompanyInfo('court', e.target.value)}
              placeholder="Okresný súd"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="section">Oddiel</Label>
            <Input
              id="section"
              value={data.companyInfo.section}
              onChange={(e) => updateCompanyInfo('section', e.target.value)}
              placeholder="Sro"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="insertNumber">Vložka</Label>
            <Input
              id="insertNumber"
              value={data.companyInfo.insertNumber}
              onChange={(e) => updateCompanyInfo('insertNumber', e.target.value)}
              placeholder="12345/B"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-900">Sídlo spoločnosti</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="street">Ulica a číslo *</Label>
              <Input
                id="street"
                value={data.companyInfo.address.street}
                onChange={(e) => updateCompanyInfo('address.street', e.target.value)}
                placeholder="Hlavná ulica 123"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">PSČ *</Label>
              <Input
                id="zipCode"
                value={data.companyInfo.address.zipCode}
                onChange={(e) => updateCompanyInfo('address.zipCode', e.target.value)}
                placeholder="01001"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Mesto *</Label>
            <Input
              id="city"
              value={data.companyInfo.address.city}
              onChange={(e) => updateCompanyInfo('address.city', e.target.value)}
              placeholder="Bratislava"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Contact Person Info - Display Only (from Step 1) */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-slate-900">Kontaktná osoba</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              Prebraté z kroku 1
            </span>
          </div>
          
          {data.contactInfo.firstName && data.contactInfo.lastName ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Meno:</span>{" "}
                  <span className="text-slate-900">
                    {data.contactInfo.firstName} {data.contactInfo.lastName}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Email:</span>{" "}
                  <span className="text-slate-900">{data.contactInfo.email}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Telefón:</span>{" "}
                  <span className="text-slate-900">
                    {data.contactInfo.phonePrefix} {data.contactInfo.phone}
                  </span>
                </div>
                {data.contactInfo.userRole && (
                  <div>
                    <span className="font-medium text-slate-700">Pozícia:</span>{" "}
                    <span className="text-slate-900">{data.contactInfo.userRole}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                ℹ️ Tieto údaje boli prebraté z prvého kroku. Pre úpravy sa vráťte na krok "Kontaktné údaje".
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Kontaktné údaje nie sú vyplnené. Vráťte sa na krok "Kontaktné údaje" a vyplňte ich.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoStep;
