
import { OnboardingData } from "@/types/onboarding";
import { useState, useEffect } from "react";
import { Mail, Phone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import OnboardingInput from "./ui/OnboardingInput";
import OnboardingSelect from "./ui/OnboardingSelect";
import OnboardingTextarea from "./ui/OnboardingTextarea";
import OnboardingSection from "./ui/OnboardingSection";

interface ContactInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep = ({ data, updateData }: ContactInfoStepProps) => {
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
    { value: '+421', label: '+421', extra: '🇸🇰 Slovensko' },
    { value: '+420', label: '+420', extra: '🇨🇿 Česko' },
    { value: '+43', label: '+43', extra: '🇦🇹 Rakúsko' },
    { value: '+36', label: '+36', extra: '🇭🇺 Maďarsko' },
    { value: '+48', label: '+48', extra: '🇵🇱 Poľsko' },
    { value: '+49', label: '+49', extra: '🇩🇪 Nemecko' },
    { value: '+44', label: '+44', extra: '🇬🇧 Británia' }
  ];

  const salutationOptions = [
    { value: 'Pan', label: 'Pan' },
    { value: 'Pani', label: 'Pani' }
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
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left sidebar */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900">Kontaktné údaje</h3>
              </div>
              
              <p className="text-sm text-blue-800">
                Zadajte svoje základné kontaktné informácie pre registráciu obchodného účtu.
              </p>
              
              <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                <p className="font-medium mb-2">Dôležité informácie</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Email bude slúžiť ako vaše používateľské meno</li>
                  <li>Telefón pre technickú podporu a notifikácie</li>
                  <li>Všetky údaje sú chránené GDPR</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main form content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              {/* Name Section - Always visible */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Salutation */}
                <div className="sm:w-32">
                  <OnboardingSelect
                    label="Oslovenie"
                    placeholder="Vyberte"
                    value={data.contactInfo.salutation}
                    onValueChange={(value) => updateContactInfo('salutation', value)}
                    options={salutationOptions}
                    isCompleted={completedFields.has('salutation')}
                  />
                </div>

                {/* First Name */}
                <div className="flex-1">
                  <OnboardingInput
                    label="Meno *"
                    value={data.contactInfo.firstName}
                    onChange={(e) => updateContactInfo('firstName', e.target.value)}
                    placeholder="Vaše meno"
                    isCompleted={completedFields.has('firstName')}
                  />
                </div>

                {/* Last Name */}
                <div className="flex-1">
                  <OnboardingInput
                    label="Priezvisko *"
                    value={data.contactInfo.lastName}
                    onChange={(e) => updateContactInfo('lastName', e.target.value)}
                    placeholder="Vaše priezvisko"
                    isCompleted={completedFields.has('lastName')}
                  />
                </div>
              </div>

              {/* Email Section - Progressive disclosure */}
              {shouldShowField('email') && (
                <div className="animate-fade-in" style={{animationDelay: '200ms'}}>
                  <OnboardingInput
                    type="email"
                    label="Email *"
                    value={data.contactInfo.email}
                    onChange={(e) => updateContactInfo('email', e.target.value)}
                    placeholder="vas.email@priklad.sk"
                    icon={<Mail className="h-5 w-5" />}
                    isCompleted={completedFields.has('email')}
                    error={data.contactInfo.email && !isEmailValid(data.contactInfo.email) ? 'Zadajte platnú emailovú adresu' : undefined}
                  />
                </div>
              )}

              {/* Phone Section - Progressive disclosure */}
              {shouldShowField('phone') && (
                <div className="animate-fade-in" style={{animationDelay: '400ms'}}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium">Telefónne číslo *</span>
                    </div>
                    <div className="flex gap-3">
                      <OnboardingSelect
                        value={data.contactInfo.phonePrefix}
                        onValueChange={(value) => updateContactInfo('phonePrefix', value)}
                        options={phonePrefixes}
                        className="w-44"
                      />
                      <div className="flex-1">
                        <OnboardingInput
                          value={data.contactInfo.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="123 456 789"
                          className="font-mono"
                          isCompleted={completedFields.has('phone')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Note Section - Progressive disclosure */}
              {shouldShowField('note') && (
                <div className="animate-fade-in" style={{animationDelay: '600ms'}}>
                  <OnboardingTextarea
                    label="Chcete nám niečo odkázať?"
                    value={data.contactInfo.salesNote || ''}
                    onChange={(e) => updateContactInfo('salesNote', e.target.value)}
                    placeholder="Napríklad: Najlepší čas na kontakt, preferovaný spôsob komunikácie..."
                    rows={4}
                    helperText="Nepovinné – môžete nám napísať dodatočné info alebo preferencie"
                  />
                </div>
              )}
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoStep;
