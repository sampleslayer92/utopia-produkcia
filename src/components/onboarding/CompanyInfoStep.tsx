
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import CompanyInfoSidebar from "./CompanyInfoStep/CompanyInfoSidebar";
import CompanyInfoForm from "./CompanyInfoStep/CompanyInfoForm";
import MobileOptimizedCard from "./ui/MobileOptimizedCard";
import { useCompanyInfoLogic } from "./CompanyInfoStep/hooks/useCompanyInfoLogic";
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
  const { updateCompanyInfo, autoFilledFields, setAutoFilledFields, handleORSRData } = useCompanyInfoLogic(data, updateData);

  const infoTooltipData = {
    description: t('steps.companyInfo.description'),
    features: t('steps.companyInfo.features', { returnObjects: true }) as string[]
  };

  if (isMobile) {
    return (
      <MobileOptimizedCard
        title={t('steps.companyInfo.title')}
        icon={<Building2 className="h-4 w-4 text-blue-600" />}
        infoTooltip={infoTooltipData}
      >
        <CompanyInfoForm
          data={data}
          updateCompanyInfo={updateCompanyInfo}
          autoFilledFields={autoFilledFields}
          setAutoFilledFields={setAutoFilledFields}
          handleORSRData={handleORSRData}
        />
      </MobileOptimizedCard>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <CompanyInfoSidebar
            contractId={data.contractId || ''}
            contractNumber={data.contractNumber || ''}
          />
          
          <CompanyInfoForm
            data={data}
            updateCompanyInfo={updateCompanyInfo}
            autoFilledFields={autoFilledFields}
            setAutoFilledFields={setAutoFilledFields}
            handleORSRData={handleORSRData}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoStep;
