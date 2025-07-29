
import { MapPin } from "lucide-react";
import OnboardingInput from "./OnboardingInput";
import { useTranslation } from "react-i18next";
import { OnboardingField } from "@/pages/OnboardingConfigPage";

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
  customFields?: OnboardingField[];
}

const AddressForm = ({ title, data, onUpdate, className = "", customFields }: AddressFormProps) => {
  const { t } = useTranslation('forms');
  
  // Helper function to check if a field is enabled
  const isFieldEnabled = (fieldKey: string): boolean => {
    if (!customFields) return true; // Default behavior if no custom fields
    const field = customFields.find(f => f.fieldKey === fieldKey || f.fieldKey.endsWith(`.${fieldKey}`));
    return field ? field.isEnabled : true;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {title}
      </h4>
      
      <div className="grid md:grid-cols-3 gap-4">
        {isFieldEnabled('street') && (
          <div className="md:col-span-2">
            <OnboardingInput
              label={t('address.labels.streetRequired')}
              value={data.street}
              onChange={(e) => onUpdate('street', e.target.value)}
              placeholder={t('address.placeholders.street')}
            />
          </div>
        )}
        
        {isFieldEnabled('zipCode') && (
          <OnboardingInput
            label={t('address.labels.zipCodeRequired')}
            value={data.zipCode}
            onChange={(e) => onUpdate('zipCode', e.target.value)}
            placeholder={t('address.placeholders.zipCode')}
          />
        )}
      </div>
      
      {isFieldEnabled('city') && (
        <OnboardingInput
          label={t('address.labels.cityRequired')}
          value={data.city}
          onChange={(e) => onUpdate('city', e.target.value)}
          placeholder={t('address.placeholders.city')}
        />
      )}
    </div>
  );
};

export default AddressForm;
