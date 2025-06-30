
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useComprehensiveMerchantFix } from "@/hooks/useComprehensiveMerchantFix";
import { useImprovedMerchantTrigger } from "@/hooks/useImprovedMerchantTrigger";
import { RefreshCw, Settings, TestTube } from "lucide-react";

const MerchantTestingPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const merchantFix = useComprehensiveMerchantFix();
  const triggerUpdate = useImprovedMerchantTrigger();

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline" 
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <TestTube className="h-4 w-4 mr-2" />
        Debug Panel
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Debug Panel</CardTitle>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={() => merchantFix.mutate()}
          disabled={merchantFix.isPending}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${merchantFix.isPending ? 'animate-spin' : ''}`} />
          {merchantFix.isPending ? 'Opravujem...' : 'Fix všetkých obchodníkov'}
        </Button>
        
        <Button
          onClick={() => triggerUpdate.mutate()}
          disabled={triggerUpdate.isPending}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <Settings className={`h-4 w-4 mr-2 ${triggerUpdate.isPending ? 'animate-spin' : ''}`} />
          {triggerUpdate.isPending ? 'Kontrolujem...' : 'Skontrolovať triggery'}
        </Button>
        
        <div className="text-xs text-slate-500 mt-2">
          Panel pre testovanie a opravu merchant problémov
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantTestingPanel;
