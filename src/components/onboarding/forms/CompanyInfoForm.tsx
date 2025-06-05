
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import AddressForm from "../ui/AddressForm";
import ContactPersonForm from "./ContactPersonForm";
import { Building2, FileText, MapPin } from "lucide-react";
import { companyInfoSchema, CompanyInfoFormData } from "../validation/schemas";
import { useValidatedForm } from "../hooks/useValidatedForm";

interface CompanyInfoFormProps {
  data: CompanyInfoFormData;
  onUpdate: (field: string, value: any) => void;
  className?: string;
}

const CompanyInfoForm = ({ data, onUpdate, className = "" }: CompanyInfoFormProps) => {
  const { errors, completedFields, updateField } = useValidatedForm(
    companyInfoSchema,
    data,
    onUpdate
  );

  const registryTypeOptions = [
    { value: 'public', label: 'Verejný register' },
    { value: 'business', label: 'Živnostenský register' },
    { value: 'other', label: 'Iný' }
  ];

  const handleAddressUpdate = (field: keyof typeof data.address, value: string) => {
    updateField(`address.${field}`, value);
  };

  const handleContactPersonUpdate = (field: string, value: any) => {
    updateField(`contactPerson.${field}`, value);
  };

  const handleContactAddressUpdate = (field: keyof typeof data.address, value: string) => {
    updateField(`contactAddress.${field}`, value);
  };

  // Ensure we have default values for required address fields
  const addressData = {
    street: data.address?.street || '',
    city: data.address?.city || '',
    zipCode: data.address?.zipCode || ''
  };

  const contactAddressData = data.contactAddress ? {
    street: data.contactAddress.street || '',
    city: data.contactAddress.city || '',
    zipCode: data.contactAddress.zipCode || ''
  } : {
    street: '',
    city: '',
    zipCode: ''
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Basic Company Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-500" />
          Základné údaje
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <OnboardingInput
            label="IČO *"
            value={data.ico}
            onChange={(e) => updateField('ico', e.target.value)}
            placeholder="12345678"
            isCompleted={completedFields.has('ico')}
            error={errors.ico}
          />

          <OnboardingInput
            label="DIČ *"
            value={data.dic}
            onChange={(e) => updateField('dic', e.target.value)}
            placeholder="SK2012345678"
            isCompleted={completedFields.has('dic')}
            error={errors.dic}
          />
        </div>

        <OnboardingInput
          label="Obchodné meno *"
          value={data.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          placeholder="Názov spoločnosti"
          isCompleted={completedFields.has('companyName')}
          error={errors.companyName}
        />

        <OnboardingSelect
          label="Typ registra *"
          value={data.registryType}
          onValueChange={(value) => updateField('registryType', value)}
          options={registryTypeOptions}
          isCompleted={completedFields.has('registryType')}
          error={errors.registryType}
        />

        {/* VAT Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isVatPayer"
              checked={data.isVatPayer}
              onChange={(e) => updateField('isVatPayer', e.target.checked)}
              className="rounded border-slate-300"
            />
            <label htmlFor="isVatPayer" className="text-sm text-slate-700">
              Je platcom DPH
            </label>
          </div>

          {data.isVatPayer && (
            <OnboardingInput
              label="IČ DPH *"
              value={data.vatNumber || ''}
              onChange={(e) => updateField('vatNumber', e.target.value)}
              placeholder="SK2012345678"
              isCompleted={completedFields.has('vatNumber')}
              error={errors.vatNumber}
            />
          )}
        </div>
      </div>

      {/* Registry Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Údaje z registra
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <OnboardingInput
            label="Súd"
            value={data.court || ''}
            onChange={(e) => updateField('court', e.target.value)}
            placeholder="Okresný súd"
            isCompleted={completedFields.has('court')}
            error={errors.court}
          />

          <OnboardingInput
            label="Oddiel"
            value={data.section || ''}
            onChange={(e) => updateField('section', e.target.value)}
            placeholder="Sro"
            isCompleted={completedFields.has('section')}
            error={errors.section}
          />

          <OnboardingInput
            label="Vložka"
            value={data.insertNumber || ''}
            onChange={(e) => updateField('insertNumber', e.target.value)}
            placeholder="12345/B"
            isCompleted={completedFields.has('insertNumber')}
            error={errors.insertNumber}
          />
        </div>
      </div>

      {/* Address */}
      <AddressForm
        title="Sídlo spoločnosti"
        data={addressData}
        onUpdate={handleAddressUpdate}
      />

      {/* Contact Address */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="contactAddressSameAsMain"
            checked={data.contactAddressSameAsMain}
            onChange={(e) => updateField('contactAddressSameAsMain', e.target.checked)}
            className="rounded border-slate-300"
          />
          <label htmlFor="contactAddressSameAsMain" className="text-sm text-slate-700">
            Kontaktná adresa je rovnaká ako sídlo spoločnosti
          </label>
        </div>

        {!data.contactAddressSameAsMain && (
          <AddressForm
            title="Kontaktná adresa"
            data={contactAddressData}
            onUpdate={handleContactAddressUpdate}
          />
        )}
      </div>

      {/* Contact Person */}
      <ContactPersonForm
        data={data.contactPerson}
        onUpdate={handleContactPersonUpdate}
        showTechnicalPersonOption={true}
      />
    </div>
  );
};

export default CompanyInfoForm;
