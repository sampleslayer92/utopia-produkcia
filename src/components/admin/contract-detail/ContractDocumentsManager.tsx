import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useContractDocuments } from '@/hooks/useContractDocuments';
import { useContractData } from '@/hooks/useContractData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import DocumentSigning from './DocumentSigning';
import { useTranslation } from 'react-i18next';

interface ContractDocumentsManagerProps {
  contractId: string;
  contractNumber: string;
}

const ContractDocumentsManager = ({ contractId, contractNumber }: ContractDocumentsManagerProps) => {
  const { t } = useTranslation('admin');
  const { documents, generateDocuments, downloadDocument, isLoading } = useContractDocuments(contractId);
  const contractDataResult = useContractData(contractId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'generated': return 'bg-blue-100 text-blue-800';
      case 'pending_signature': return 'bg-orange-100 text-orange-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'generated': return <FileText className="h-4 w-4" />;
      case 'pending_signature': return <AlertCircle className="h-4 w-4" />;
      case 'signed': return <CheckCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Koncept';
      case 'generated': return 'Vygenerované';
      case 'pending_signature': return 'Čaká na podpis';
      case 'signed': return 'Podpísané';
      case 'approved': return 'Schválené';
      default: return status;
    }
  };

  const handleGenerateDocuments = () => {
    if (contractDataResult.data) {
      generateDocuments({
        onboardingData: contractDataResult.data.onboardingData,
        contractNumber
      });
    }
  };

  const handleDownloadDocument = (documentType: 'g1' | 'g2') => {
    if (contractDataResult.data) {
      downloadDocument({
        documentType,
        onboardingData: contractDataResult.data.onboardingData,
        contractNumber
      });
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
      {/* Generate Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Správa dokumentov kontraktu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!documents || documents.length === 0) ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Zatiaľ neboli vygenerované žiadne dokumenty pre tento kontrakt
              </p>
              <Button 
                onClick={handleGenerateDocuments}
                disabled={!contractDataResult.data}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generovať G1 a G2 dokumenty
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-semibold">Generovať nové dokumenty</h3>
                <p className="text-sm text-muted-foreground">
                  Vygeneruje aktualizované G1 a G2 dokumenty z onboarding údajov
                </p>
              </div>
              <Button 
                onClick={handleGenerateDocuments}
                disabled={!contractDataResult.data}
                variant="outline"
              >
                <FileText className="h-4 w-4 mr-2" />
                Regenerovať
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      {documents && documents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dokumenty kontraktu</h3>
          
          {documents.map((doc) => (
            <Card key={doc.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{doc.document_name}</h4>
                      <Badge className={`${getStatusColor(doc.status)} flex items-center gap-1`}>
                        {getStatusIcon(doc.status)}
                        {getStatusLabel(doc.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                      {doc.generated_at && (
                        <div>
                          <span className="font-medium">Vygenerované:</span>{' '}
                          {new Date(doc.generated_at).toLocaleString('sk-SK')}
                        </div>
                      )}
                      {doc.signed_at && (
                        <div>
                          <span className="font-medium">Podpísané:</span>{' '}
                          {new Date(doc.signed_at).toLocaleString('sk-SK')}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadDocument(doc.document_type as 'g1' | 'g2')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Stiahnuť
                      </Button>
                      
                      {doc.status !== 'signed' && doc.status !== 'approved' && (
                        <DocumentSigning
                          contractId={contractId}
                          contractNumber={contractNumber}
                          documentId={doc.id}
                          documentType={doc.document_type as 'g1' | 'g2'}
                          documentName={doc.document_name}
                          onSigningComplete={() => {
                            // Refresh documents list
                            window.location.reload();
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractDocumentsManager;