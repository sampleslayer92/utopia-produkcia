
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";

interface OnboardingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const OnboardingTextarea = forwardRef<HTMLTextAreaElement, OnboardingTextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label className="text-sm font-medium text-slate-700">
            {label}
          </Label>
        )}
        <Textarea
          ref={ref}
          className={`border transition-all duration-200 resize-none ${
            error
              ? 'border-red-300 bg-red-50/50 focus:border-red-400'
              : 'border-slate-200 bg-white/80 hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
          } ${className}`}
          {...props}
        />
        {helperText && !error && (
          <p className="text-sm text-slate-500">
            {helperText}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

OnboardingTextarea.displayName = "OnboardingTextarea";

export default OnboardingTextarea;
