
import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MultiselectOption {
  value: string;
  label: string;
  description?: string;
}

interface MultiselectDropdownProps {
  options: MultiselectOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  showSelectAll?: boolean;
}

const MultiselectDropdown = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Vyberte možnosti...",
  className = "",
  showSelectAll = true
}: MultiselectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    onSelectionChange(newValues);
  };

  const handleSelectAll = () => {
    const allValues = options.map(option => option.value);
    const isAllSelected = allValues.every(value => selectedValues.includes(value));
    
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allValues);
    }
  };

  const removeBadge = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter(v => v !== value);
    onSelectionChange(newValues);
  };

  const isAllSelected = options.length > 0 && options.every(option => selectedValues.includes(option.value));

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[48px] px-3 py-2 border-2 border-slate-200 bg-white/80 rounded-md text-left flex items-center justify-between hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:shadow-md focus:shadow-blue-500/20 transition-all duration-200"
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selectedValues.length === 0 ? (
            <span className="text-slate-500">{placeholder}</span>
          ) : (
            selectedValues.map(value => {
              const option = options.find(opt => opt.value === value);
              return (
                <Badge
                  key={value}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs flex items-center gap-1"
                >
                  {option?.label}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-blue-900"
                    onClick={(e) => removeBadge(value, e)}
                  />
                </Badge>
              );
            })
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {showSelectAll && (
            <div
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-slate-100"
              onClick={handleSelectAll}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 border border-slate-300 rounded flex items-center justify-center ${isAllSelected ? 'bg-blue-600 border-blue-600' : ''}`}>
                  {isAllSelected && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="text-sm font-medium text-blue-800">
                  {isAllSelected ? 'Zrušiť všetko' : 'Zaškrtnúť všetko'}
                </span>
              </div>
            </div>
          )}
          
          {options.map(option => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <div
                key={option.value}
                className="px-3 py-2 hover:bg-slate-50 cursor-pointer"
                onClick={() => handleOptionToggle(option.value)}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 border border-slate-300 rounded flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : ''}`}>
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-sm text-slate-700 font-medium">
                    {option.label}
                  </span>
                </div>
                {option.description && (
                  <div className="ml-6 text-xs text-slate-600 mt-1">
                    {option.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiselectDropdown;
