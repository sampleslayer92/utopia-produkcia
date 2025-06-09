
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MobileOptimizedCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  infoTooltip?: {
    description: string;
    features: string[];
  };
}

const MobileOptimizedCard = ({ title, icon, children, infoTooltip }: MobileOptimizedCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          </div>
          
          {infoTooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <Info className="h-4 w-4 text-slate-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-80">
                  <div className="space-y-2">
                    <p className="text-sm">{infoTooltip.description}</p>
                    <div>
                      <p className="text-xs font-medium mb-1">{t('onboarding.infoTooltip.features')}:</p>
                      <ul className="text-xs space-y-1">
                        {infoTooltip.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedCard;
