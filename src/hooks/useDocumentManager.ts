
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDocumentManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const uploadContractDocument = async (contractId: string, file: File, type: 'unsigned' | 'signed' = 'unsigned') => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${contractId}/${type}_contract_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('contracts')
        .getPublicUrl(fileName);

      // Update contract with document URL
      const updateField = type === 'signed' ? 'signed_document_url' : 'document_url';
      const timestampField = type === 'signed' ? 'document_signed_at' : 'document_uploaded_at';
      
      const { error: updateError } = await supabase
        .from('contracts')
        .update({
          [updateField]: publicUrl,
          [timestampField]: new Date().toISOString()
        })
        .eq('id', contractId);

      if (updateError) throw updateError;

      toast.success(`${type === 'signed' ? 'Podpísaná' : 'Nepodpísaná'} zmluva bola nahraná`);
      return publicUrl;

    } catch (error) {
      console.error('Document upload error:', error);
      toast.error('Chyba pri nahrávaní dokumentu');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const downloadContractDocument = async (contractId: string, type: 'unsigned' | 'signed' = 'unsigned') => {
    setIsDownloading(true);
    try {
      const { data: contract } = await supabase
        .from('contracts')
        .select('document_url, signed_document_url, contract_number')
        .eq('id', contractId)
        .single();

      if (!contract) throw new Error('Zmluva nenájdená');

      const url = type === 'signed' ? contract.signed_document_url : contract.document_url;
      if (!url) throw new Error('Dokument nenájdený');

      // Extract filename from URL and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${contract.contract_number}_${type}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Document download error:', error);
      toast.error('Chyba pri sťahovaní dokumentu');
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    uploadContractDocument,
    downloadContractDocument,
    isUploading,
    isDownloading
  };
};
