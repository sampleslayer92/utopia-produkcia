import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OnboardingData } from '@/types/onboarding';
import { generateG1Document, generateG2Document, DocumentType } from '@/utils/pdfGenerator';

interface ContractDocument {
  id: string;
  contract_id: string;
  document_type: DocumentType;
  document_name: string;
  document_url?: string;
  signed_document_url?: string;
  generated_at?: string;
  signed_at?: string;
  status: 'draft' | 'generated' | 'pending_signature' | 'signed' | 'approved';
  created_at: string;
  updated_at: string;
}

export const useContractDocuments = (contractId: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const queryClient = useQueryClient();

  // Fetch contract documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ['contract-documents', contractId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contract_documents')
        .select('*')
        .eq('contract_id', contractId)
        .order('document_type');

      if (error) throw error;
      return data as ContractDocument[];
    },
    enabled: !!contractId
  });

  // Generate all documents for a contract
  const generateDocuments = useMutation({
    mutationFn: async ({ 
      onboardingData, 
      contractNumber 
    }: { 
      onboardingData: OnboardingData; 
      contractNumber: string; 
    }) => {
      setIsGenerating(true);
      
      try {
        // Create document records in database
        const documentTypes: DocumentType[] = ['g1', 'g2'];
        const documentNames: Record<DocumentType, string> = {
          g1: 'G1 - Žádost o akceptaci platebních karet',
          g2: 'G2 - Prohlášení o skutečném majiteli'
        };

        for (const docType of documentTypes) {
          // Check if document already exists
          const { data: existing } = await supabase
            .from('contract_documents')
            .select('id')
            .eq('contract_id', contractId)
            .eq('document_type', docType)
            .single();

          if (!existing) {
            // Create new document record
            const { error } = await supabase
              .from('contract_documents')
              .insert({
                contract_id: contractId,
                document_type: docType,
                document_name: documentNames[docType],
                status: 'generated',
                generated_at: new Date().toISOString()
              });

            if (error) throw error;
          }
        }

        // Update contract status
        await supabase
          .from('contracts')
          .update({
            status: 'waiting_for_signature',
            documents_generated_at: new Date().toISOString()
          })
          .eq('id', contractId);

        return { success: true };
      } finally {
        setIsGenerating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-documents', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contract-basic', contractId] });
      toast.success('Dokumenty boli vygenerované');
    },
    onError: (error) => {
      console.error('Error generating documents:', error);
      toast.error('Chyba pri generovaní dokumentov');
    }
  });

  // Generate and download a specific document
  const downloadDocument = useMutation({
    mutationFn: async ({ 
      documentType, 
      onboardingData, 
      contractNumber,
      signatureDataUrl 
    }: { 
      documentType: DocumentType;
      onboardingData: OnboardingData;
      contractNumber: string;
      signatureDataUrl?: string;
    }) => {
      if (documentType === 'g1') {
        await generateG1Document(contractNumber, onboardingData, signatureDataUrl);
      } else if (documentType === 'g2') {
        await generateG2Document(contractNumber, onboardingData, signatureDataUrl);
      }
    },
    onSuccess: () => {
      toast.success('Dokument bol stiahnutý');
    },
    onError: (error) => {
      console.error('Error downloading document:', error);
      toast.error('Chyba pri sťahovaní dokumentu');
    }
  });

  // Upload signed document
  const uploadSignedDocument = useMutation({
    mutationFn: async ({ 
      documentId, 
      file 
    }: { 
      documentId: string; 
      file: File; 
    }) => {
      const fileName = `${contractId}/${documentId}-signed-${Date.now()}.pdf`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('contracts')
        .getPublicUrl(fileName);

      // Update document record
      const { error: updateError } = await supabase
        .from('contract_documents')
        .update({
          signed_document_url: urlData.publicUrl,
          signed_at: new Date().toISOString(),
          status: 'signed'
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      return urlData.publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-documents', contractId] });
      toast.success('Podpísaný dokument bol nahraný');
    },
    onError: (error) => {
      console.error('Error uploading signed document:', error);
      toast.error('Chyba pri nahrávaní podpísaného dokumentu');
    }
  });

  // Sign document with canvas signature
  const signDocument = useMutation({
    mutationFn: async ({ 
      documentId, 
      signatureDataUrl 
    }: { 
      documentId: string; 
      signatureDataUrl: string; 
    }) => {
      setIsSigning(true);
      
      try {
        // Update document status to signed
        const { error } = await supabase
          .from('contract_documents')
          .update({
            signed_at: new Date().toISOString(),
            status: 'signed'
          })
          .eq('id', documentId);

        if (error) throw error;

        // Check if all documents are signed
        const { data: allDocs } = await supabase
          .from('contract_documents')
          .select('status')
          .eq('contract_id', contractId);

        if (allDocs && allDocs.every(doc => doc.status === 'signed')) {
          // Update contract status
          await supabase
            .from('contracts')
            .update({
              status: 'signed',
              documents_signed_at: new Date().toISOString()
            })
            .eq('id', contractId);
        }

        return { success: true };
      } finally {
        setIsSigning(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-documents', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contract-basic', contractId] });
      toast.success('Dokument bol podpísaný');
    },
    onError: (error) => {
      console.error('Error signing document:', error);
      toast.error('Chyba pri podpisovaní dokumentu');
    }
  });

  return {
    documents,
    isLoading,
    isGenerating,
    isSigning,
    generateDocuments: generateDocuments.mutate,
    downloadDocument: downloadDocument.mutate,
    uploadSignedDocument: uploadSignedDocument.mutate,
    signDocument: signDocument.mutate
  };
};