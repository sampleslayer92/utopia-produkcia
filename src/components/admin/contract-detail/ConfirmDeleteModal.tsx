
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting?: boolean;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, isDeleting = false }: ConfirmDeleteModalProps) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>{t('modals.deleteContract.title')}</span>
          </DialogTitle>
          <DialogDescription className="pt-2">
            {t('modals.deleteContract.description')} <strong>{title}</strong>
            <br />
            <br />
            <span className="text-red-600 font-medium">{t('modals.deleteContract.irreversible')}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {t('buttons.cancel')}
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isDeleting}
          >
            {isDeleting ? t('buttons.deleting') : t('buttons.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
