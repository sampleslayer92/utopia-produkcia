import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Users,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface RequestItem {
  id: string;
  contract_number: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  contact_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;
  company_info: {
    company_name: string;
    ico: string;
  } | null;
}

const RequestsManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'all'>('pending');

  // Fetch requests based on selected tab
  const { data: requests, isLoading } = useQuery({
    queryKey: ['admin-requests', selectedTab],
    queryFn: async () => {
      let query = supabase
        .from('contracts')
        .select(`
          id,
          contract_number,
          status,
          created_at,
          submitted_at,
          contact_info:contact_info(
            first_name,
            last_name,
            email,
            phone
          ),
          company_info:company_info(
            company_name,
            ico
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedTab === 'pending') {
        query = query.in('status', ['pending_approval']);
      } else {
        query = query.in('status', ['pending_approval', 'approved', 'rejected']);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        ...item,
        contact_info: item.contact_info?.[0] || null,
        company_info: item.company_info?.[0] || null
      })) as RequestItem[];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return 'Čaká na schválenie';
      case 'approved':
        return 'Schválené';
      case 'rejected':
        return 'Zamietnuté';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleViewRequest = (requestId: string) => {
    navigate(`/admin/contracts/${requestId}`);
  };

  const pendingCount = requests?.filter(r => r.status === 'pending_approval').length || 0;

  return (
    <AdminLayout
      title="Správa žiadostí"
      subtitle="Prehľad a schvaľovanie žiadostí o kontrakty"
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Čakajúce žiadosti
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {pendingCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Vyžadujú pozornosť
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Schválené dnes
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {requests?.filter(r => 
                  r.status === 'approved' && 
                  new Date(r.created_at).toDateString() === new Date().toDateString()
                ).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Schválené dnes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Celkovo žiadostí
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {requests?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Všetky žiadosti
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
          <Button
            variant={selectedTab === 'pending' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab('pending')}
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            Čakajúce ({pendingCount})
          </Button>
          <Button
            variant={selectedTab === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab('all')}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            Všetky žiadosti
          </Button>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedTab === 'pending' ? 'Čakajúce žiadosti' : 'Všetky žiadosti'}
            </CardTitle>
            <CardDescription>
              {selectedTab === 'pending' 
                ? 'Žiadosti čakajúce na vaše schválenie'
                : 'Kompletný prehľad všetkých žiadostí'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-slate-500">Načítavam žiadosti...</div>
              </div>
            ) : !requests || requests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Žiadne žiadosti
                </h3>
                <p className="text-slate-500">
                  {selectedTab === 'pending' 
                    ? 'Momentálne nie sú žiadne čakajúce žiadosti.'
                    : 'Zatiaľ neboli podané žiadne žiadosti.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Request Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(request.status)}
                              <span className="font-medium text-slate-900">
                                {request.contract_number}
                              </span>
                            </div>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusLabel(request.status)}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-500">
                            {request.submitted_at 
                              ? format(new Date(request.submitted_at), 'dd.MM.yyyy HH:mm', { locale: sk })
                              : format(new Date(request.created_at), 'dd.MM.yyyy HH:mm', { locale: sk })
                            }
                          </div>
                        </div>

                        {/* Request Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Contact Info */}
                          {request.contact_info && (
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-sm">
                                <Users className="h-4 w-4 text-slate-400" />
                                <span className="font-medium">
                                  {request.contact_info.first_name} {request.contact_info.last_name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-slate-500 ml-6">
                                <Mail className="h-3 w-3" />
                                <span>{request.contact_info.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-slate-500 ml-6">
                                <Phone className="h-3 w-3" />
                                <span>{request.contact_info.phone}</span>
                              </div>
                            </div>
                          )}

                          {/* Company Info */}
                          {request.company_info && (
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-sm">
                                <Building className="h-4 w-4 text-slate-400" />
                                <span className="font-medium">
                                  {request.company_info.company_name}
                                </span>
                              </div>
                              <div className="text-sm text-slate-500 ml-6">
                                IČO: {request.company_info.ico}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRequest(request.id)}
                          className="flex items-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Zobraziť</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RequestsManagementPage;