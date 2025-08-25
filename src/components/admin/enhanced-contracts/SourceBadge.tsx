
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

interface SourceBadgeProps {
  source: string | null;
}

const SourceBadge = ({ source }: SourceBadgeProps) => {
  const { t } = useTranslation('admin');

  if (!source) {
    return (
      <Badge variant="outline" className="text-gray-500">
        {t('contracts.source.unknown')}
      </Badge>
    );
  }

  const getSourceConfig = (source: string) => {
    switch (source) {
      case 'telesales':
        return {
          label: t('contracts.source.telesales'),
          className: 'bg-purple-100 text-purple-700 border-purple-200'
        };
      case 'facebook':
        return {
          label: t('contracts.source.facebook'),
          className: 'bg-blue-100 text-blue-700 border-blue-200'
        };
      case 'web':
        return {
          label: t('contracts.source.web'),
          className: 'bg-green-100 text-green-700 border-green-200'
        };
      case 'email':
        return {
          label: t('contracts.source.email'),
          className: 'bg-orange-100 text-orange-700 border-orange-200'
        };
      case 'referral':
        return {
          label: t('contracts.source.referral'),
          className: 'bg-pink-100 text-pink-700 border-pink-200'
        };
      case 'other':
        return {
          label: t('contracts.source.other'),
          className: 'bg-gray-100 text-gray-700 border-gray-200'
        };
      default:
        return {
          label: source,
          className: 'bg-gray-100 text-gray-700 border-gray-200'
        };
    }
  };

  const config = getSourceConfig(source);

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

export default SourceBadge;
