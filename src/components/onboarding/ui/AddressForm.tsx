
import { MapPin } from "lucide-react";
import OnboardingInput from "./OnboardingInput";

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
  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {title}
      </h4>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <OnboardingInput
            label="Ulica a číslo *"
            value={data.street}
            onChange={(e) => onUpdate('street', e.target.value)}
            placeholder="Obchodná ulica 456"
          />
        </div>
        
        <OnboardingInput
          label="PSČ *"
          value={data.zipCode}
          onChange={(e) => onUpdate('zipCode', e.target.value)}
          placeholder="01001"
        />
      </div>
      
      <OnboardingInput
        label="Mesto *"
        value={data.city}
        onChange={(e) => onUpdate('city', e.target.value)}
        placeholder="Bratislava"
      />
    </div>
  );
};

export default AddressForm;
