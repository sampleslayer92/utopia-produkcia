
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { forwardRef } from "react";

interface OnboardingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isCompleted?: boolean;
  error?: string;
  icon?: React.ReactNode;
}

const OnboardingInput = forwardRef<HTMLInputElement, OnboardingInputProps>(
  ({ label, isCompleted, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label className="text-sm font-medium text-slate-700">
            {label}
          </Label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <Input
            ref={ref}
            className={`h-12 border-2 transition-all duration-200 ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-red-300 bg-red-50'
                : 'border-slate-200 bg-white/80 hover:border-slate-300 focus:border-blue-500 focus:shadow-md focus:shadow-blue-500/20'
            } ${className}`}
            {...props}
          />
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
  }
);

OnboardingInput.displayName = "OnboardingInput";

export default OnboardingInput;
