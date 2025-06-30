
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AdminAccountCreator = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createAdminAccount = async () => {
    setIsCreating(true);
    
    try {
      // Vytvorenie admin účtu cez Supabase Auth API
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@utopia.com',
        password: 'admin123',
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Admin účet vytvorený",
        description: "Admin účet bol úspešne vytvorený. Automaticky sa prihlásite...",
      });

      // Krátka pauza a automatické prihlásenie
      setTimeout(async () => {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'admin@utopia.com',
          password: 'admin123'
        });

        if (!signInError) {
          toast({
            title: "Prihlásenie úspešné",
            description: "Vitajte v admin dashboard!",
          });
        } else {
          toast({
            title: "Účet vytvorený",
            description: "Prosím, prihláste sa manuálne s heslom 'admin123'.",
          });
        }
      }, 1000);

    } catch (error: any) {
      console.error('Error creating admin account:', error);
      toast({
        title: "Chyba pri vytváraní účtu",
        description: error.message || "Nepodarilo sa vytvoriť admin účet.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className="text-sm text-slate-600 space-y-2">
        <p><strong>Admin prístup:</strong></p>
        <p>Email: admin@utopia.com</p>
        <p>Heslo: admin123</p>
        <p className="text-xs">Ak admin účet neexistuje, vytvorte ho:</p>
      </div>
      <Button 
        onClick={createAdminAccount} 
        disabled={isCreating}
        variant="outline"
        className="w-full"
      >
        {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Vytvoriť Admin Účet
      </Button>
    </div>
  );
};

export default AdminAccountCreator;
