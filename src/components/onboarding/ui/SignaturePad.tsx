import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PenTool, Trash2 } from "lucide-react";

interface SignaturePadProps {
  value?: string;
  onSignatureChange: (signature: string) => void;
  disabled?: boolean;
}

const SignaturePad = ({ value, onSignatureChange, disabled = false }: SignaturePadProps) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!value);

  useEffect(() => {
    setHasSignature(!!value);
  }, [value]);

  const startDrawing = (e: MouseEvent) => {
    if (disabled) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  };

  const draw = (e: MouseEvent) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveSignature();
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    onSignatureChange(dataUrl);
    setHasSignature(true);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSignatureChange('');
    setHasSignature(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-slate-900 flex items-center gap-2">
          <PenTool className="h-4 w-4 text-blue-500" />
          {t('ui.signaturePad.signature')}
        </h3>
        
        {hasSignature && !disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearSignature}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t('ui.signaturePad.clear')}
          </Button>
        )}
      </div>

      <div className={`border-2 border-dashed rounded-lg p-4 ${
        disabled ? 'bg-slate-50 border-slate-200' : 'border-slate-300 hover:border-slate-400'
      }`}>
        {disabled ? (
          <div className="h-32 flex items-center justify-center text-slate-500">
            <p className="text-sm">{t('ui.signaturePad.disabled')}</p>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              width={400}
              height={120}
              className="w-full border border-slate-200 rounded bg-white cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={stopDrawing}
            />
            
            {!hasSignature && (
              <p className="text-sm text-slate-500 text-center mt-2">
                {t('ui.signaturePad.signHere')}
              </p>
            )}
          </>
        )}
      </div>

      {!hasSignature && !disabled && (
        <p className="text-sm text-red-600">{t('ui.signaturePad.required')}</p>
      )}
    </div>
  );
};

export default SignaturePad;
