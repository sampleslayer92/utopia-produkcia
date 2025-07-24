import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Signature, Download, X } from 'lucide-react';
import { useContractDocuments } from '@/hooks/useContractDocuments';
import { useContractData } from '@/hooks/useContractData';
import { toast } from 'sonner';

interface DocumentSigningProps {
  contractId: string;
  contractNumber: string;
  documentId: string;
  documentType: 'g1' | 'g2';
  documentName: string;
  onSigningComplete?: () => void;
}

const DocumentSigning = ({
  contractId,
  contractNumber,
  documentId,
  documentType,
  documentName,
  onSigningComplete
}: DocumentSigningProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  
  const { signDocument, downloadDocument } = useContractDocuments(contractId);
  const contractDataResult = useContractData(contractId);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas properties
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Set canvas size
    canvas.width = 400;
    canvas.height = 150;
    
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSign = async () => {
    if (!hasSignature) {
      toast.error('Najprv vytvorte podpis');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSigning(true);
    try {
      // Get signature as data URL
      const signatureDataUrl = canvas.toDataURL('image/png');
      
      // Sign the document
      await signDocument({
        documentId,
        signatureDataUrl
      });

      // Download document with signature
      if (contractDataResult.data) {
        await downloadDocument({
          documentType,
          onboardingData: contractDataResult.data.onboardingData,
          contractNumber,
          signatureDataUrl
        });
      }

      toast.success('Dokument bol podpísaný a stiahnutý');
      setIsOpen(false);
      onSigningComplete?.();
    } catch (error) {
      console.error('Error signing document:', error);
      toast.error('Chyba pri podpisovaní dokumentu');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Signature className="h-4 w-4 mr-2" />
          Podpísať
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Signature className="h-5 w-5" />
            Podpísanie dokumentu
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">{documentName}</h4>
            <p className="text-sm text-muted-foreground">
              Vytvorte svoj podpis v poli nižšie a potom kliknite na "Podpísať dokument"
            </p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Vytvorte svoj podpis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-200 rounded cursor-crosshair bg-white"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="flex justify-between mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCanvas}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Vymazať
                  </Button>
                  <p className="text-xs text-muted-foreground self-center">
                    Kreslite myšou pre vytvorenie podpisu
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSigning}
            >
              Zrušiť
            </Button>
            <Button
              onClick={handleSign}
              disabled={!hasSignature || isSigning}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isSigning ? 'Podpisujem...' : 'Podpísať dokument'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentSigning;