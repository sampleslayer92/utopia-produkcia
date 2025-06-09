
import { MapPin } from "lucide-react";
import OnboardingInput from "./OnboardingInput";
import { useTranslation } from "react-i18next";

interface AddressData {
  street: string;
  city: string;
  zipCode: string;
}

interface AddressFormProps {
  title: string;
  data: AddressData;
  onUpdate: (field: keyof AddressData, value: string) => void;
  className?: string;
}

const AddressForm = ({ title, data, onUpdate, className = "" }: AddressFormProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {title}
      </h4>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <OnboardingInput
            label={t('address.labels.streetRequired')}
            value={data.street}
            onChange={(e) => onUpdate('street', e.target.value)}
            placeholder={t('address.placeholders.street')}
          />
        </div>
        
        <OnboardingInput
          label={t('address.labels.zipCodeRequired')}
          value={data.zipCode}
          onChange={(e) => onUpdate('zipCode', e.target.value)}
          placeholder={t('address.placeholders.zipCode')}
        />
      </div>
      
      <OnboardingInput
        label={t('address.labels.cityRequired')}
        value={data.city}
        onChange={(e) => onUpdate('city', e.target.value)}
        placeholder={t('address.placeholders.city')}
      />
    </div>
  );
};

export default AddressForm;
