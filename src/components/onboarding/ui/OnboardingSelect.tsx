
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface OnboardingSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: { value: string; label: string; extra?: string }[];
  isCompleted?: boolean;
  error?: string;
  className?: string;
}

const OnboardingSelect = ({
  label,
  placeholder,
  value,
  onValueChange,
  options,
  isCompleted,
  error,
  className
}: OnboardingSelectProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-slate-700">
          {label}
        </Label>
      )}
      <div className="relative">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className={`h-12 border-2 transition-all duration-200 ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-slate-200 bg-white/80 hover:border-slate-300 focus:border-blue-500 focus:shadow-md focus:shadow-blue-500/20'
          } ${className}`}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 shadow-xl">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="flex items-center gap-2">
                  <span>{option.label}</span>
                  {option.extra && (
                    <span className="text-sm text-slate-500">{option.extra}</span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isCompleted && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
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
