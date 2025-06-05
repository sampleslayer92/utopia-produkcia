
import { useState, useEffect } from "react";
import { Users, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MultiselectDropdown from "./MultiselectDropdown";

interface MultiRoleSelectorProps {
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
}

const MultiRoleSelector = ({ selectedRoles, onChange }: MultiRoleSelectorProps) => {
  // Debug logging
  console.log('MultiRoleSelector render:', { selectedRoles, onChange: typeof onChange });

  const roleOptions = [
    {
      value: 'Majiteľ',
      label: 'Majiteľ',
      description: 'Údaje sa zobrazia IBA v sekcii "Skutoční majitelia"'
    },
    {
      value: 'Konateľ',
      label: 'Konateľ',
      description: 'Údaje sa zobrazia vo všetkých sekciách OKREM "Skutočných majiteľov"'
    },
    {
      value: 'Kontaktná osoba na prevádzku',
      label: 'Kontaktná osoba na prevádzku',
      description: 'Údaje sa zobrazia IBA ako kontaktná osoba v prevádzke'
    },
    {
      value: 'Kontaktná osoba pre technické záležitosti',
      label: 'Kontaktná osoba pre technické záležitosti',
      description: 'Údaje sa zobrazia IBA ako technická osoba'
    }
  ];

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

  const handleRolesChange = (roles: string[]) => {
    console.log('Roles changed to:', roles);
    onChange(roles);
  };

  // Ensure selectedRoles is always an array
  const safeSelectedRoles = Array.isArray(selectedRoles) ? selectedRoles : [];

  return (
    <div className="space-y-4 relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <Users className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-medium text-slate-700">Vaša rola v spoločnosti *</h3>
      </div>

      {/* Multiselect Dropdown */}
      <MultiselectDropdown
        options={roleOptions}
        selectedValues={safeSelectedRoles}
        onSelectionChange={handleRolesChange}
        placeholder="Vyberte vaše role v spoločnosti..."
        showSelectAll={true}
        className="w-full"
      />

      {/* Selected Roles Descriptions */}
      {safeSelectedRoles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Vybraté role:</h4>
          {safeSelectedRoles.map(role => {
            const option = roleOptions.find(opt => opt.value === role);
            return (
              <div key={role} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-medium text-sm text-slate-800">{role}</div>
                <div className="text-xs text-slate-600 mt-1 italic">
                  {option?.description}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
