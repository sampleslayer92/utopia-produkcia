
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import AddressForm from "../ui/AddressForm";
import ContactPersonForm from "./ContactPersonForm";
import { Building2, FileText, MapPin } from "lucide-react";
import { companyInfoSchema, CompanyInfoFormData } from "../validation/schemas";
import { useValidatedForm } from "../hooks/useValidatedForm";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation('forms');

  const registryTypeOptions = [
    { value: 'public', label: t('companyInfo.registryTypeOptions.public') },
    { value: 'business', label: t('companyInfo.registryTypeOptions.business') },
    { value: 'other', label: t('companyInfo.registryTypeOptions.other') }
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

  // Ensure we have default values for required contact person fields with proper typing
  const contactPersonData = {
    salutation: (data.contactPerson?.salutation || '') as '' | 'Pan' | 'Pani',
    firstName: data.contactPerson?.firstName || '',
    lastName: data.contactPerson?.lastName || '',
    email: data.contactPerson?.email || '',
    phone: data.contactPerson?.phone || '',
    isTechnicalPerson: data.contactPerson?.isTechnicalPerson || false
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Basic Company Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-500" />
          {t('companyInfo.basicInfo')}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <OnboardingInput
            label={t('companyInfo.labels.icoRequired')}
            value={data.ico}
            onChange={(e) => updateField('ico', e.target.value)}
            placeholder={t('companyInfo.placeholders.ico')}
            isCompleted={completedFields.has('ico')}
            error={errors.ico}
          />

          <OnboardingInput
            label={t('companyInfo.labels.dicRequired')}
            value={data.dic}
            onChange={(e) => updateField('dic', e.target.value)}
            placeholder={t('companyInfo.placeholders.dic')}
            isCompleted={completedFields.has('dic')}
            error={errors.dic}
          />
        </div>

        <OnboardingInput
          label={t('companyInfo.labels.companyNameRequired')}
          value={data.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          placeholder={t('companyInfo.placeholders.companyName')}
          isCompleted={completedFields.has('companyName')}
          error={errors.companyName}
        />

        <OnboardingSelect
          label={t('companyInfo.labels.registryTypeRequired')}
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
              {t('companyInfo.checkboxes.isVatPayer')}
            </label>
          </div>

          {data.isVatPayer && (
            <OnboardingInput
              label={t('companyInfo.labels.vatNumberRequired')}
              value={data.vatNumber || ''}
              onChange={(e) => updateField('vatNumber', e.target.value)}
              placeholder={t('companyInfo.placeholders.vatNumber')}
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
          {t('companyInfo.registryInfo')}
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <OnboardingInput
            label={t('companyInfo.labels.courtLabel')}
            value={data.court || ''}
            onChange={(e) => updateField('court', e.target.value)}
            placeholder={t('companyInfo.placeholders.court')}
            isCompleted={completedFields.has('court')}
            error={errors.court}
          />

          <OnboardingInput
            label={t('companyInfo.labels.sectionLabel')}
            value={data.section || ''}
            onChange={(e) => updateField('section', e.target.value)}
            placeholder={t('companyInfo.placeholders.section')}
            isCompleted={completedFields.has('section')}
            error={errors.section}
          />

          <OnboardingInput
            label={t('companyInfo.labels.insertNumberLabel')}
            value={data.insertNumber || ''}
            onChange={(e) => updateField('insertNumber', e.target.value)}
            placeholder={t('companyInfo.placeholders.insertNumber')}
            isCompleted={completedFields.has('insertNumber')}
            error={errors.insertNumber}
          />
        </div>
      </div>

      {/* Address */}
      <AddressForm
        title={t('companyInfo.addressSection')}
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
            {t('companyInfo.checkboxes.contactAddressSameAsMain')}
          </label>
        </div>

        {!data.contactAddressSameAsMain && (
          <AddressForm
            title={t('companyInfo.contactAddressSection')}
            data={contactAddressData}
            onUpdate={handleContactAddressUpdate}
          />
        )}
      </div>

      {/* Contact Person */}
      <ContactPersonForm
        data={contactPersonData}
        onUpdate={handleContactPersonUpdate}
        showTechnicalPersonOption={true}
      />
    </div>
  );
};

export default CompanyInfoForm;
