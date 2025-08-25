
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

interface ContractStatusBadgeProps {
  status: string;
}

const ContractStatusBadge = ({ status }: ContractStatusBadgeProps) => {
  const { t } = useTranslation('admin');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return {
          label: t('status.draft'),
          className: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
        };
      case 'submitted':
        return {
          label: t('status.submitted'),
          className: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'
        };
      case 'approved':
        return {
          label: t('status.approved'),
          className: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
        };
      case 'signed':
        return {
          label: t('status.signed'),
          className: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200'
        };
      case 'rejected':
        return {
          label: t('status.rejected'),
          className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
        };
      case 'lost':
        return {
          label: t('status.lost'),
          className: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

export default ContractStatusBadge;
