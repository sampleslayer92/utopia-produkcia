
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

  // Debug logging
  console.log('MultiRoleSelector render:', { selectedRoles, onChange: typeof onChange });

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
    const shouldSelectAll = roleOptions.length === selectedRoles.length && selectedRoles.length > 0;
    setSelectAll(shouldSelectAll);
  }, [selectedRoles]);

  const handleRoleChange = (role: string, checked: boolean) => {
    console.log('Role change:', { role, checked, currentRoles: selectedRoles });
    
    let newRoles: string[];
    if (checked) {
      newRoles = [...selectedRoles, role];
    } else {
      newRoles = selectedRoles.filter(r => r !== role);
      setSelectAll(false);
    }
    
    console.log('New roles:', newRoles);
    onChange(newRoles);
  };

  const handleSelectAll = (checked: boolean) => {
    console.log('Select all:', { checked });
    setSelectAll(checked);
    if (checked) {
      onChange([...roleOptions]);
    } else {
      onChange([]);
    }
  };

  // Ensure selectedRoles is always an array
  const safeSelectedRoles = Array.isArray(selectedRoles) ? selectedRoles : [];

  return (
    <div className="space-y-4 relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <Users className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-medium text-slate-700">Vaša rola v spoločnosti *</h3>
      </div>

      {/* Select All Option */}
      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
        <Checkbox
          id="selectAll"
          checked={selectAll}
          onCheckedChange={handleSelectAll}
          className="pointer-events-auto"
        />
        <label 
          htmlFor="selectAll" 
          className="text-sm font-medium text-blue-800 cursor-pointer flex-1 pointer-events-auto"
          onClick={() => handleSelectAll(!selectAll)}
        >
          Zaškrtnúť všetko
        </label>
      </div>

      {/* Individual Role Options */}
      <div className="space-y-3">
        {roleOptions.map((role) => {
          const isSelected = safeSelectedRoles.includes(role);
          return (
            <div key={role} className="space-y-2">
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors">
                <Checkbox
                  id={role}
                  checked={isSelected}
                  onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                  className="pointer-events-auto"
                />
                <label 
                  htmlFor={role} 
                  className="text-sm text-slate-700 cursor-pointer font-medium flex-1 pointer-events-auto"
                  onClick={() => handleRoleChange(role, !isSelected)}
                >
                  {role}
                </label>
              </div>
              {isSelected && (
                <div className="ml-7 text-xs text-slate-600 italic bg-slate-50 p-2 rounded">
                  {getRoleDescription(role)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Information about selected roles */}
      {safeSelectedRoles.length > 0 && (
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
