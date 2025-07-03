
import { useState } from "react";
import { useTranslation } from 'react-i18next';
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
  contractNumber: string;
}

const ContractActionsDropdown = ({ contractId, contractNumber }: ContractActionsDropdownProps) => {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const contractDeleteMutation = useContractDelete();

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
      t('modal.confirm.delete') + ` ${contractNumber}?`
    );
    
    if (!confirmed) return;

    try {
      console.log('Deleting contract from dropdown:', contractId);
      await contractDeleteMutation.mutateAsync(contractId);
      toast.success(t('messages.contractDeleted'));
    } catch (error) {
      console.error('Error deleting contract:', error);
      const errorMessage = error instanceof Error ? error.message : 'Neočakávaná chyba pri mazaní zmluvy';
      toast.error(`${t('messages.errorDeleting')}: ${errorMessage}`);
    }
    setIsOpen(false);
  };

  const handleDownload = () => {
    // TODO: Implement PDF download
    toast.info(t('messages.downloadPending'));
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">{t('buttons.openMenu')}</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          {t('buttons.view')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          {t('buttons.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          {t('buttons.downloadPdf')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDelete} 
          className="text-red-600"
          disabled={contractDeleteMutation.isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {contractDeleteMutation.isPending ? t('buttons.deleting') : t('buttons.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContractActionsDropdown;
