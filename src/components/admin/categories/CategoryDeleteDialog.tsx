
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Category } from '@/hooks/useCategories';

interface CategoryDeleteDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const CategoryDeleteDialog: React.FC<CategoryDeleteDialogProps> = ({
  category,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Potvrdiť vymazanie kategórie</AlertDialogTitle>
          <AlertDialogDescription>
            Naozaj chcete vymazať kategóriu "{category?.name}"? Táto akcia sa nedá vrátiť späť.
            <br />
            <br />
            <strong>Poznámka:</strong> Kategóriu možno vymazať iba ak nemá priradenú žiadnu skladovú položku.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Zrušiť
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Vymazávam...' : 'Vymazať'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
