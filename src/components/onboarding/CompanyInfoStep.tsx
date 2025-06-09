
import { useState } from "react";
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CompanyBasicInfoCard from "./company/CompanyBasicInfoCard";
import CompanyAddressCard from "./company/CompanyAddressCard";
import CompanyContactAddressCard from "./company/CompanyContactAddressCard";
import CompanyContactPersonCard from "./company/CompanyContactPersonCard";
import MobileOptimizedCard from "./ui/MobileOptimizedCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface CompanyInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CompanyInfoStep = ({ data, updateData }: CompanyInfoStepProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [autoFilledFromORSR, setAutoFilledFromORSR] = useState(false);

  const updateCompanyInfo = (field: string, value: any) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      updateData({
        companyInfo: {
          ...data.companyInfo,
          [field]: value
        }
      });
    } else if (keys.length === 2) {
      updateData({
        companyInfo: {
          ...data.companyInfo,
          [keys[0]]: {
            ...data.companyInfo[keys[0] as keyof typeof data.companyInfo],
            [keys[1]]: value
          }
        }
      });
    }
  };

  const handleORSRData = (orsrData: any) => {
    console.log('ORSR data received:', orsrData);
    
    updateData({
      companyInfo: {
        ...data.companyInfo,
        companyName: orsrData.obchodne_meno || data.companyInfo.companyName,
        address: {
          street: orsrData.sidlo?.ulica || data.companyInfo.address?.street || '',
          city: orsrData.sidlo?.obec || data.companyInfo.address?.city || '',
          zipCode: orsrData.sidlo?.psc || data.companyInfo.address?.zipCode || ''
        }
      }
    });
    
    setAutoFilledFromORSR(true);
    toast.success(t('onboarding.messages.dataAutoFilled'));
  };

  const infoTooltipData = {
    description: t('onboarding.companyInfo.basicInfo'),
    features: [
      t('onboarding.companyInfo.orsrSearch'),
      t('onboarding.companyInfo.autoFilled'),
      t('onboarding.validation.required'),
      t('onboarding.companyInfo.contactPerson')
    ]
  };

  if (isMobile) {
    return (
      <MobileOptimizedCard
        title={t('onboarding.steps.companyInfo.title')}
        icon={<Building2 className="h-4 w-4 text-blue-600" />}
        infoTooltip={infoTooltipData}
      >
        <div className="space-y-8">
          <CompanyBasicInfoCard 
            data={data} 
            updateCompanyInfo={updateCompanyInfo}
            handleORSRData={handleORSRData}
          />
          
          <CompanyAddressCard 
            data={data} 
            updateCompanyInfo={updateCompanyInfo}
          />
          
          {!data.companyInfo.contactAddressSame && (
            <CompanyContactAddressCard 
              data={data} 
              updateCompanyInfo={updateCompanyInfo}
            />
          )}
          
          <CompanyContactPersonCard 
            data={data} 
            updateCompanyInfo={updateCompanyInfo}
          />
        </div>
      </MobileOptimizedCard>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{t('onboarding.steps.companyInfo.title')}</h2>
            <p className="text-slate-600 mt-1">{t('onboarding.steps.companyInfo.subtitle')}</p>
          </div>
        </div>

        {autoFilledFromORSR && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              {t('onboarding.companyInfo.orsrFound')} ✓
            </p>
          </div>
        )}

        <div className="space-y-8">
          <CompanyBasicInfoCard 
            data={data} 
            updateCompanyInfo={updateCompanyInfo}
            handleORSRData={handleORSRData}
          />
          
          <CompanyAddressCard 
            data={data} 
            updateCompanyInfo={updateCompanyInfo}
          />
          
          {!data.companyInfo.contactAddressSame && (
            <CompanyContactAddressCard 
              data={data} 
              updateCompanyInfo={updateCompanyInfo}
            />
          )}
          
          <CompanyContactPersonCard 
            data={data} 
            updateCompanyInfo={updateCompanyInfo}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoStep;
