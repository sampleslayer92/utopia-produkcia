import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CompletionBadgeProps {
  percentage: number;
  currentStep?: number | null;
}

const CompletionBadge = ({ percentage, currentStep }: CompletionBadgeProps) => {
  const getVariant = () => {
    if (percentage >= 100) return "default";
    if (percentage >= 75) return "secondary";
    if (percentage >= 50) return "outline";
    return "outline";
  };

  return (
    <div className="flex items-center space-x-2">
      <Progress value={percentage} className="w-16 h-2" />
      <Badge variant={getVariant()} className="text-xs">
        {currentStep ? `${currentStep}/7` : `${percentage}%`}
      </Badge>
    </div>
  );
};

export default CompletionBadge;