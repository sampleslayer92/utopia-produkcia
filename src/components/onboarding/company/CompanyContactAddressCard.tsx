
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";

interface CompanyContactAddressCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyContactAddressCard = ({ data, updateCompanyInfo }: CompanyContactAddressCardProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-medium text-slate-900">Kontaktná adresa spoločnosti</h3>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="contactAddressSameAsMain"
          checked={data.companyInfo.contactAddressSameAsMain}
          onCheckedChange={(checked) => updateCompanyInfo('contactAddressSameAsMain', checked)}
        />
        <label htmlFor="contactAddressSameAsMain" className="text-sm text-slate-700">
          Kontaktná adresa sa zhoduje so sídlom spoločnosti
        </label>
      </div>

      {!data.companyInfo.contactAddressSameAsMain && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <OnboardingInput
                label="Ulica a číslo *"
                value={data.companyInfo.contactAddress?.street || ''}
                onChange={(e) => updateCompanyInfo('contactAddress.street', e.target.value)}
                placeholder="Kontaktná ulica 456"
              />
            </div>
            
            <OnboardingInput
              label="PSČ *"
              value={data.companyInfo.contactAddress?.zipCode || ''}
              onChange={(e) => updateCompanyInfo('contactAddress.zipCode', e.target.value)}
              placeholder="01001"
            />
          </div>
          
          <OnboardingInput
            label="Mesto *"
            value={data.companyInfo.contactAddress?.city || ''}
            onChange={(e) => updateCompanyInfo('contactAddress.city', e.target.value)}
            placeholder="Bratislava"
          />
        </div>
      )}
    </div>
  );
};

export default CompanyContactAddressCard;
