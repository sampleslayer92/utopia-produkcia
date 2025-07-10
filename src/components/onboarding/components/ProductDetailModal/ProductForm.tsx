
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { BusinessLocation } from "@/types/business";

interface ProductFormData {
  name: string;
  description: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  customValue: string;
  locationId: string;
}

interface ProductFormProps {
  formData: ProductFormData;
  onUpdateField: (field: string, value: any) => void;
  businessLocations: BusinessLocation[];
}

const ProductForm = ({ formData, onUpdateField, businessLocations }: ProductFormProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className="space-y-4">
      {/* Location Selection */}
      {businessLocations.length > 1 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t('deviceSelection.modal.selectLocation')}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select value={formData.locationId} onValueChange={(value) => onUpdateField('locationId', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('deviceSelection.modal.selectLocationPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {businessLocations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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
