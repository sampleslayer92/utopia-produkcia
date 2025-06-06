
import { useState } from "react";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MobileInfoTooltipProps {
  title: string;
  description: string;
  features?: string[];
  className?: string;
}

const MobileInfoTooltip = ({ title, description, features, className }: MobileInfoTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative inline-block", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-6 w-6 p-0 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
      >
        <Info className="h-3 w-3" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Mobile Modal */}
          <Card className="fixed inset-x-4 top-20 z-50 shadow-lg md:hidden animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-slate-900 text-sm">{title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0 -mt-1 -mr-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-xs text-slate-700 mb-3">{description}</p>
              
              {features && features.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <ul className="space-y-1 text-xs text-blue-800">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Desktop Tooltip */}
          <Card className="absolute left-6 top-0 w-72 z-50 shadow-lg hidden md:block animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-slate-900 text-sm">{title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-5 w-5 p-0 -mt-1 -mr-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <p className="text-xs text-slate-700 mb-3">{description}</p>
              
              {features && features.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <ul className="space-y-1 text-xs text-blue-800">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default MobileInfoTooltip;
