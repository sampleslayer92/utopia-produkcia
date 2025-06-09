
import { useState } from "react";
import { MoreHorizontal, Eye, Edit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useContractDelete } from "@/hooks/useContractDelete";

interface ContractActionsDropdownProps {
  contractId: string;
  contractNumber: string; // Changed from number to string
}

const ContractActionsDropdown = ({ contractId, contractNumber }: ContractActionsDropdownProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { deleteContract, isDeleting } = useContractDelete();

  const handleView = () => {
    navigate(`/admin/contract/${contractId}/view`);
    setIsOpen(false);
  };

  const handleEdit = () => {
    navigate(`/admin/contract/${contractId}/edit`);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Naozaj chcete zmazať zmluvu ${contractNumber}? Táto akcia sa nedá vrátiť späť.`
    );
    
    if (!confirmed) return;

    try {
      await deleteContract(contractId);
      toast.success("Zmluva bola úspešne zmazaná");
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error("Chyba pri mazaní zmluvy");
    }
    setIsOpen(false);
  };

  const handleDownload = () => {
    // TODO: Implement PDF download
    toast.info("Sťahovanie PDF bude implementované neskôr");
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Otvoriť menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          Zobraziť
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Upraviť
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Stiahnuť PDF
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDelete} 
          className="text-red-600"
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? "Mazanie..." : "Zmazať"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContractActionsDropdown;
