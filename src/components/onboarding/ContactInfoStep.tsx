
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingData } from "@/types/onboarding";

interface ContactInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep = ({ data, updateData }: ContactInfoStepProps) => {
  const updateContactInfo = (field: string, value: string | boolean) => {
    updateData({
      contactInfo: {
        ...data.contactInfo,
        [field]: value
      }
    });
  };

  const phonePrefixes = [
    { value: '+421', label: '+421 (Slovensko)' },
    { value: '+420', label: '+420 (Česko)' },
    { value: '+43', label: '+43 (Rakúsko)' },
    { value: '+36', label: '+36 (Maďarsko)' },
    { value: '+48', label: '+48 (Poľsko)' },
    { value: '+49', label: '+49 (Nemecko)' },
    { value: '+44', label: '+44 (Británia)' }
  ];

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Kontaktné údaje</CardTitle>
        <CardDescription className="text-slate-600">
          Zadajte vaše základné kontaktné informácie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="salutation">Oslovenie *</Label>
            <Select
              value={data.contactInfo.salutation}
              onValueChange={(value) => updateContactInfo('salutation', value)}
            >
              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                <SelectValue placeholder="Vyberte oslovenie" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="Pan">Pan</SelectItem>
                <SelectItem value="Pani">Pani</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="firstName">Meno *</Label>
            <Input
              id="firstName"
              value={data.contactInfo.firstName}
              onChange={(e) => updateContactInfo('firstName', e.target.value)}
              placeholder="Zadajte vaše meno"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Priezvisko *</Label>
            <Input
              id="lastName"
              value={data.contactInfo.lastName}
              onChange={(e) => updateContactInfo('lastName', e.target.value)}
              placeholder="Zadajte vaše priezvisko"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.contactInfo.email}
              onChange={(e) => updateContactInfo('email', e.target.value)}
              placeholder="vas.email@priklad.sk"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefón *</Label>
            <div className="flex space-x-2">
              <Select
                value={data.contactInfo.phonePrefix}
                onValueChange={(value) => updateContactInfo('phonePrefix', value)}
              >
                <SelectTrigger className="w-40 border-slate-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {phonePrefixes.map((prefix) => (
                    <SelectItem key={prefix.value} value={prefix.value}>
                      {prefix.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                value={data.contactInfo.phone}
                onChange={(e) => updateContactInfo('phone', e.target.value)}
                placeholder="123 456 789"
                className="flex-1 border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salesNote">Poznámka pre predajcov</Label>
          <Textarea
            id="salesNote"
            value={data.contactInfo.salesNote || ''}
            onChange={(e) => updateContactInfo('salesNote', e.target.value)}
            placeholder="Dodatočné informácie pre náš predajný tím..."
            rows={3}
            className="border-slate-300 focus:border-blue-500"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoStep;
