
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lightbulb, HelpCircle } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  features?: string[];
  tips?: string[];
  helpInfo?: string[];
}

const InfoModal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  features = [], 
  tips = [], 
  helpInfo = [] 
}: InfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {description}
          </p>
          
          {features.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-slate-800">Funkcie</span>
              </div>
              <ul className="space-y-1 ml-6">
                {features.map((feature, index) => (
                  <li key={index} className="text-xs text-slate-600">• {feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {tips.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-slate-800">Tipy</span>
              </div>
              <ul className="space-y-1 ml-6">
                {tips.map((tip, index) => (
                  <li key={index} className="text-xs text-slate-600">• {tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          {helpInfo.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-800">Pomoc</span>
              </div>
              <ul className="space-y-1 ml-6">
                {helpInfo.map((info, index) => (
                  <li key={index} className="text-xs text-slate-600">• {info}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
