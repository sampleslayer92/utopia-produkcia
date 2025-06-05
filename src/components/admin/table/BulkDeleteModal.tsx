
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
}

const BulkDeleteModal = ({ isOpen, onClose, onConfirm, selectedCount }: BulkDeleteModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-semibold text-slate-900">
                Potvrdiť vymazanie zmlúv
              </AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-slate-600 mt-4">
          Naozaj chcete vymazať <strong>{selectedCount}</strong> {selectedCount === 1 ? 'označenú zmluvu' : selectedCount < 5 ? 'označené zmluvy' : 'označených zmlúv'}?
          <br />
          <br />
          <span className="text-red-600 font-medium">Táto akcia je nevratná.</span>
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="bg-slate-100 text-slate-700 hover:bg-slate-200">
            Zrušiť
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Vymazať {selectedCount === 1 ? 'zmluvu' : 'zmluvy'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BulkDeleteModal;
