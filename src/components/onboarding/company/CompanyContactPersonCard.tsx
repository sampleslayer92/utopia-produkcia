
import { OnboardingData } from "@/types/onboarding";
import ContactPersonForm from "../ui/ContactPersonForm";
import { ContactPerson } from "@/types/contactPerson";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "lucide-react";

interface CompanyContactPersonCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyContactPersonCard = ({ data, updateCompanyInfo }: CompanyContactPersonCardProps) => {
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
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <User className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-900">Kontaktná osoba</h3>
      </div>

      <ContactPersonForm
        initialValues={contactPersonData}
        onChange={handleContactPersonChange}
      />
      
      <div className="flex items-center space-x-2">
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

export default CompanyContactPersonCard;
