
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";

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
          <div key={role} className="flex items-center space-x-3">
            <Checkbox
              id={role}
              checked={selectedRoles.includes(role)}
              onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
            />
            <label htmlFor={role} className="text-sm text-slate-700 cursor-pointer">
              {role}
            </label>
          </div>
        ))}
      </div>

      {selectedRoles.length > 0 && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <span className="font-medium">Vybraté role:</span> {selectedRoles.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiRoleSelector;
