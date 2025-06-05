
import { OnboardingData } from "@/types/onboarding";
import ContactPersonForm from "../ui/ContactPersonForm";
import { ContactPerson } from "@/types/contactPerson";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "lucide-react";

interface CompanyContactPersonProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyContactPerson = ({ data, updateCompanyInfo }: CompanyContactPersonProps) => {
  // Convert company contact person to ContactPerson format
  const contactPersonData: ContactPerson = {
    firstName: data.companyInfo.contactPerson.firstName,
    lastName: data.companyInfo.contactPerson.lastName,
    email: data.companyInfo.contactPerson.email,
    phoneCountryCode: '+421', // Default prefix for company contact
    phoneNumber: data.companyInfo.contactPerson.phone
  };

  const handleContactPersonChange = (contactPerson: ContactPerson) => {
    updateCompanyInfo('contactPerson.firstName', contactPerson.firstName);
    updateCompanyInfo('contactPerson.lastName', contactPerson.lastName);
    updateCompanyInfo('contactPerson.email', contactPerson.email);
    updateCompanyInfo('contactPerson.phone', contactPerson.phoneNumber);
  };

  return (
    <div className="border-t border-slate-100 pt-6">
      <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
        <User className="h-4 w-4 text-blue-600" />
        Kontaktná osoba
      </h3>
      
      <ContactPersonForm
        initialValues={contactPersonData}
        onChange={handleContactPersonChange}
      />
      
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox
          id="isTechnicalPerson"
          checked={data.companyInfo.contactPerson.isTechnicalPerson}
          onCheckedChange={(checked) => updateCompanyInfo('contactPerson.isTechnicalPerson', checked)}
        />
        <label htmlFor="isTechnicalPerson" className="text-sm text-slate-700">
          Je zároveň technická osoba
        </label>
      </div>
    </div>
  );
};

export default CompanyContactPerson;
