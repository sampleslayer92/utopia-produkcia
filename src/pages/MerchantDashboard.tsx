
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, CreditCard, Building, User, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContractData {
  id: string;
  contract_number: number;
  status: string;
  created_at: string;
  signed_at?: string;
  contact_info?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    user_role: string;
  };
  company_info?: {
    company_name: string;
    ico: string;
    dic: string;
  };
  contract_items?: Array<{
    name: string;
    count: number;
    monthly_fee: number;
  }>;
}

const MerchantDashboard = () => {
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const loadContractData = async () => {
      try {
        // Get user email from localStorage or current session
        const storedEmail = localStorage.getItem('utopia_user_email');
        const { data: { user } } = await supabase.auth.getUser();
        const email = storedEmail || user?.email;
        
        if (!email) {
          toast.error('Nie ste prihlásený');
          return;
        }

        setUserEmail(email);

        // Get user record to find contract ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('contract_id')
          .eq('email', email)
          .maybeSingle();

        if (userError) {
          console.error('Error fetching user:', userError);
          toast.error('Chyba pri načítavaní údajov používateľa');
          return;
        }

        if (!userData?.contract_id) {
          toast.error('Nebola nájdená žiadna zmluva');
          return;
        }

        // Fetch contract with related data
        const { data: contractInfo, error: contractError } = await supabase
          .from('contracts')
          .select(`
            id,
            contract_number,
            status,
            created_at,
            signed_at
          `)
          .eq('id', userData.contract_id)
          .single();

        if (contractError) {
          console.error('Error fetching contract:', contractError);
          toast.error('Chyba pri načítavaní zmluvy');
          return;
        }

        // Fetch contact info
        const { data: contactInfo } = await supabase
          .from('contact_info')
          .select('first_name, last_name, email, phone, user_role')
          .eq('contract_id', userData.contract_id)
          .maybeSingle();

        // Fetch company info
        const { data: companyInfo } = await supabase
          .from('company_info')
          .select('company_name, ico, dic')
          .eq('contract_id', userData.contract_id)
          .maybeSingle();

        // Fetch contract items
        const { data: contractItems } = await supabase
          .from('contract_items')
          .select('name, count, monthly_fee')
          .eq('contract_id', userData.contract_id);

        setContractData({
          ...contractInfo,
          contact_info: contactInfo || undefined,
          company_info: companyInfo || undefined,
          contract_items: contractItems || []
        });

      } catch (error) {
        console.error('Error loading contract data:', error);
        toast.error('Chyba pri načítavaní údajov');
      } finally {
        setLoading(false);
      }
    };

    loadContractData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTotalMonthlyFee = () => {
    if (!contractData?.contract_items) return 0;
    return contractData.contract_items.reduce((total, item) => {
      return total + (item.monthly_fee * item.count);
    }, 0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <Badge className="bg-green-100 text-green-800">Podpísaná</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">Odoslaná</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Koncept</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Načítavam údaje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  Vitajte, {contractData?.contact_info?.first_name} {contractData?.contact_info?.last_name}
                </h1>
                <p className="text-sm text-slate-600">{contractData?.contact_info?.user_role}</p>
              </div>
            </div>
            <div className="text-right text-sm text-slate-600">
              <p>{userEmail}</p>
              <p>Klientský portál</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contract Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Zmluva č. {contractData?.contract_number}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Stav zmluvy:</span>
                  {getStatusBadge(contractData?.status || '')}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Dátum vytvorenia:</span>
                  <span className="text-sm font-medium">
                    {contractData?.created_at ? new Date(contractData.created_at).toLocaleDateString('sk-SK') : 'N/A'}
                  </span>
                </div>
                
                {contractData?.signed_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Dátum podpisu:</span>
                    <span className="text-sm font-medium">
                      {new Date(contractData.signed_at).toLocaleDateString('sk-SK')}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-lg font-semibold text-slate-900">Mesačný poplatok:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(getTotalMonthlyFee())}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Devices and Services */}
            {contractData?.contract_items && contractData.contract_items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Zariadenia a služby
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contractData.contract_items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-slate-600">Počet: {item.count}x</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.monthly_fee * item.count)}</p>
                          <p className="text-xs text-slate-600">za mesiac</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            {contractData?.company_info && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Spoločnosť
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Názov</p>
                    <p className="font-medium">{contractData.company_info.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">IČO</p>
                    <p className="font-medium">{contractData.company_info.ico}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">DIČ</p>
                    <p className="font-medium">{contractData.company_info.dic}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            {contractData?.contact_info && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Kontakt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm">{contractData.contact_info.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm">{contractData.contact_info.phone}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Rýchle akcie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Stiahnuť zmluvu
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Naplánovať konzultáciu
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
