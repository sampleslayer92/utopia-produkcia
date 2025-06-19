
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InfoBannerProps {
  title: string;
  keyPoints: string[];
  onShowDetails: () => void;
  className?: string;
}

const InfoBanner = ({ title, keyPoints, onShowDetails, className = "" }: InfoBannerProps) => {
  return (
    <div className={`bg-blue-50/80 border border-blue-200/60 rounded-lg p-4 mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-blue-900 text-sm mb-1">{title}</h3>
            <p className="text-xs text-blue-700">
              {keyPoints.join(' • ')}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onShowDetails}
          className="text-blue-700 hover:text-blue-800 hover:bg-blue-100/50 h-8 w-8 p-0"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default InfoBanner;
