
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useComprehensiveMerchantFix } from "@/hooks/useComprehensiveMerchantFix";

const MerchantFixButton = () => {
  const merchantFix = useComprehensiveMerchantFix();

  const handleFix = () => {
    const confirmed = window.confirm(
      'Chcete spustiť automatickú opravu obchodníkov a prevádzok pre všetky zmluvy? Táto operácia môže trvať niekoľko minút.'
    );
    
    if (confirmed) {
      merchantFix.mutate();
    }
  };

  return (
    <Button
      onClick={handleFix}
      disabled={merchantFix.isPending}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${merchantFix.isPending ? 'animate-spin' : ''}`} />
      {merchantFix.isPending ? 'Opravujem...' : 'Opraviť obchodníkov'}
    </Button>
  );
};

export default MerchantFixButton;
