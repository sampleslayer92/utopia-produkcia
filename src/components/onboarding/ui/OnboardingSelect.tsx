
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface OnboardingSelectProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string; extra?: string }[];
  placeholder?: string;
  isCompleted?: boolean;
  error?: string;
  disabled?: boolean;
  hideLabel?: boolean;
  compact?: boolean;
  showTooltip?: boolean;
}

const OnboardingSelect = ({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  isCompleted,
  error,
  disabled = false,
  hideLabel,
  compact = false,
  showTooltip = false
}: OnboardingSelectProps) => {
  return (
    <div className="space-y-2">
      {label && !hideLabel && (
        <Label className="text-sm font-medium text-slate-700">
          {label}
        </Label>
      )}
      <div className="relative">
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger 
            className={`${compact ? 'h-10' : 'h-12'} border-2 transition-all duration-200 ${
              error
                ? 'border-red-300 bg-red-50'
                : 'border-slate-200 bg-white/80 hover:border-slate-300 focus:border-blue-500 focus:shadow-md focus:shadow-blue-500/20'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
                {option.extra && showTooltip && (
                  <span className="text-xs text-slate-500 ml-1">({option.extra})</span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isCompleted && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default OnboardingSelect;
