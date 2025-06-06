import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { OnboardingData, OpeningHours } from "@/types/onboarding";
import { Building2 } from "lucide-react";
import EnhancedCompanyBasicInfoCard from "./company/EnhancedCompanyBasicInfoCard";
import CompanyRegistryInfo from "./company/CompanyRegistryInfo";
import CompanyAddressCard from "./company/CompanyAddressCard";
import CompanyContactAddressCard from "./company/CompanyContactAddressCard";
import CompanyContactPersonCard from "./company/CompanyContactPersonCard";
import { useEffect } from "react";

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

  // Synchronize contact address with main address when checkbox is checked
  useEffect(() => {
    if (data.companyInfo.contactAddressSameAsMain) {
      updateData({
        companyInfo: {
          ...data.companyInfo,
          contactAddress: {
            street: data.companyInfo.address.street,
            city: data.companyInfo.address.city,
            zipCode: data.companyInfo.address.zipCode
          }
        }
      });
    }
  }, [
    data.companyInfo.contactAddressSameAsMain,
    data.companyInfo.address.street,
    data.companyInfo.address.city,
    data.companyInfo.address.zipCode
  ]);

  // Synchronize operating address with head office when checkbox is checked
  useEffect(() => {
    if (data.companyInfo.headOfficeEqualsOperatingAddress) {
      const updatedLocations = [...data.businessLocations];
      
      // If no business locations exist, create one with head office address
      if (updatedLocations.length === 0) {
        const hasBusinessContactRole = data.contactInfo.userRoles?.includes('Kontaktná osoba na prevádzku') || 
                                      data.contactInfo.userRoles?.includes('Majiteľ') || 
                                      false;

        const defaultOpeningHours: OpeningHours[] = [
          { day: "Po", open: "09:00", close: "17:00", otvorene: true },
          { day: "Ut", open: "09:00", close: "17:00", otvorene: true },
          { day: "St", open: "09:00", close: "17:00", otvorene: true },
          { day: "Št", open: "09:00", close: "17:00", otvorene: true },
          { day: "Pi", open: "09:00", close: "17:00", otvorene: true },
          { day: "So", open: "09:00", close: "14:00", otvorene: false },
          { day: "Ne", open: "09:00", close: "17:00", otvorene: false }
        ];

        const newLocation = {
          id: Date.now().toString(),
          name: '',
          hasPOS: false,
          address: {
            street: data.companyInfo.address.street,
            city: data.companyInfo.address.city,
            zipCode: data.companyInfo.address.zipCode
          },
          iban: '',
          bankAccounts: [{
            id: Date.now().toString(),
            format: 'IBAN' as const,
            iban: '',
            mena: 'EUR' as const
          }],
          contactPerson: hasBusinessContactRole ? {
            name: `${data.contactInfo.firstName} ${data.contactInfo.lastName}`,
            email: data.contactInfo.email,
            phone: data.contactInfo.phone
          } : {
            name: '',
            email: '',
            phone: ''
          },
          businessSector: '',
          businessSubject: '',
          mccCode: '',
          estimatedTurnover: 0,
          monthlyTurnover: 0,
          averageTransaction: 0,
          openingHours: '',
          openingHoursDetailed: defaultOpeningHours,
          seasonality: 'year-round' as const,
          assignedPersons: []
        };
        updatedLocations.push(newLocation);
      } else {
        // Update the first business location's address
        updatedLocations[0] = {
          ...updatedLocations[0],
          address: {
            street: data.companyInfo.address.street,
            city: data.companyInfo.address.city,
            zipCode: data.companyInfo.address.zipCode
          }
        };
      }

      updateData({
        businessLocations: updatedLocations
      });
    }
  }, [
    data.companyInfo.headOfficeEqualsOperatingAddress,
    data.companyInfo.address.street,
    data.companyInfo.address.city,
    data.companyInfo.address.zipCode
  ]);

  const handleORSRData = (orsrData: any) => {
    updateData({
      companyInfo: {
        ...data.companyInfo,
        companyName: orsrData.companyName,
        dic: orsrData.dic,
        court: orsrData.court,
        section: orsrData.section,
        insertNumber: orsrData.insertNumber,
        address: orsrData.address,
        // Ensure registry_type is set to valid value
        registryType: orsrData.registryType || 'business'
      }
    });
  };

  // Ensure registry_type has a valid default value
  if (!data.companyInfo.registryType || !['public', 'business', 'other'].includes(data.companyInfo.registryType)) {
    updateCompanyInfo('registryType', 'business');
  }

  // Ensure headOfficeEqualsOperatingAddress has a default value
  if (data.companyInfo.headOfficeEqualsOperatingAddress === undefined) {
    updateCompanyInfo('headOfficeEqualsOperatingAddress', false);
  }

  // Determine default accordion values based on whether contact address should be shown
  const defaultAccordionValues = data.companyInfo.contactAddressSameAsMain 
    ? ["basic-info", "address", "contact-person"]
    : ["basic-info", "address", "contact-address", "contact-person"];

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left sidebar with info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900">Údaje o spoločnosti</h3>
              </div>
              
              <p className="text-sm text-blue-800">
                Začnite zadaním obchodného mena. Systém automaticky rozpozná typ spoločnosti a doplní základné údaje.
              </p>
              
              <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                <p className="font-medium mb-2">Inteligentné vyplnenie</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Rozpoznanie typu spoločnosti</li>
                  <li>Automatické doplnenie IČO/DIČ</li>
                  <li>Údaje z obchodného registra</li>
                  <li>DPH status predikcia</li>
                </ul>
              </div>

              {data.companyInfo.headOfficeEqualsOperatingAddress && (
                <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
                  <p className="font-medium mb-1">✓ Synchronizácia aktívna</p>
                  <p>Adresa sídla sa automaticky kopíruje do prvej prevádzky.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Main form content with accordion */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <Accordion type="multiple" defaultValue={defaultAccordionValues} className="space-y-4">
              
              {/* Enhanced Basic Company Info */}
              <AccordionItem value="basic-info" className="border border-slate-200 rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <span className="font-medium text-slate-900">Základné údaje o spoločnosti</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <EnhancedCompanyBasicInfoCard
                    data={data}
                    updateCompanyInfo={updateCompanyInfo}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Registry Info */}
              <AccordionItem value="registry-info" className="border border-slate-200 rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <span className="font-medium text-slate-900">Údaje z obchodného registra</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <CompanyRegistryInfo
                    data={data}
                    updateCompanyInfo={updateCompanyInfo}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Company Address */}
              <AccordionItem value="address" className="border border-slate-200 rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <span className="font-medium text-slate-900">Sídlo spoločnosti</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <CompanyAddressCard
                    data={data}
                    updateCompanyInfo={updateCompanyInfo}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Contact Address - only show if not same as main */}
              {!data.companyInfo.contactAddressSameAsMain && (
                <AccordionItem value="contact-address" className="border border-slate-200 rounded-lg">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <span className="font-medium text-slate-900">Kontaktná adresa</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <CompanyContactAddressCard
                      data={data}
                      updateCompanyInfo={updateCompanyInfo}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Contact Person */}
              <AccordionItem value="contact-person" className="border border-slate-200 rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <span className="font-medium text-slate-900">Kontaktná osoba</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <CompanyContactPersonCard
                    data={data}
                    updateCompanyInfo={updateCompanyInfo}
                  />
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoStep;
