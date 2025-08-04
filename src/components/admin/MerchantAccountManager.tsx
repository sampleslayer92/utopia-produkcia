import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Users, AlertTriangle } from 'lucide-react';

interface MerchantWithoutAccount {
  id: string;
  company_name: string;
  contact_person_name: string;
  contact_person_email: string;
}

export const MerchantAccountManager = () => {
  const [merchantsWithoutAccounts, setMerchantsWithoutAccounts] = useState<MerchantWithoutAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAccounts, setIsCreatingAccounts] = useState(false);
  const [passwords, setPasswords] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const findMerchantsWithoutAccounts = async () => {
    setIsLoading(true);
    try {
      // Get all merchants
      const { data: merchants, error: merchantsError } = await supabase
        .from('merchants')
        .select('id, company_name, contact_person_name, contact_person_email');

      if (merchantsError) throw merchantsError;

      // Get all merchant emails from user_roles
      const { data: merchantUsers, error: usersError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          profiles!inner(email)
        `)
        .eq('role', 'merchant');

      if (usersError) throw usersError;

      const merchantEmails = new Set(
        merchantUsers?.map(u => (u.profiles as any)?.email).filter(Boolean) || []
      );

      // Find merchants without accounts
      const merchantsWithoutAccounts = merchants?.filter(
        merchant => !merchantEmails.has(merchant.contact_person_email)
      ) || [];

      setMerchantsWithoutAccounts(merchantsWithoutAccounts);

      toast({
        title: 'Analýza dokončená',
        description: `Nájdených ${merchantsWithoutAccounts.length} merchantov bez účtov`,
      });
    } catch (error: any) {
      console.error('Error finding merchants without accounts:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa nájsť merchantov bez účtov',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAccountForMerchant = async (merchant: MerchantWithoutAccount) => {
    const password = passwords[merchant.id];
    if (!password || password.length < 6) {
      toast({
        title: 'Chyba',
        description: 'Heslo musí mať aspoň 6 znakov',
        variant: 'destructive'
      });
      return;
    }

    try {
      const nameParts = merchant.contact_person_name.split(' ');
      const { error } = await supabase.functions.invoke('create-team-member', {
        body: {
          first_name: nameParts[0] || merchant.contact_person_name,
          last_name: nameParts.slice(1).join(' ') || '',
          email: merchant.contact_person_email,
          password,
          role: 'merchant'
        }
      });

      if (error) throw error;

      toast({
        title: 'Úspech',
        description: `Účet pre ${merchant.company_name} bol vytvorený`,
      });

      // Remove from list
      setMerchantsWithoutAccounts(prev => 
        prev.filter(m => m.id !== merchant.id)
      );

      // Clear password
      setPasswords(prev => {
        const updated = { ...prev };
        delete updated[merchant.id];
        return updated;
      });

    } catch (error: any) {
      console.error('Error creating account:', error);
      toast({
        title: 'Chyba',
        description: `Nepodarilo sa vytvoriť účet pre ${merchant.company_name}`,
        variant: 'destructive'
      });
    }
  };

  const createAllAccounts = async () => {
    setIsCreatingAccounts(true);
    const defaultPassword = 'merchant123';
    
    try {
      for (const merchant of merchantsWithoutAccounts) {
        await createAccountForMerchant({
          ...merchant,
          id: merchant.id
        });
        // Add small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast({
        title: 'Dokončené',
        description: 'Všetky účty boli vytvorené',
      });
    } catch (error) {
      toast({
        title: 'Chyba',
        description: 'Niektoré účty sa nepodarilo vytvoriť',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingAccounts(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Správa účtov merchantov
        </CardTitle>
        <CardDescription>
          Nájdite a vytvorte účty pre existujúcich merchantov
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={findMerchantsWithoutAccounts}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Hľadám...' : 'Nájsť merchantov bez účtov'}
        </Button>

        {merchantsWithoutAccounts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {merchantsWithoutAccounts.length} merchantov bez účtov
              </span>
            </div>

            <Button 
              onClick={createAllAccounts}
              disabled={isCreatingAccounts}
              variant="outline"
              className="w-full"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {isCreatingAccounts ? 'Vytváram účty...' : 'Vytvoriť všetky účty (heslo: merchant123)'}
            </Button>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {merchantsWithoutAccounts.map((merchant) => (
                <div key={merchant.id} className="border rounded-lg p-3 space-y-2">
                  <div className="text-sm">
                    <div className="font-medium">{merchant.company_name}</div>
                    <div className="text-muted-foreground">{merchant.contact_person_name}</div>
                    <div className="text-muted-foreground">{merchant.contact_person_email}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`password-${merchant.id}`} className="sr-only">
                        Heslo
                      </Label>
                      <Input
                        id={`password-${merchant.id}`}
                        type="password"
                        placeholder="Heslo (min. 6 znakov)"
                        value={passwords[merchant.id] || ''}
                        onChange={(e) => setPasswords(prev => ({
                          ...prev,
                          [merchant.id]: e.target.value
                        }))}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => createAccountForMerchant(merchant)}
                      disabled={!passwords[merchant.id] || passwords[merchant.id].length < 6}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};