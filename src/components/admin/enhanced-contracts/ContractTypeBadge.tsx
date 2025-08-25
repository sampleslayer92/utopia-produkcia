
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

interface ContractTypeBadgeProps {
  type: string;
}

const ContractTypeBadge = ({ type }: ContractTypeBadgeProps) => {
  const { t } = useTranslation('admin');

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'POS':
        return {
          label: t('contracts.type.pos'),
          className: 'bg-blue-100 text-blue-700 border-blue-200'
        };
      case 'SoftPOS':
        return {
          label: t('contracts.type.softpos'),
          className: 'bg-green-100 text-green-700 border-green-200'
        };
      case 'POS + SoftPOS':
        return {
          label: t('contracts.type.hybrid'),
          className: 'bg-purple-100 text-purple-700 border-purple-200'
        };
      case 'E-commerce':
        return {
          label: t('contracts.type.ecommerce'),
          className: 'bg-orange-100 text-orange-700 border-orange-200'
        };
      default:
        return {
          label: type,
          className: 'bg-gray-100 text-gray-700 border-gray-200'
        };
    }
  };

  const config = getTypeConfig(type);

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

export default ContractTypeBadge;
