import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleFiltersProps {
  children: React.ReactNode;
  activeFiltersCount: number;
  defaultOpen?: boolean;
}

const CollapsibleFilters = ({ children, activeFiltersCount, defaultOpen = false }: CollapsibleFiltersProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-900">Filtre</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {activeFiltersCount} aktívnych
                  </Badge>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-slate-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-600" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsibleFilters;