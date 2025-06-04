
import { Checkbox } from "@/components/ui/checkbox";

interface SelectionCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const SelectionCheckbox = ({ checked, onCheckedChange, disabled = false }: SelectionCheckboxProps) => {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
    />
  );
};

export default SelectionCheckbox;
