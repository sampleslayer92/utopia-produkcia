import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Check, Mail, Phone } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import { useState, useEffect } from "react";

interface ContactInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep = ({ data, updateData }: ContactInfoStepProps) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());

  const updateContactInfo = (field: string, value: string | boolean) => {
    updateData({
      contactInfo: {
        ...data.contactInfo,
        [field]: value
      }
    });
  };

  // Track completed fields for progressive disclosure
  useEffect(() => {
    const newCompleted = new Set<string>();
    if (data.contactInfo.salutation) newCompleted.add('salutation');
    if (data.contactInfo.firstName) newCompleted.add('firstName');
    if (data.contactInfo.lastName) newCompleted.add('lastName');
    if (data.contactInfo.email && isEmailValid(data.contactInfo.email)) newCompleted.add('email');
    if (data.contactInfo.phone) newCompleted.add('phone');
    setCompletedFields(newCompleted);
  }, [data.contactInfo]);

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
    const cleaned = value.replace(/\D/g, '');
    
    if (prefix === '+421' || prefix === '+420') {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3').slice(0, 11);
    }
    return cleaned.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1 $2 $3').slice(0, 13);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value, data.contactInfo.phonePrefix);
    updateContactInfo('phone', formatted);
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getFieldIcon = (field: string) => {
    if (completedFields.has(field)) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  const shouldShowField = (field: string) => {
    switch (field) {
      case 'name':
        return true;
      case 'email':
        return completedFields.has('firstName') && completedFields.has('lastName');
      case 'phone':
        return completedFields.has('email');
      case 'note':
        return completedFields.has('phone');
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 -m-8 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Simplified Header without icon */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Ako sa voláte?
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
            Začneme základnými údajmi, aby sme vás mohli kontaktovať
          </p>
        </div>

        <div className="space-y-8">
          {/* Name Section - Always visible */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Salutation */}
              <div className="sm:w-32">
                <div className="relative">
                  <Select
                    value={data.contactInfo.salutation}
                    onValueChange={(value) => updateContactInfo('salutation', value)}
                  >
                    <SelectTrigger className={`h-14 border-2 transition-all duration-300 ${
                      focusedField === 'salutation' 
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white' 
                        : 'border-slate-200 bg-white/80 hover:border-slate-300'
                    }`}>
                      <SelectValue placeholder="Oslovenie" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 shadow-xl">
                      <SelectItem value="Pan">Pan</SelectItem>
                      <SelectItem value="Pani">Pani</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getFieldIcon('salutation')}
                  </div>
                </div>
              </div>

              {/* First Name */}
              <div className="flex-1">
                <div className="relative">
                  <Input
                    value={data.contactInfo.firstName}
                    onChange={(e) => updateContactInfo('firstName', e.target.value)}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Vaše meno"
                    className={`h-14 border-2 transition-all duration-300 text-lg ${
                      focusedField === 'firstName'
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white'
                        : 'border-slate-200 bg-white/80 hover:border-slate-300'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getFieldIcon('firstName')}
                  </div>
                </div>
              </div>

              {/* Last Name */}
              <div className="flex-1">
                <div className="relative">
                  <Input
                    value={data.contactInfo.lastName}
                    onChange={(e) => updateContactInfo('lastName', e.target.value)}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Vaše priezvisko"
                    className={`h-14 border-2 transition-all duration-300 text-lg ${
                      focusedField === 'lastName'
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white'
                        : 'border-slate-200 bg-white/80 hover:border-slate-300'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getFieldIcon('lastName')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Section - Progressive disclosure */}
          {shouldShowField('email') && (
            <div className="animate-fade-in" style={{animationDelay: '200ms'}}>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <Label className="text-lg font-medium">Váš email</Label>
                </div>
                <div className="relative">
                  <Input
                    type="email"
                    value={data.contactInfo.email}
                    onChange={(e) => updateContactInfo('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="vas.email@priklad.sk"
                    className={`h-14 border-2 transition-all duration-300 text-lg ${
                      focusedField === 'email'
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white'
                        : data.contactInfo.email && !isEmailValid(data.contactInfo.email)
                        ? 'border-red-300 bg-red-50'
                        : 'border-slate-200 bg-white/80 hover:border-slate-300'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getFieldIcon('email')}
                  </div>
                  {data.contactInfo.email && !isEmailValid(data.contactInfo.email) && (
                    <p className="text-sm text-red-600 mt-2 animate-fade-in">
                      Zadajte platnú emailovú adresu
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Phone Section - Progressive disclosure */}
          {shouldShowField('phone') && (
            <div className="animate-fade-in" style={{animationDelay: '400ms'}}>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <Label className="text-lg font-medium">Telefónne číslo</Label>
                </div>
                <div className="flex gap-3">
                  <Select
                    value={data.contactInfo.phonePrefix}
                    onValueChange={(value) => updateContactInfo('phonePrefix', value)}
                  >
                    <SelectTrigger className={`w-44 h-14 border-2 transition-all duration-300 ${
                      focusedField === 'phonePrefix'
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white'
                        : 'border-slate-200 bg-white/80 hover:border-slate-300'
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 shadow-xl">
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
                  <div className="flex-1 relative">
                    <Input
                      value={data.contactInfo.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="123 456 789"
                      className={`h-14 border-2 transition-all duration-300 text-lg font-mono ${
                        focusedField === 'phone'
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white'
                          : 'border-slate-200 bg-white/80 hover:border-slate-300'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getFieldIcon('phone')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Optional Note Section - Progressive disclosure */}
          {shouldShowField('note') && (
            <div className="animate-fade-in" style={{animationDelay: '600ms'}}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-lg font-medium text-slate-700">Chcete nám niečo odkázať?</Label>
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
                <Textarea
                  value={data.contactInfo.salesNote || ''}
                  onChange={(e) => updateContactInfo('salesNote', e.target.value)}
                  onFocus={() => setFocusedField('salesNote')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Napríklad: Najlepší čas na kontakt, preferovaný spôsob komunikácie..."
                  rows={4}
                  className={`border-2 transition-all duration-300 resize-none ${
                    focusedField === 'salesNote'
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white'
                      : 'border-slate-200 bg-white/80 hover:border-slate-300'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Progress indicator */}
          {completedFields.size > 0 && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 bg-white/60 px-4 py-2 rounded-full">
                <div className="flex gap-1">
                  {Array.from({length: 4}).map((_, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        i < completedFields.size ? 'bg-blue-500' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span>{completedFields.size}/4 dokončených</span>
              </div>
            </div>
          )}

          {/* Motivational message */}
          {completedFields.size >= 3 && (
            <div className="text-center animate-fade-in">
              <p className="text-lg text-blue-600 font-medium">
                Skvelé! Už to bude! 🎉
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoStep;
