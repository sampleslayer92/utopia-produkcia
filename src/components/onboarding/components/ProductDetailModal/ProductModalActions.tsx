
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ProductModalActionsProps {
  mode: 'add' | 'edit';
  onSave: () => void;
  onClose: () => void;
}

const ProductModalActions = ({ mode, onSave, onClose }: ProductModalActionsProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className="flex justify-end space-x-3 pt-4 border-t">
      <Button variant="outline" onClick={onClose}>
        {t('deviceSelection.modal.cancel')}
      </Button>
      <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
        {mode === 'add' ? t('deviceSelection.modal.add') : t('deviceSelection.modal.save')}
      </Button>
    </div>
  );
};

export default ProductModalActions;
