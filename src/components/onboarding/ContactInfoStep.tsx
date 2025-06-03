
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
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
    { value: '+421', label: '+421', country: '🇸🇰 Slovensko' },
    { value: '+420', label: '+420', country: '🇨🇿 Česko' },
    { value: '+43', label: '+43', country: '🇦🇹 Rakúsko' },
    { value: '+36', label: '+36', country: '🇭🇺 Maďarsko' },
    { value: '+48', label: '+48', country: '🇵🇱 Poľsko' },
    { value: '+49', label: '+49', country: '🇩🇪 Nemecko' },
    { value: '+44', label: '+44', country: '🇬🇧 Británia' }
  ];

  const formatPhoneNumber = (value: string, prefix: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format based on country prefix
    if (prefix === '+421' || prefix === '+420') {
      // Slovak/Czech format: XXX XXX XXX
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3').slice(0, 11);
    }
    // Default format for other countries
    return cleaned.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1 $2 $3').slice(0, 13);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value, data.contactInfo.phonePrefix);
    updateContactInfo('phone', formatted);
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Modern Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Kto ste a ako vás môžeme kontaktovať?
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Tieto údaje nám pomôžu vás kontaktovať a bezpečne dokončiť onboarding.
        </p>
      </div>

      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardContent className="p-8 space-y-8">
          {/* Row 1: Personal Identity Block */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">Osobné údaje</Label>
            <div className="bg-slate-50/50 rounded-xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-32">
                  <Label htmlFor="salutation" className="text-sm text-slate-600 mb-2 block">Oslovenie *</Label>
                  <Select
                    value={data.contactInfo.salutation}
                    onValueChange={(value) => updateContactInfo('salutation', value)}
                  >
                    <SelectTrigger className="h-12 border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                      <SelectValue placeholder="Vyberte" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="Pan">Pan</SelectItem>
                      <SelectItem value="Pani">Pani</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="firstName" className="text-sm text-slate-600 mb-2 block">Meno *</Label>
                  <Input
                    id="firstName"
                    value={data.contactInfo.firstName}
                    onChange={(e) => updateContactInfo('firstName', e.target.value)}
                    placeholder="Zadajte vaše meno"
                    className="h-12 border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="lastName" className="text-sm text-slate-600 mb-2 block">Priezvisko *</Label>
                  <Input
                    id="lastName"
                    value={data.contactInfo.lastName}
                    onChange={(e) => updateContactInfo('lastName', e.target.value)}
                    placeholder="Zadajte vaše priezvisko"
                    className="h-12 border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Email Communication */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">Emailová komunikácia</Label>
            <div className="bg-slate-50/50 rounded-xl p-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-slate-600">Email *</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={data.contactInfo.email}
                    onChange={(e) => updateContactInfo('email', e.target.value)}
                    placeholder="vas.email@priklad.sk"
                    className={`h-12 border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${
                      data.contactInfo.email && !isEmailValid(data.contactInfo.email) 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : ''
                    }`}
                  />
                  {data.contactInfo.email && !isEmailValid(data.contactInfo.email) && (
                    <p className="text-sm text-red-600 mt-1">Zadajte platnú emailovú adresu</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Phone Contact Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">Telefónny kontakt</Label>
            <div className="bg-slate-50/50 rounded-xl p-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-slate-600">Telefón *</Label>
                <div className="flex gap-3">
                  <Select
                    value={data.contactInfo.phonePrefix}
                    onValueChange={(value) => updateContactInfo('phonePrefix', value)}
                  >
                    <SelectTrigger className="w-44 h-12 border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      {phonePrefixes.map((prefix) => (
                        <SelectItem key={prefix.value} value={prefix.value}>
                          <span className="flex items-center gap-2">
                            <span className="font-mono">{prefix.label}</span>
                            <span className="text-sm text-slate-500">{prefix.country}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    value={data.contactInfo.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="123 456 789"
                    className="flex-1 h-12 border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Optional Sales Note */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-slate-700">Dodatočné informácie</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 text-white p-3 rounded-lg">
                    <p>Nepovinné – môžete nám napísať dodatočné info alebo preferencie</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="bg-slate-50/50 rounded-xl p-6">
              <Textarea
                id="salesNote"
                value={data.contactInfo.salesNote || ''}
                onChange={(e) => updateContactInfo('salesNote', e.target.value)}
                placeholder="Napríklad: Najlepší čas na kontakt, preferovaný spôsob komunikácie, alebo iné poznámky pre náš tím..."
                rows={4}
                className="border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfoStep;
