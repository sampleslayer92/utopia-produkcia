import { Badge } from "@/components/ui/badge";
import { Globe, Users, Phone, UserCheck } from "lucide-react";

interface SourceBadgeProps {
  source: string | null;
}

const SourceBadge = ({ source }: SourceBadgeProps) => {
  const getSourceConfig = (src: string | null) => {
    switch (src) {
      case 'web':
        return { label: 'Web', icon: Globe, variant: 'default' as const };
      case 'partner':
        return { label: 'Partner', icon: Users, variant: 'secondary' as const };
      case 'direct':
        return { label: 'Priamy kontakt', icon: Phone, variant: 'outline' as const };
      case 'referral':
        return { label: 'Odporúčanie', icon: UserCheck, variant: 'outline' as const };
      default:
        return { label: 'Neznámy', icon: Globe, variant: 'outline' as const };
    }
  };

  const config = getSourceConfig(source);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center space-x-1">
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
};

export default SourceBadge;