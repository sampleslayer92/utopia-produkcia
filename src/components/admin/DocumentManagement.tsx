
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, FileText, CheckCircle } from 'lucide-react';
import { useDocumentManager } from '@/hooks/useDocumentManager';
import { useContractDocuments } from '@/hooks/useContractDocuments';
import { useContractData } from '@/hooks/useContractData';
import { useTranslation } from 'react-i18next';

interface DocumentManagementProps {
  contractId: string;
  contractNumber: string;
  documentUrl?: string;
  signedDocumentUrl?: string;
  documentUploadedAt?: string;
  documentSignedAt?: string;
}

const DocumentManagement = ({
  contractId,
  contractNumber,
  documentUrl,
  signedDocumentUrl,
  documentUploadedAt,
  documentSignedAt
}: DocumentManagementProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { uploadContractDocument, downloadContractDocument, isUploading, isDownloading } = useDocumentManager();
  const { documents, generateDocuments, downloadDocument } = useContractDocuments(contractId);
  const contractDataResult = useContractData(contractId);
  const { t } = useTranslation('admin');

  const handleFileUpload = async (file: File, type: 'unsigned' | 'signed') => {
    await uploadContractDocument(contractId, file, type);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0], 'unsigned');
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>, type: 'unsigned' | 'signed') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0], type);
    }
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t('documentManagement.title')}
        </CardTitle>
        <CardDescription>
          {t('documentManagement.description')} {contractNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Generate Documents Section */}
        <div className="flex justify-between items-center p-4 border rounded-lg bg-blue-50">
          <div>
            <h3 className="font-semibold">{t('documentManagement.generateDocuments')}</h3>
            <p className="text-sm text-muted-foreground">{t('documentManagement.generateDescription')}</p>
          </div>
          <Button 
            onClick={() => contractDataResult.data && generateDocuments({
              onboardingData: contractDataResult.data.onboardingData,
              contractNumber
            })}
            disabled={!contractDataResult.data}
          >
            <FileText className="h-4 w-4 mr-2" />
            {t('documentManagement.generate')}
          </Button>
        </div>

        {/* Contract Documents */}
        {documents && documents.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">{t('documentManagement.contractDocuments')}</h3>
            {documents.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{doc.document_name}</h4>
                  <span className="text-sm text-muted-foreground">{t('documentManagement.status')}: {doc.status}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => contractDataResult.data && downloadDocument({
                    documentType: doc.document_type,
                    onboardingData: contractDataResult.data.onboardingData,
                    contractNumber
                  })}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('documentManagement.download')}
                </Button>
              </div>
            ))}
          </div>
        )}
        {/* Unsigned Document Section */}
        <div className="space-y-3">
          <h3 className="font-medium text-slate-900">{t('documentManagement.unsignedContract')}</h3>
          
          {documentUrl ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  {t('documentManagement.documentUploaded')} {documentUploadedAt && new Date(documentUploadedAt).toLocaleString('sk-SK')}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadContractDocument(contractId, 'unsigned')}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-1" />
                {t('documentManagement.download')}
              </Button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-600 mb-2">
                {t('documentManagement.dragDropHere')}
              </p>
              <label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileInput(e, 'unsigned')}
                  className="hidden"
                />
                <Button variant="outline" disabled={isUploading} asChild>
                  <span>
                    {isUploading ? t('documentManagement.uploading') : t('documentManagement.selectFile')}
                  </span>
                </Button>
              </label>
            </div>
          )}
        </div>

        {/* Signed Document Section */}
        <div className="space-y-3">
          <h3 className="font-medium text-slate-900">{t('documentManagement.signedContract')}</h3>
          
          {signedDocumentUrl ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  {t('documentManagement.signedDocumentUploaded')} {documentSignedAt && new Date(documentSignedAt).toLocaleString('sk-SK')}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadContractDocument(contractId, 'signed')}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-1" />
                {t('documentManagement.download')}
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-600 mb-2">
                {t('documentManagement.uploadSignedContract')}
              </p>
              <label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileInput(e, 'signed')}
                  className="hidden"
                />
                <Button variant="outline" disabled={isUploading} asChild>
                  <span>
                    {isUploading ? t('documentManagement.uploading') : t('documentManagement.selectFile')}
                  </span>
                </Button>
              </label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentManagement;
