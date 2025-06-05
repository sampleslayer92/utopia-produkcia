
import { User, UserCheck } from "lucide-react";

interface ContactInfoSidebarProps {
  hasAutoFilled: boolean;
  userRoles: string[];
  autoFillStatus: {
    actualOwners: boolean;
    authorizedPersons: boolean;
    businessLocations: boolean;
    companyInfo: boolean;
  };
  isBasicInfoComplete: boolean;
  contractId?: string;
  contractNumber?: string;
}

const ContactInfoSidebar = ({
  hasAutoFilled,
  userRoles,
  autoFillStatus,
  isBasicInfoComplete,
  contractId,
  contractNumber
}: ContactInfoSidebarProps) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-medium text-blue-900">Kontaktné údaje</h3>
        </div>
        
        <p className="text-sm text-blue-800">
          Zadajte svoje základné kontaktné informácie, typ spoločnosti a vašu rolu v spoločnosti pre registráciu obchodného účtu.
        </p>
        
        <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
          <p className="font-medium mb-2">Dôležité informácie</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Email bude slúžiť ako vaše používateľské meno</li>
            <li>Telefón pre technickú podporu a notifikácie</li>
            <li>Všetky údaje sú chránené GDPR</li>
            <li>Na základe vašej roly sa automaticky predvyplnia údaje v ďalších krokoch</li>
            <li>Telefónne čísla majú jednotný formát vo všetkých krokoch</li>
          </ul>
        </div>

        {hasAutoFilled && userRoles && userRoles.length > 0 && (
          <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4" />
              <p className="font-medium">Automatické predvyplnenie</p>
            </div>
            <p className="mb-2">Na základe vašich rolí ({userRoles.join(', ')}) boli údaje predvyplnené v:</p>
            <ul className="space-y-1 text-xs">
              {autoFillStatus.actualOwners && <li>• Skutoční majitelia</li>}
              {autoFillStatus.authorizedPersons && <li>• Oprávnené osoby</li>}
              {autoFillStatus.businessLocations && <li>• Prevádzky (vytvorená prvá prevádzka)</li>}
              {autoFillStatus.companyInfo && <li>• Technická kontaktná osoba</li>}
            </ul>
          </div>
        )}

        {isBasicInfoComplete && !contractId && (
          <div className="bg-yellow-100/50 border border-yellow-200 rounded-lg p-4 text-xs text-yellow-800">
            <p className="font-medium">Vytvára sa zmluva...</p>
            <p className="mt-1">Po vyplnení základných údajov sa automaticky vytvorí zmluva.</p>
          </div>
        )}

        {contractId && contractNumber && (
          <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
            <p className="font-medium">Zmluva vytvorená!</p>
            <p className="mt-1">Číslo zmluvy: {contractNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfoSidebar;
