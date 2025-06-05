
import { useState, useEffect } from "react";
import { Users, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OnboardingSelect from "./OnboardingSelect";

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
      description: 'Údaje sa zobrazia v sekciách: "Oprávnené osoby", "Technická osoba", "Kontakt prevádzky"'
    },
    {
      value: 'Kontaktná osoba na prevádzku',
      label: 'Kontaktná osoba na prevádzku',
      description: 'Údaje sa zobrazia IBA ako "Kontakt prevádzky"'
    },
    {
      value: 'Kontaktná osoba pre technické záležitosti',
      label: 'Kontaktná osoba pre technické záležitosti',
      description: 'Údaje sa zobrazia IBA ako "Technická osoba"'
    }
  ];

  const getSelectedRoleInfo = (selectedRole: string) => {
    if (!selectedRole) return null;
    
    switch (selectedRole) {
      case 'Majiteľ':
        return "Vaše údaje sa automaticky zobrazia v sekcii: Skutoční majitelia.";
      case 'Konateľ':
        return "Vaše údaje sa automaticky zobrazia v sekciách: Oprávnené osoby, Technická osoba, Kontakt prevádzky.";
      case 'Kontaktná osoba na prevádzku':
        return "Vaše údaje sa automaticky zobrazia v sekcii: Kontakt prevádzky.";
      case 'Kontaktná osoba pre technické záležitosti':
        return "Vaše údaje sa automaticky zobrazia v sekcii: Technická osoba.";
      default:
        return null;
    }
  };

  const handleRoleChange = (role: string) => {
    console.log('Role changed to:', role);
    // Convert single role to array for backward compatibility
    onChange(role ? [role] : []);
  };

  // Get the selected role (first item from array for backward compatibility)
  const selectedRole = Array.isArray(selectedRoles) && selectedRoles.length > 0 ? selectedRoles[0] : '';
  const selectedRoleOption = roleOptions.find(opt => opt.value === selectedRole);

  return (
    <div className="space-y-4 relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <Users className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-medium text-slate-700">Vaša rola v spoločnosti *</h3>
      </div>

      {/* Single Role Dropdown */}
      <OnboardingSelect
        placeholder="Vyberte vašu rolu v spoločnosti..."
        value={selectedRole}
        onValueChange={handleRoleChange}
        options={roleOptions}
        isCompleted={Boolean(selectedRole)}
      />

      {/* Selected Role Description */}
      {selectedRoleOption && (
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="font-medium text-sm text-slate-800">{selectedRoleOption.label}</div>
          <div className="text-xs text-slate-600 mt-1 italic">
            {selectedRoleOption.description}
          </div>
        </div>
      )}

      {/* Information about selected role */}
      {selectedRole && (
        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <span className="font-medium">Automatické predvyplnenie:</span> {getSelectedRoleInfo(selectedRole)}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MultiRoleSelector;
