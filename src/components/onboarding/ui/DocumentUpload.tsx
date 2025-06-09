
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";

interface DocumentUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  side?: 'front' | 'back';
  personId?: string; // Add personId prop
  documentSide?: string; // Add documentSide prop
}

const DocumentUpload = ({ label, value, onChange, side, personId, documentSide }: DocumentUploadProps) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleUpload(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = (file: File) => {
    if (file) {
      // Here you would typically upload the file to a server
      // and get a URL in return. For this example, we'll just
      // simulate a successful upload.
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  const sideLabel = side === 'front' ? t('ui.documentUpload.frontSide') : side === 'back' ? t('ui.documentUpload.backSide') : '';
  // Create unique ID using personId and documentSide if available
  const inputId = `file-${label}-${personId || ''}-${documentSide || side || ''}`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        {label} {sideLabel && `- ${sideLabel}`}
      </label>
      
      {!value ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600 mb-2">
            {t('ui.documentUpload.dragDrop')}
          </p>
          <p className="text-xs text-slate-500 mb-3">
            {t('ui.documentUpload.supportedFormats')}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById(inputId)?.click()}
          >
            {t('ui.documentUpload.uploadDocument')}
          </Button>
          <input
            id={inputId}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between bg-green-50">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-800">{t('ui.documentUpload.uploaded')}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
