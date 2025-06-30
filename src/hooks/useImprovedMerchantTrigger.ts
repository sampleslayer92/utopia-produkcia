
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export const useImprovedMerchantTrigger = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      console.log('Trigger update requested...');
      
      // Since we cannot execute raw SQL from the client, we need to inform the user
      // that database triggers need to be set up manually by a database administrator
      
      toast({
        title: "Trigger aktualizácia",
        description: "Pre vylepšenie triggerov je potrebné manuálne nastavenie databázy administrátorom.",
      });
      
      return { success: true, requiresManualSetup: true };
    },
    onSuccess: (result) => {
      console.log('Trigger update process completed:', result);
      if (result.requiresManualSetup) {
        toast({
          title: "Poznámka",
          description: "Pre automatické vytváranie merchantov je potrebné nastaviť databázové triggery manuálne.",
        });
      }
    },
    onError: (error: any) => {
      console.error('Trigger update failed:', error);
      toast({
        title: "Chyba",
        description: `Nepodarilo sa aktualizovať trigger: ${error.message}`,
        variant: "destructive",
      });
    }
  });
};
