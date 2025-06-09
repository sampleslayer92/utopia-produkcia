
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface ProductFormData {
  name: string;
  description: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  customValue: string;
}

interface ProductFormProps {
  formData: ProductFormData;
  onUpdateField: (field: string, value: any) => void;
}

const ProductForm = ({ formData, onUpdateField }: ProductFormProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('deviceSelection.modal.quantity')}</Label>
          <Input
            type="number"
            min="1"
            value={formData.count}
            onChange={(e) => onUpdateField('count', parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('deviceSelection.modal.monthlyFee')}</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.monthlyFee}
            onChange={(e) => onUpdateField('monthlyFee', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('deviceSelection.modal.companyCost')}</Label>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={formData.companyCost}
          onChange={(e) => onUpdateField('companyCost', parseFloat(e.target.value) || 0)}
        />
      </div>

      {formData.name === 'Iný' && (
        <div className="space-y-2">
          <Label>{t('deviceSelection.modal.customSpecification')}</Label>
          <Textarea
            value={formData.customValue}
            onChange={(e) => onUpdateField('customValue', e.target.value)}
            placeholder={t('deviceSelection.modal.customSpecificationPlaceholder')}
          />
        </div>
      )}
    </div>
  );
};

export default ProductForm;
