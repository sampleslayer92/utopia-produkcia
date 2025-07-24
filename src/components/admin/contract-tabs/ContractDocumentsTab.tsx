import DocumentManagement from "../DocumentManagement";
import ContractDocumentsManager from "../contract-detail/ContractDocumentsManager";
import SignatureSection from "../contract-detail/SignatureSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface ContractDocumentsTabProps {
  contractId: string;
  contractNumber: string;
  documentUrl?: string | null;
  signedDocumentUrl?: string | null;
  documentUploadedAt?: string | null;
  documentSignedAt?: string | null;
}

const ContractDocumentsTab = ({
  contractId,
  contractNumber,
  documentUrl,
  signedDocumentUrl,
  documentUploadedAt,
  documentSignedAt
}: ContractDocumentsTabProps) => {
  const { t } = useTranslation('admin');
  return (
    <div className="space-y-8">
      {/* Enhanced Contract Documents Management */}
      <ContractDocumentsManager
        contractId={contractId}
        contractNumber={contractNumber}
      />

      {/* Legacy Document Management for backward compatibility */}
      <DocumentManagement
        contractId={contractId}
        contractNumber={contractNumber}
        documentUrl={documentUrl}
        signedDocumentUrl={signedDocumentUrl}
        documentUploadedAt={documentUploadedAt}
        documentSignedAt={documentSignedAt}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {t('contracts.detail.documents.signatureSection')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for signature section */}
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('contracts.detail.documents.signaturePlaceholder')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractDocumentsTab;