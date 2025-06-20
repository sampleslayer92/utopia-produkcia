
import { User, Building, Store, Monitor, Users, UserCheck, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface OnboardingStepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
}

const stepIcons = {
  0: User,
  1: Building,
  2: Store,
  3: Monitor,
  4: Users,
  5: UserCheck,
  6: FileCheck,
};

const stepGradients = {
  0: "from-blue-50 to-indigo-50",
  1: "from-sky-50 to-blue-50",
  2: "from-indigo-50 to-blue-50",
  3: "from-blue-50 to-slate-50",
  4: "from-slate-50 to-blue-50",
  5: "from-sky-50 to-cyan-50",
  6: "from-blue-50 to-indigo-50",
};

const stepIconColors = {
  0: "text-blue-600",
  1: "text-sky-600",
  2: "text-indigo-600",
  3: "text-blue-700",
  4: "text-slate-600",
  5: "text-cyan-600",
  6: "text-indigo-600",
};

const OnboardingStepHeader = ({ 
  currentStep, 
  totalSteps, 
  title, 
  description 
}: OnboardingStepHeaderProps) => {
  const IconComponent = stepIcons[currentStep as keyof typeof stepIcons] || User;
  const gradientClass = stepGradients[currentStep as keyof typeof stepGradients] || "from-blue-50 to-indigo-50";
  const iconColorClass = stepIconColors[currentStep as keyof typeof stepIconColors] || "text-blue-600";
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Card className={`mb-8 bg-gradient-to-r ${gradientClass} border-0 shadow-sm`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg bg-white shadow-sm ${iconColorClass}`}>
            <IconComponent className="h-6 w-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {title}
              </h1>
              <div className="text-sm text-slate-500 font-medium">
                Krok {currentStep + 1}/{totalSteps}
              </div>
            </div>
            
            <p className="text-slate-600 mb-4">
              {description}
            </p>
            
            <div className="flex items-center gap-3">
              <Progress value={progressPercentage} className="flex-1 h-2" />
              <div className="text-xs text-slate-500 font-medium min-w-fit">
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OnboardingStepHeader;
