
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, FileText, X, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DocumentUploadProps {
  label: string;
  value?: string;
  onChange: (url: string | null) => void;
  accept?: string;
  personId: string;
  documentSide: 'front' | 'back';
}

const DocumentUpload = ({ 
  label, 
  value, 
  onChange, 
  accept = "image/*,.pdf", 
  personId, 
  documentSide 
}: DocumentUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${personId}_${documentSide}_${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('identity-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('identity-documents')
        .getPublicUrl(filePath);

      setPreviewUrl(data.publicUrl);
      onChange(data.publicUrl);
      toast.success('Dokument úspešne nahratý');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Chyba pri nahrávaní dokumentu');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        const filePath = value.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('identity-documents')
            .remove([`documents/${filePath}`]);
        }
      } catch (error) {
        console.error('Error removing file:', error);
      }
    }
    setPreviewUrl(null);
    onChange(null);
    toast.success('Dokument odstránený');
  };

  const openPreview = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      
      {!previewUrl ? (
        <Card className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <FileText className="h-12 w-12 text-slate-400" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Nahrajte dokument alebo odfotografujte</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Nahrať súbor
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Odfotiť
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Dokument nahratý</p>
                  <p className="text-xs text-slate-500">Kliknite na oko pre zobrazenie</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={openPreview}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default DocumentUpload;
