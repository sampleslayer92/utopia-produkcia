
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingData } from "@/types";

interface CompanyInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CompanyInfoStep = ({ data, updateData }: CompanyInfoStepProps) => {
  const handleInputChange = (field: string, value: string) => {
    updateData({
      company: {
        ...data.company,
        [field]: value
      }
    });
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Informácie o spoločnosti</CardTitle>
        <CardDescription className="text-slate-600">
          Poskytnite nám základné informácie o vašej spoločnosti pre spustenie platobného spracovania
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Právny názov spoločnosti *</Label>
            <Input
              id="companyName"
              value={data.company.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Zadajte právny názov spoločnosti"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ein">IČO (Identifikačné číslo) *</Label>
            <Input
              id="ein"
              value={data.company.ein || ''}
              onChange={(e) => handleInputChange('ein', e.target.value)}
              placeholder="12345678"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dba">Obchodný názov</Label>
            <Input
              id="dba"
              value={data.company.dba || ''}
              onChange={(e) => handleInputChange('dba', e.target.value)}
              placeholder="Ak sa líši od právneho názvu"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Webová stránka</Label>
            <Input
              id="website"
              value={data.company.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://www.priklad.sk"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="industry">Odvetvie *</Label>
            <Select
              value={data.company.industry || ''}
              onValueChange={(value) => handleInputChange('industry', value)}
            >
              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                <SelectValue placeholder="Vyberte vaše odvetvie" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="retail">Maloobchod</SelectItem>
                <SelectItem value="restaurant">Reštaurácie</SelectItem>
                <SelectItem value="healthcare">Zdravotníctvo</SelectItem>
                <SelectItem value="automotive">Automobilový priemysel</SelectItem>
                <SelectItem value="professional_services">Profesionálne služby</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="non_profit">Nezisková organizácia</SelectItem>
                <SelectItem value="other">Iné</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessType">Typ spoločnosti *</Label>
            <Select
              value={data.company.businessType || ''}
              onValueChange={(value) => handleInputChange('businessType', value)}
            >
              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                <SelectValue placeholder="Vyberte typ spoločnosti" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="corporation">Akciová spoločnosť</SelectItem>
                <SelectItem value="llc">Spoločnosť s ručením obmedzeným</SelectItem>
                <SelectItem value="partnership">Spoločnosť</SelectItem>
                <SelectItem value="sole_proprietorship">Fyzická osoba</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearEstablished">Rok založenia *</Label>
          <Input
            id="yearEstablished"
            type="number"
            value={data.company.yearEstablished || ''}
            onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
            placeholder="YYYY"
            min="1900"
            max={new Date().getFullYear()}
            className="border-slate-300 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Popis podnikania</Label>
          <Textarea
            id="description"
            value={data.company.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Stručne opíšte vaše podnikanie a čo predávate..."
            rows={4}
            className="border-slate-300 focus:border-blue-500"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoStep;
