
import { useTranslation } from "react-i18next";
import { OnboardingData } from "@/types/onboarding";
import OnboardingSection from "../ui/OnboardingSection";
import EnhancedCompanyBasicInfoCard from "../company/EnhancedCompanyBasicInfoCard";
import CompanyAddressCard from "../company/CompanyAddressCard";
import CompanyContactPersonCard from "../company/CompanyContactPersonCard";
import CompanyContactAddressCard from "../company/CompanyContactAddressCard";

interface CompanyInfoFormProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
  autoFilledFields: Set<string>;
  setAutoFilledFields: (fields: Set<string>) => void;
  handleORSRData: (orsrData: any) => void;
}

const CompanyInfoForm = ({
  data,
  updateCompanyInfo,
  autoFilledFields,
  setAutoFilledFields,
  handleORSRData
}: CompanyInfoFormProps) => {
  return (
    <div className="col-span-1 md:col-span-2 p-6 md:p-8">
      <OnboardingSection>
        <div className="space-y-8">
          {/* Basic Company Information */}
          <EnhancedCompanyBasicInfoCard
            data={data}
            updateCompanyInfo={updateCompanyInfo}
            autoFilledFields={autoFilledFields}
            setAutoFilledFields={setAutoFilledFields}
          />

          {/* Company Address */}
          <CompanyAddressCard
            data={data}
            updateCompanyInfo={updateCompanyInfo}
            autoFilledFields={autoFilledFields}
          />

          {/* Contact Person */}
          <CompanyContactPersonCard
            data={data}
            updateCompanyInfo={updateCompanyInfo}
          />

          {/* Contact Address (if different) */}
          {!data.companyInfo.contactAddressSameAsMain && (
            <CompanyContactAddressCard
              data={data}
              updateCompanyInfo={updateCompanyInfo}
            />
          )}
        </div>
      </OnboardingSection>
    </div>
  );
};

export default CompanyInfoForm;
