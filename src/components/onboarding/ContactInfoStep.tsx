
import { OnboardingData } from "@/types/onboarding";
import { useState, useEffect, useRef } from "react";
import { User, UserCheck, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import OnboardingTextarea from "./ui/OnboardingTextarea";
import OnboardingSection from "./ui/OnboardingSection";
import OnboardingSelect from "./ui/OnboardingSelect";
import MultiRoleSelector from "./ui/MultiRoleSelector";
import PersonInputGroup from "./ui/PersonInputGroup";
import { getPersonDataFromContactInfo, getAutoFillUpdates, hasContactInfoChanged } from "./utils/autoFillUtils";

interface ContactInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep = ({ data, updateData }: ContactInfoStepProps) => {
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [hasAutoFilled, setHasAutoFilled] = useState(false);
  const prevContactInfoRef = useRef(data.contactInfo);

  const updateContactInfo = (field: string, value: string | boolean | string[]) => {
    updateData({
      contactInfo: {
        ...data.contactInfo,
        [field]: value
      }
    });
  };

  const handlePersonDataUpdate = (field: string, value: string) => {
    updateContactInfo(field, value);
  };

  // Handle roles change with improved auto-fill logic
  const handleRolesChange = (roles: string[]) => {
    updateContactInfo('userRoles', roles);
    // Also update the legacy userRole field for backward compatibility
    if (roles.length > 0) {
      updateContactInfo('userRole', roles[0]);
    } else {
      updateContactInfo('userRole', '');
    }

    // Apply auto-fill logic
    const autoFillUpdates = getAutoFillUpdates(roles, data.contactInfo, data);
    if (Object.keys(autoFillUpdates).length > 0) {
      updateData(autoFillUpdates);
      setHasAutoFilled(true);
    }
  };

  // Check if basic contact info is complete
  const isBasicInfoComplete = () => {
    return data.contactInfo.firstName && 
           data.contactInfo.lastName && 
           data.contactInfo.email && 
           isEmailValid(data.contactInfo.email) &&
           data.contactInfo.phone;
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Auto-fill when roles and basic info are complete
  useEffect(() => {
    if (data.contactInfo.userRoles && data.contactInfo.userRoles.length > 0 && isBasicInfoComplete()) {
      const autoFillUpdates = getAutoFillUpdates(data.contactInfo.userRoles, data.contactInfo, data);
      if (Object.keys(autoFillUpdates).length > 0) {
        updateData(autoFillUpdates);
        setHasAutoFilled(true);
      }
    }
  }, [data.contactInfo.userRoles, data.contactInfo.firstName, data.contactInfo.lastName, data.contactInfo.email, data.contactInfo.phone]);

  // Watch for changes in contact info and propagate to other sections
  useEffect(() => {
    const currentContactInfo = data.contactInfo;
    const prevContactInfo = prevContactInfoRef.current;

    // Only proceed if contact info has actually changed and user has roles
    if (hasContactInfoChanged(prevContactInfo, currentContactInfo) && 
        currentContactInfo.userRoles && 
        currentContactInfo.userRoles.length > 0 &&
        isBasicInfoComplete()) {
      
      console.log('Contact info changed, updating related sections...', {
        prev: prevContactInfo,
        current: currentContactInfo,
        roles: currentContactInfo.userRoles
      });

      const autoFillUpdates = getAutoFillUpdates(currentContactInfo.userRoles, currentContactInfo, data);
      if (Object.keys(autoFillUpdates).length > 0) {
        updateData(autoFillUpdates);
        setHasAutoFilled(true);
      }
    }

    // Update ref for next comparison
    prevContactInfoRef.current = currentContactInfo;
  }, [data.contactInfo.firstName, data.contactInfo.lastName, data.contactInfo.email, data.contactInfo.phone, data.contactInfo.phonePrefix]);

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

  const companyTypeOptions = [
    { value: 'Živnosť', label: 'Živnosť' },
    { value: 'S.r.o.', label: 'S.r.o.' },
    { value: 'Nezisková organizácia', label: 'Nezisková organizácia' },
    { value: 'Akciová spoločnosť', label: 'Akciová spoločnosť' }
  ];

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
                  <li>Telefónne čísla majú jednotný formát vo všetkých krokoch</li>
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
              {/* Personal Information using unified component */}
              <PersonInputGroup
                data={getPersonDataFromContactInfo(data.contactInfo)}
                onUpdate={handlePersonDataUpdate}
                completedFields={completedFields}
                forceShowPhonePrefix={true}
              />

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
