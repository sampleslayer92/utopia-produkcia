
interface OnboardingSectionProps {
  children: React.ReactNode;
  className?: string;
}

const OnboardingSection = ({ children, className = "" }: OnboardingSectionProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export default OnboardingSection;
