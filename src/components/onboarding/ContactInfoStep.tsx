
import { OnboardingData } from "@/types/onboarding";
import { useState, useEffect } from "react";
import { Mail, Phone, User, UserCheck, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import OnboardingInput from "./ui/OnboardingInput";
import OnboardingSelect from "./ui/OnboardingSelect";
import OnboardingTextarea from "./ui/OnboardingTextarea";
import OnboardingSection from "./ui/OnboardingSection";
import MultiRoleSelector from "./ui/MultiRoleSelector";
import { v4 as uuidv4 } from "uuid";

interface ContactInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep = ({ data, updateData }: ContactInfoStepProps) => {
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  const updateContactInfo = (field: string, value: string | boolean | string[]) => {
    updateData({
      contactInfo: {
        ...data.contactInfo,
        [field]: value
      }
    });
  };

  // Auto-fill based on selected roles
  const autoFillBasedOnRoles = (roles: string[]) => {
    const { contactInfo } = data;
    
    // Only auto-fill if we have the required basic information
    if (contactInfo.firstName && contactInfo.lastName && contactInfo.email && contactInfo.phone) {
      const personId = uuidv4();
      const updates: Partial<OnboardingData> = {};
      
      // Check if person already exists to avoid duplicates
      const existingAuthorized = data.authorizedPersons.find(p => 
        p.firstName === contactInfo.firstName && 
        p.lastName === contactInfo.lastName && 
        p.email === contactInfo.email
      );

      const existingOwner = data.actualOwners.find(p => 
        p.firstName === contactInfo.firstName && 
        p.lastName === contactInfo.lastName
      );

      // Handle Majiteľ role
      if (roles.includes('Majiteľ') && !existingOwner) {
        const actualOwner = {
          id: uuidv4(),
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
          maidenName: '',
          birthDate: '',
          birthPlace: '',
          birthNumber: '',
          citizenship: 'Slovensko',
          permanentAddress: '',
          isPoliticallyExposed: false
        };
        updates.actualOwners = [...data.actualOwners, actualOwner];
      }

      // Handle Konateľ role
      if (roles.includes('Konateľ') && !existingAuthorized) {
        const authorizedPerson = {
          id: personId,
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
          email: contactInfo.email,
          phone: contactInfo.phone,
          maidenName: '',
          birthDate: '',
          birthPlace: '',
          birthNumber: '',
          permanentAddress: '',
          position: 'Konateľ',
          documentType: 'OP' as const,
          documentNumber: '',
          documentValidity: '',
          documentIssuer: '',
          documentCountry: 'Slovensko',
          citizenship: 'Slovensko',
          isPoliticallyExposed: false,
          isUSCitizen: false
        };
        updates.authorizedPersons = [...data.authorizedPersons, authorizedPerson];
        
        // Set as signing person
        updates.consents = {
          ...data.consents,
          signingPersonId: personId
        };
      }

      // Handle Kontaktná osoba na prevádzku
      if (roles.includes('Kontaktná osoba na prevádzku')) {
        // This will be used in BusinessLocationStep to pre-fill contact person
        // The logic will be handled in that step when it detects this role
      }

      // Handle Kontaktná osoba pre technické záležitosti
      if (roles.includes('Kontaktná osoba pre technické záležitosti')) {
        updates.companyInfo = {
          ...data.companyInfo,
          contactPerson: {
            ...data.companyInfo.contactPerson,
            firstName: contactInfo.firstName,
            lastName: contactInfo.lastName,
            email: contactInfo.email,
            phone: contactInfo.phone,
            isTechnicalPerson: true
          }
        };
      }

      if (Object.keys(updates).length > 0) {
        updateData(updates);
        setHasAutoFilled(true);
      }
    }
  };

  // Handle roles change
  const handleRolesChange = (roles: string[]) => {
    updateContactInfo('userRoles', roles);
    // Also update the legacy userRole field for backward compatibility
    if (roles.length > 0) {
      updateContactInfo('userRole', roles[0]);
    } else {
      updateContactInfo('userRole', '');
    }
    autoFillBasedOnRoles(roles);
  };

  // Check if basic contact info is complete
  const isBasicInfoComplete = () => {
    return data.contactInfo.firstName && 
           data.contactInfo.lastName && 
           data.contactInfo.email && 
           isEmailValid(data.contactInfo.email) &&
           data.contactInfo.phone;
  };

  // Auto-fill when roles and basic info are complete
  useEffect(() => {
    if (data.contactInfo.userRoles && data.contactInfo.userRoles.length > 0 && isBasicInfoComplete()) {
      autoFillBasedOnRoles(data.contactInfo.userRoles);
    }
  }, [data.contactInfo.userRoles, data.contactInfo.firstName, data.contactInfo.lastName, data.contactInfo.email, data.contactInfo.phone]);

  // Track completed fields for visual feedback
  useEffect(() => {
    const newCompleted = new Set<string>();
    if (data.contactInfo.salutation) newCompleted.add('salutation');
    if (data.contactInfo.firstName) newCompleted.add('firstName');
    if (data.contactInfo.lastName) newCompleted.add('lastName');
    if (data.contactInfo.email && isEmailValid(data.contactInfo.email)) newCompleted.add('email');
    if (data.contactInfo.phone) newCompleted.add('phone');
    if (data.contactInfo.companyType) newCompleted.add('companyType');
    if (data.contactInfo.userRoles && data.contactInfo.userRoles.length > 0) newCompleted.add('userRoles');
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

  const companyTypeOptions = [
    { value: 'Živnosť', label: 'Živnosť' },
    { value: 'S.r.o.', label: 'S.r.o.' },
    { value: 'Nezisková organizácia', label: 'Nezisková organizácia' },
    { value: 'Akciová spoločnosť', label: 'Akciová spoločnosť' }
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
                Zadajte svoje základné kontaktné informácie, typ spoločnosti a vašu rolu v spoločnosti pre registráciu obchodného účtu.
              </p>
              
              <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                <p className="font-medium mb-2">Dôležité informácie</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Email bude slúžiť ako vaše používateľské meno</li>
                  <li>Telefón pre technickú podporu a notifikácie</li>
                  <li>Všetky údaje sú chránené GDPR</li>
                  <li>Na základe vašej roly sa automaticky predvyplnia údaje v ďalších krokoch</li>
                </ul>
              </div>

              {hasAutoFilled && data.contactInfo.userRoles && data.contactInfo.userRoles.length > 0 && (
                <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="h-4 w-4" />
                    <p className="font-medium">Automatické predvyplnenie</p>
                  </div>
                  <p>Na základe vašich rolí ({data.contactInfo.userRoles.join(', ')}) boli vaše údaje automaticky predvyplnené v príslušných sekciách.</p>
                </div>
              )}

              {isBasicInfoComplete() && !data.contractId && (
                <div className="bg-yellow-100/50 border border-yellow-200 rounded-lg p-4 text-xs text-yellow-800">
                  <p className="font-medium">Vytvára sa zmluva...</p>
                  <p className="mt-1">Po vyplnení základných údajov sa automaticky vytvorí zmluva.</p>
                </div>
              )}

              {data.contractId && data.contractNumber && (
                <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
                  <p className="font-medium">Zmluva vytvorená!</p>
                  <p className="mt-1">Číslo zmluvy: {data.contractNumber}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Main form content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              {/* Name Section */}
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

              {/* Company Type Selection */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <Building className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Typ spoločnosti *</span>
                </div>
                <OnboardingSelect
                  placeholder="Vyberte typ spoločnosti"
                  value={data.contactInfo.companyType || ''}
                  onValueChange={(value) => updateContactInfo('companyType', value)}
                  options={companyTypeOptions}
                  isCompleted={completedFields.has('companyType')}
                />
              </div>

              {/* Multi-Role Selection */}
              <MultiRoleSelector
                selectedRoles={data.contactInfo.userRoles || []}
                onChange={handleRolesChange}
              />

              {/* Email Section */}
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

              {/* Phone Section */}
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

              {/* Optional Note Section */}
              <OnboardingTextarea
                label="Chcete nám niečo odkázať?"
                value={data.contactInfo.salesNote || ''}
                onChange={(e) => updateContactInfo('salesNote', e.target.value)}
                placeholder="Napríklad: Najlepší čas na kontakt, preferovaný spôsob komunikácie..."
                rows={4}
              />
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoStep;
