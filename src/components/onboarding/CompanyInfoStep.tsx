
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingData } from "@/types/onboarding";
import OnboardingSection from "./ui/OnboardingSection";
import { Building2 } from "lucide-react";
import CompanyBasicInfo from "./company/CompanyBasicInfo";
import CompanyRegistryInfo from "./company/CompanyRegistryInfo";
import CompanyAddressSection from "./company/CompanyAddressSection";
import CompanyContactPerson from "./company/CompanyContactPerson";

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

  const handleORSRData = (orsrData: any) => {
    updateData({
      companyInfo: {
        ...data.companyInfo,
        companyName: orsrData.companyName,
        dic: orsrData.dic,
        court: orsrData.court,
        section: orsrData.section,
        insertNumber: orsrData.insertNumber,
        address: orsrData.address
      }
    });
  };

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
                Zadajte základné informácie o vašej spoločnosti pre správne vedenie zmluvy a platobných služieb.
              </p>
              
              <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                <p className="font-medium mb-2">Prečo potrebujeme tieto údaje?</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Pre vystavenie faktúr</li>
                  <li>Pre právne dokumenty a zmluvy</li>
                  <li>Pre zriadenie platobného terminálu</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main form content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              <CompanyBasicInfo
                data={data}
                updateCompanyInfo={updateCompanyInfo}
                handleORSRData={handleORSRData}
              />

              <CompanyRegistryInfo
                data={data}
                updateCompanyInfo={updateCompanyInfo}
              />

              <CompanyAddressSection
                data={data}
                updateCompanyInfo={updateCompanyInfo}
              />

              <CompanyContactPerson
                data={data}
                updateCompanyInfo={updateCompanyInfo}
              />
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoStep;
