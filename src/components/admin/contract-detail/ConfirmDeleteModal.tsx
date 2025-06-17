
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting?: boolean;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, isDeleting = false }: ConfirmDeleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Potvrdenie vymazania</span>
          </DialogTitle>
          <DialogDescription className="pt-2">
            Ste si istý, že chcete vymazať <strong>{title}</strong>? Táto akcia je nevratná.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Zrušiť
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isDeleting}
          >
            {isDeleting ? 'Vymazáva sa...' : 'Vymazať'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
