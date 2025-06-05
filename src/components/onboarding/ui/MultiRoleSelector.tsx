
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MultiRoleSelectorProps {
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
}

const MultiRoleSelector = ({ selectedRoles, onChange }: MultiRoleSelectorProps) => {
  const [selectAll, setSelectAll] = useState(false);

  const roleOptions = [
    'Majiteľ',
    'Konateľ',
    'Kontaktná osoba na prevádzku',
    'Kontaktná osoba pre technické záležitosti'
  ];

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'Majiteľ':
        return 'Údaje sa zobrazia IBA v sekcii "Skutoční majitelia"';
      case 'Konateľ':
        return 'Údaje sa zobrazia vo všetkých sekciách OKREM "Skutočných majiteľov"';
      case 'Kontaktná osoba na prevádzku':
        return 'Údaje sa zobrazia IBA ako kontaktná osoba v prevádzke';
      case 'Kontaktná osoba pre technické záležitosti':
        return 'Údaje sa zobrazia IBA ako technická osoba';
      default:
        return '';
    }
  };

  const getSelectedRolesInfo = () => {
    if (selectedRoles.length === 0) return null;
    
    if (selectedRoles.length === roleOptions.length) {
      return "Vaše údaje sa zobrazia vo všetkých relevantných sekciách onboarding procesu.";
    }

    const sections = [];
    if (selectedRoles.includes('Majiteľ')) sections.push('Skutoční majitelia');
    if (selectedRoles.includes('Konateľ')) sections.push('Oprávnené osoby', 'Technická osoba', 'Kontakt prevádzky');
    if (selectedRoles.includes('Kontaktná osoba na prevádzku')) sections.push('Kontakt prevádzky');
    if (selectedRoles.includes('Kontaktná osoba pre technické záležitosti')) sections.push('Technická osoba');

    // Remove duplicates
    const uniqueSections = [...new Set(sections)];
    
    return `Vaše údaje sa automaticky zobrazia v sekciách: ${uniqueSections.join(', ')}.`;
  };

  useEffect(() => {
    setSelectAll(roleOptions.length === selectedRoles.length && selectedRoles.length > 0);
  }, [selectedRoles]);

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      const newRoles = [...selectedRoles, role];
      onChange(newRoles);
    } else {
      const newRoles = selectedRoles.filter(r => r !== role);
      onChange(newRoles);
      setSelectAll(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      onChange([...roleOptions]);
    } else {
      onChange([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Users className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-medium text-slate-700">Vaša rola v spoločnosti *</h3>
      </div>

      {/* Select All Option */}
      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Checkbox
          id="selectAll"
          checked={selectAll}
          onCheckedChange={handleSelectAll}
        />
        <label htmlFor="selectAll" className="text-sm font-medium text-blue-800 cursor-pointer">
          Zaškrtnúť všetko
        </label>
      </div>

      {/* Individual Role Options */}
      <div className="space-y-3">
        {roleOptions.map((role) => (
          <div key={role} className="space-y-2">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={role}
                checked={selectedRoles.includes(role)}
                onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
              />
              <label htmlFor={role} className="text-sm text-slate-700 cursor-pointer font-medium">
                {role}
              </label>
            </div>
            {selectedRoles.includes(role) && (
              <div className="ml-7 text-xs text-slate-600 italic">
                {getRoleDescription(role)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Information about selected roles */}
      {selectedRoles.length > 0 && (
        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <span className="font-medium">Automatické predvyplnenie:</span> {getSelectedRolesInfo()}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MultiRoleSelector;
