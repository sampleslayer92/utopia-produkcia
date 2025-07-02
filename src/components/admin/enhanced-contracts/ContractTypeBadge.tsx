import { Badge } from "@/components/ui/badge";
import { Star, Award, Crown } from "lucide-react";

interface ContractTypeBadgeProps {
  type: string;
}

const ContractTypeBadge = ({ type }: ContractTypeBadgeProps) => {
  const getTypeConfig = (contractType: string) => {
    switch (contractType) {
      case 'Enterprise':
        return { label: 'Enterprise', icon: Crown, variant: 'default' as const, className: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'Premium':
        return { label: 'Premium', icon: Award, variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'Standard':
        return { label: 'Standard', icon: Star, variant: 'outline' as const, className: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { label: type, icon: Star, variant: 'outline' as const, className: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const config = getTypeConfig(type);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`flex items-center space-x-1 ${config.className}`}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
};

export default ContractTypeBadge;