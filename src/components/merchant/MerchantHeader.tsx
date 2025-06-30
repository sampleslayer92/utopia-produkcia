
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { MerchantAuthData } from "@/hooks/useMerchantAuth";

interface MerchantHeaderProps {
  merchantData: MerchantAuthData;
}

const MerchantHeader = ({ merchantData }: MerchantHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Odhlásenie úspešné",
        description: "Boli ste úspešne odhlásení.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Chyba pri odhlasovaní",
        description: "Nepodarilo sa vás odhlásiť.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {merchantData.merchant.company_name}
              </h1>
              <p className="text-sm text-slate-600">
                {merchantData.merchant.contact_person_name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              <User className="h-3 w-3 mr-1" />
              Merchant
            </Badge>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-slate-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Odhlásiť sa
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MerchantHeader;
