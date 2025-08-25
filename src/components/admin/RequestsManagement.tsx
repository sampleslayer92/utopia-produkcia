import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, FileText, User, Building2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface ContractRequest {
  id: string;
  contract_number: string;
  status: string;
  created_at: string;
  contact_info: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  company_info: {
    company_name: string;
    ico: string;
  } | null;
  documents_generated_at?: string;
  documents_signed_at?: string;
}

const RequestsManagement = () => {
  const { t } = useTranslation('admin');
  const [selectedRequest, setSelectedRequest] = useState<ContractRequest | null>(null);
  const queryClient = useQueryClient();

  // Fetch pending requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ['contract-requests'],
    queryFn: async () => {
      console.log('Fetching contract requests...');
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          id,
          contract_number,
          status,
          created_at,
          documents_generated_at,
          documents_signed_at,
          contact_info(first_name, last_name, email),
          company_info(company_name, ico)
        `)
        .in('status', ['submitted', 'waiting_for_signature', 'signed', 'pending_approval'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contract requests:', error);
        throw error;
      }

      console.log('Raw contract requests data:', data);

      // Properly transform the data to handle nested arrays from Supabase
      const transformedData = data?.map(item => {
        console.log('Transforming item:', item);
        
        // Handle contact_info - it might be an array, object, or null
        let contactInfo = null;
        if (item.contact_info) {
          if (Array.isArray(item.contact_info)) {
            contactInfo = item.contact_info.length > 0 ? item.contact_info[0] : null;
          } else {
            contactInfo = item.contact_info;
          }
        }

        // Handle company_info - it might be an array, object, or null
        let companyInfo = null;
        if (item.company_info) {
          if (Array.isArray(item.company_info)) {
            companyInfo = item.company_info.length > 0 ? item.company_info[0] : null;
          } else {
            companyInfo = item.company_info;
          }
        }

        console.log('Transformed contact_info:', contactInfo);
        console.log('Transformed company_info:', companyInfo);

        return {
          ...item,
          contact_info: contactInfo,
          company_info: companyInfo
        };
      }) as ContractRequest[];

      console.log('Final transformed requests:', transformedData);
      return transformedData;
    }
  });

  // Approve request
  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('contracts')
        .update({
          status: 'approved',
          admin_approved_at: new Date().toISOString(),
          admin_approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-requests'] });
      toast.success('Žiadosť bola schválená');
      setSelectedRequest(null);
    },
    onError: (error) => {
      console.error('Error approving request:', error);
      toast.error('Chyba pri schvaľovaní žiadosti');
    }
  });

  // Reject request
  const rejectMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('contracts')
        .update({
          status: 'rejected',
          admin_approved_at: new Date().toISOString(),
          admin_approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-requests'] });
      toast.success('Žiadosť bola zamietnutá');
      setSelectedRequest(null);
    },
    onError: (error) => {
      console.error('Error rejecting request:', error);
      toast.error('Chyba pri zamietaní žiadosti');
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'waiting_for_signature': return 'bg-orange-100 text-orange-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending_approval': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted': return 'Odoslané';
      case 'waiting_for_signature': return 'Čaká na podpis';
      case 'signed': return 'Podpísané';
      case 'approved': return 'Schválené';
      case 'rejected': return 'Zamietnuté';
      case 'pending_approval': return 'Čaká na schválenie';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Správa žiadostí
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!requests || requests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Žiadne žiadosti na spracovanie
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">
                            {request.contract_number}
                          </h4>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusLabel(request.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          {request.contact_info && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {request.contact_info.first_name} {request.contact_info.last_name}
                              </span>
                            </div>
                          )}
                          {request.company_info && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span>{request.company_info.company_name}</span>
                            </div>
                          )}
                          {request.contact_info?.email && (
                            <div className="text-muted-foreground">
                              <span className="font-medium">Email:</span> {request.contact_info.email}
                            </div>
                          )}
                          {request.company_info?.ico && (
                            <div className="text-muted-foreground">
                              <span className="font-medium">IČO:</span> {request.company_info.ico}
                            </div>
                          )}
                        </div>

                        <div className="text-sm text-muted-foreground mb-4">
                          <span className="font-medium">Vytvorené:</span>{' '}
                          {new Date(request.created_at).toLocaleString('sk-SK')}
                        </div>

                        <div className="flex gap-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedRequest(request)}
                              >
                                Zobraziť detail
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Detail žiadosti {selectedRequest?.contract_number}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Kontaktné údaje</h4>
                                      <div className="space-y-1 text-sm">
                                        {selectedRequest.contact_info ? (
                                          <>
                                            <p><span className="font-medium">Meno:</span> {selectedRequest.contact_info.first_name} {selectedRequest.contact_info.last_name}</p>
                                            <p><span className="font-medium">Email:</span> {selectedRequest.contact_info.email}</p>
                                          </>
                                        ) : (
                                          <p className="text-muted-foreground">Kontaktné údaje nie sú dostupné</p>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Firemné údaje</h4>
                                      <div className="space-y-1 text-sm">
                                        {selectedRequest.company_info ? (
                                          <>
                                            <p><span className="font-medium">Názov:</span> {selectedRequest.company_info.company_name}</p>
                                            <p><span className="font-medium">IČO:</span> {selectedRequest.company_info.ico}</p>
                                          </>
                                        ) : (
                                          <p className="text-muted-foreground">Firemné údaje nie sú dostupné</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-end gap-3">
                                    <Button
                                      variant="outline"
                                      onClick={() => rejectMutation.mutate(selectedRequest.id)}
                                      disabled={rejectMutation.isPending}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Zamietnuť
                                    </Button>
                                    <Button
                                      onClick={() => approveMutation.mutate(selectedRequest.id)}
                                      disabled={approveMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Schváliť
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {(request.status === 'signed' || request.status === 'pending_approval') && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => approveMutation.mutate(request.id)}
                                disabled={approveMutation.isPending}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Schváliť
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => rejectMutation.mutate(request.id)}
                                disabled={rejectMutation.isPending}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Zamietnuť
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsManagement;
