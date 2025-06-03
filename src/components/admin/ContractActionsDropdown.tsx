
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContractDelete } from "@/hooks/useContractDelete";

interface ContractActionsDropdownProps {
  contractId: string;
  contractNumber: number;
}

const ContractActionsDropdown = ({ contractId, contractNumber }: ContractActionsDropdownProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const deleteContract = useContractDelete();

  const handleEdit = () => {
    navigate(`/admin/contract/${contractId}/edit`);
  };

  const handleView = () => {
    navigate(`/admin/contract/${contractId}/view`);
  };

  const handleDelete = () => {
    deleteContract.mutate(contractId, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Otvoriť menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border shadow-lg">
          <DropdownMenuItem onClick={handleView} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            Zobraziť
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Editovať
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Zmazať
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Zmazať zmluvu</AlertDialogTitle>
            <AlertDialogDescription>
              Ste si istí, že chcete zmazať zmluvu #{contractNumber}? 
              Táto akcia sa nedá vrátiť späť a všetky súvisiace dáta budú odstránené.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteContract.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteContract.isPending ? "Mazanie..." : "Zmazať"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ContractActionsDropdown;
