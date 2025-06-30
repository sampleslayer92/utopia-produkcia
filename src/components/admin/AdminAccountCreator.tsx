
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
        password: 'admin',
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Admin účet vytvorený",
        description: "Admin účet bol úspešne vytvorený. Môžete sa teraz prihlásiť.",
      });

      // Automatické prihlásenie po vytvorení účtu
      setTimeout(async () => {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'admin@utopia.com',
          password: 'admin'
        });

        if (!signInError) {
          toast({
            title: "Prihlásenie úspešné",
            description: "Vitajte v admin dashboard!",
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
      <p className="text-sm text-slate-600">
        Ak admin účet neexistuje, môžete ho vytvoriť:
      </p>
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
