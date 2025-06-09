
import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileInfoTooltip from "./MobileInfoTooltip";

interface MobileOptimizedCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  infoTooltip?: {
    description: string;
    features?: string[];
  };
  className?: string;
}

const MobileOptimizedCard = ({ 
  title, 
  icon, 
  children, 
  infoTooltip,
  className = "" 
}: MobileOptimizedCardProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className={`border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm ${className}`}>
      <CardHeader className={`${isMobile ? 'p-4 pb-2' : 'p-6'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              {icon}
            </div>
            <h3 className={`font-medium text-slate-900 ${isMobile ? 'text-sm' : 'text-base'}`}>
              {title}
            </h3>
          </div>
          
          {isMobile && infoTooltip && (
            <MobileInfoTooltip
              title={title}
              description={infoTooltip.description}
              features={infoTooltip.features}
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'p-4 pt-0' : 'p-6 pt-0'}`}>
        {children}
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedCard;
