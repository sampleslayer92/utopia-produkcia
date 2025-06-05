
import { User } from "lucide-react";
import ContactPersonForm from "../ui/ContactPersonForm";
import { ContactPerson } from "@/types/contactPerson";

interface ContactPersonSectionProps {
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  onUpdate: (field: string, value: string) => void;
}

const ContactPersonSection = ({
  contactPerson,
  onUpdate
}: ContactPersonSectionProps) => {
  // Parse name into firstName and lastName
  const nameParts = contactPerson.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Convert to ContactPerson format
  const contactPersonData: ContactPerson = {
    firstName,
    lastName,
    email: contactPerson.email,
    phoneCountryCode: '+421', // Default prefix
    phoneNumber: contactPerson.phone
  };

  const handleContactPersonChange = (contactPersonNew: ContactPerson) => {
    const fullName = `${contactPersonNew.firstName} ${contactPersonNew.lastName}`.trim();
    onUpdate('contactPerson.name', fullName);
    onUpdate('contactPerson.email', contactPersonNew.email);
    onUpdate('contactPerson.phone', contactPersonNew.phoneNumber);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
        <User className="h-4 w-4" />
        Kontaktná osoba pre prevádzku
      </h4>
      
      <ContactPersonForm
        initialValues={contactPersonData}
        onChange={handleContactPersonChange}
      />
    </div>
  );
};

export default ContactPersonSection;
