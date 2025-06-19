
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

const stepColors = {
  0: "text-blue-600 bg-blue-50",
  1: "text-indigo-600 bg-indigo-50",
  2: "text-purple-600 bg-purple-50",
  3: "text-green-600 bg-green-50",
  4: "text-orange-600 bg-orange-50",
  5: "text-cyan-600 bg-cyan-50",
  6: "text-emerald-600 bg-emerald-50",
};

const OnboardingStepHeader = ({ 
  currentStep, 
  totalSteps, 
  title, 
  description 
}: OnboardingStepHeaderProps) => {
  const IconComponent = stepIcons[currentStep as keyof typeof stepIcons] || User;
  const colorClass = stepColors[currentStep as keyof typeof stepColors] || "text-blue-600 bg-blue-50";
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Card className="mb-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-xl ${colorClass} shadow-sm`}>
            <IconComponent className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-semibold text-slate-800">
                {title}
              </h1>
              <div className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-full">
                {currentStep + 1}/{totalSteps}
              </div>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              {description}
            </p>
            
            <div className="flex items-center gap-3">
              <Progress value={progressPercentage} className="flex-1 h-1.5 bg-slate-100" />
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
